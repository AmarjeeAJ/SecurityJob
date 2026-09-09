import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/db/pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../Data');

const FILES = {
  states: path.join(DATA_DIR, 'states.31May2026.csv'),
  districts: path.join(DATA_DIR, 'districts.31May2026.csv'),
  blocks: path.join(DATA_DIR, 'subdistricts.31May2026.csv'),
  villages: path.join(DATA_DIR, 'villages.31May2026.csv'),
  villagePincodes: path.join(DATA_DIR, 'pincode_villages.31May2026.csv'),
  urbanLocalBodies: path.join(DATA_DIR, 'urban_local_bodies.31May2026.csv'),
  urbanLocalBodyWards: path.join(DATA_DIR, 'urban_local_body_wards.31May2026.csv'),
  urbanLocalBodyPincodes: path.join(DATA_DIR, 'pincode_urban.31May2026.csv'),
};

/**
 * Robust RFC 4180 compliant CSV line parser.
 * Handles quoted fields containing commas and escaped quotes correctly.
 */
function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Initialize relational database tables for LGD location hierarchy
 */
async function initializeTables(client) {
  console.log('📦 Step 1/6: Ensuring database schema and tables exist...');

  await client.query(`
    CREATE TABLE IF NOT EXISTS states (
      state_code INT PRIMARY KEY,
      state_version INT,
      state_name VARCHAR(150) NOT NULL,
      state_name_local VARCHAR(150),
      census_2001_code VARCHAR(50),
      census_2011_code VARCHAR(50),
      state_or_ut VARCHAR(10)
    );

    CREATE TABLE IF NOT EXISTS districts (
      district_code INT PRIMARY KEY,
      state_code INT NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
      district_name VARCHAR(150) NOT NULL,
      census_2001_code VARCHAR(50),
      census_2011_code VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS blocks (
      block_code INT PRIMARY KEY,
      district_code INT NOT NULL REFERENCES districts(district_code) ON DELETE CASCADE,
      state_code INT NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
      block_name VARCHAR(150) NOT NULL,
      block_version INT,
      census_2001_code VARCHAR(50),
      census_2011_code VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS villages (
      village_code INT PRIMARY KEY,
      block_code INT NOT NULL REFERENCES blocks(block_code) ON DELETE CASCADE,
      district_code INT NOT NULL REFERENCES districts(district_code) ON DELETE CASCADE,
      state_code INT NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
      village_name VARCHAR(255) NOT NULL,
      village_name_local VARCHAR(255),
      village_version INT,
      village_category VARCHAR(50),
      village_status VARCHAR(50),
      census_2001_code VARCHAR(50),
      census_2011_code VARCHAR(50),
      remark TEXT,
      pincode VARCHAR(10)
    );

    -- Urban Local Bodies: the city-equivalent of "blocks" (Municipal
    -- Corporations, Municipalities, Nagar Panchayats, ...). LGD tracks
    -- these at state level, not tied to a district_code the way rural
    -- blocks are.
    CREATE TABLE IF NOT EXISTS urban_local_bodies (
      local_body_code INT PRIMARY KEY,
      state_code INT NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
      local_body_version INT,
      local_body_name VARCHAR(255) NOT NULL,
      local_body_name_local VARCHAR(255),
      localbody_type_code VARCHAR(20),
      census_2011_code VARCHAR(50)
    );

    -- Urban Local Body Wards: the city-equivalent of "villages".
    CREATE TABLE IF NOT EXISTS urban_local_body_wards (
      ward_code INT PRIMARY KEY,
      local_body_code INT NOT NULL REFERENCES urban_local_bodies(local_body_code) ON DELETE CASCADE,
      state_code INT NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
      ward_number VARCHAR(20),
      ward_name VARCHAR(255) NOT NULL
    );

    -- An Urban Local Body commonly spans several pincodes (a city isn't
    -- one postal area), so this is a proper one-to-many mapping table
    -- rather than a single column on urban_local_bodies.
    CREATE TABLE IF NOT EXISTS urban_local_body_pincodes (
      local_body_code INT NOT NULL REFERENCES urban_local_bodies(local_body_code) ON DELETE CASCADE,
      pincode VARCHAR(10) NOT NULL,
      PRIMARY KEY (local_body_code, pincode)
    );
  `);

  // CREATE TABLE IF NOT EXISTS is a no-op on a table that already exists
  // from a prior run, so a column added to the definition above (like
  // villages.pincode) never actually lands without an explicit ALTER.
  await client.query(`
    ALTER TABLE villages ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
  `);

  console.log('🧹 Cleaning previous location data for a fresh, clean migration...');
  await client.query(`
    TRUNCATE TABLE
      urban_local_body_pincodes, urban_local_body_wards, urban_local_bodies,
      villages, blocks, districts, states
    CASCADE;
  `);
  console.log('✅ Tables initialized and ready.');
}

/**
 * Stream & insert states
 */
async function seedStates(client) {
  console.log(`\n📥 Step 2/6: Seeding states from ${path.basename(FILES.states)}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.states, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  const rows = [];
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[1] || isNaN(Number(cols[1]))) continue;

    rows.push({
      state_code: parseInt(cols[1], 10),
      state_version: cols[2] ? parseInt(cols[2], 10) : null,
      state_name: cols[3],
      state_name_local: cols[4] || null,
      census_2001_code: cols[5] || null,
      census_2011_code: cols[6] || null,
      state_or_ut: cols[7] || null,
    });
  }

  if (rows.length > 0) {
    const valueClauses = [];
    const params = [];
    let p = 1;
    for (const r of rows) {
      valueClauses.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
      params.push(
        r.state_code,
        r.state_version,
        r.state_name,
        r.state_name_local,
        r.census_2001_code,
        r.census_2011_code,
        r.state_or_ut
      );
    }
    await client.query(
      `INSERT INTO states (state_code, state_version, state_name, state_name_local, census_2001_code, census_2011_code, state_or_ut)
       VALUES ${valueClauses.join(', ')}
       ON CONFLICT (state_code) DO NOTHING;`,
      params
    );
  }

  console.log(`✅ Inserted ${rows.length} states.`);
}

/**
 * Stream & insert districts
 */
async function seedDistricts(client) {
  console.log(`\n📥 Step 3/6: Seeding districts from ${path.basename(FILES.districts)}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.districts, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  const rows = [];
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[3] || isNaN(Number(cols[3]))) continue;

    rows.push({
      district_code: parseInt(cols[3], 10),
      state_code: parseInt(cols[1], 10),
      district_name: cols[4],
      census_2001_code: cols[5] || null,
      census_2011_code: cols[6] || null,
    });
  }

  if (rows.length > 0) {
    const valueClauses = [];
    const params = [];
    let p = 1;
    for (const r of rows) {
      valueClauses.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
      params.push(r.district_code, r.state_code, r.district_name, r.census_2001_code, r.census_2011_code);
    }
    await client.query(
      `INSERT INTO districts (district_code, state_code, district_name, census_2001_code, census_2011_code)
       VALUES ${valueClauses.join(', ')}
       ON CONFLICT (district_code) DO NOTHING;`,
      params
    );
  }

  console.log(`✅ Inserted ${rows.length} districts.`);
}

/**
 * Stream & insert blocks (sub-districts)
 */
async function seedBlocks(client) {
  console.log(`\n📥 Step 4/6: Seeding blocks/sub-districts from ${path.basename(FILES.blocks)}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.blocks, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 2000;
  let totalInserted = 0;
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[5] || isNaN(Number(cols[5]))) continue;

    batch.push({
      block_code: parseInt(cols[5], 10),
      district_code: parseInt(cols[3], 10),
      state_code: parseInt(cols[1], 10),
      block_name: cols[7],
      block_version: cols[6] ? parseInt(cols[6], 10) : null,
      census_2001_code: cols[8] || null,
      census_2011_code: cols[9] || null,
    });

    if (batch.length >= BATCH_SIZE) {
      await insertBlocksBatch(client, batch);
      totalInserted += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertBlocksBatch(client, batch);
    totalInserted += batch.length;
  }

  console.log(`✅ Inserted ${totalInserted} blocks/sub-districts.`);
}

async function insertBlocksBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
    params.push(
      r.block_code,
      r.district_code,
      r.state_code,
      r.block_name,
      r.block_version,
      r.census_2001_code,
      r.census_2011_code
    );
  }
  await client.query(
    `INSERT INTO blocks (block_code, district_code, state_code, block_name, block_version, census_2001_code, census_2011_code)
     VALUES ${valueClauses.join(', ')}
     ON CONFLICT (block_code) DO NOTHING;`,
    params
  );
}

/**
 * Stream & insert villages (676k+ rows in memory-safe chunks)
 */
async function seedVillages(client) {
  console.log(`\n📥 Step 5/6: Seeding villages from ${path.basename(FILES.villages)} (~676,000 records)...`);
  const startTime = Date.now();

  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.villages, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 2500;
  let totalInserted = 0;
  let isFirst = true;

  // We wrap batch groups in a transaction to minimize WAL sync overhead
  await client.query('BEGIN');

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[5] || isNaN(Number(cols[5]))) continue;

    batch.push({
      village_code: parseInt(cols[5], 10),
      block_code: parseInt(cols[3], 10),
      district_code: parseInt(cols[1], 10),
      state_code: parseInt(cols[14], 10),
      village_name: cols[7] || 'Unnamed Village',
      village_name_local: cols[8] || null,
      village_version: cols[6] ? parseInt(cols[6], 10) : null,
      village_category: cols[9] || null,
      village_status: cols[10] || null,
      census_2001_code: cols[11] || null,
      census_2011_code: cols[12] || null,
      remark: cols[13] || null,
    });

    if (batch.length >= BATCH_SIZE) {
      await insertVillagesBatch(client, batch);
      totalInserted += batch.length;
      batch = [];

      // Commit transaction periodically every 25,000 rows
      if (totalInserted % 25000 === 0) {
        await client.query('COMMIT');
        await client.query('BEGIN');
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = Math.round(totalInserted / (elapsedSec || 1));
        const progressPct = ((totalInserted / 676760) * 100).toFixed(1);
        console.log(`  ⏱️  [Progress] Inserted ${totalInserted.toLocaleString()} villages (${progressPct}%) in ${elapsedSec}s (~${rate.toLocaleString()} rows/sec)`);
      }
    }
  }

  if (batch.length > 0) {
    await insertVillagesBatch(client, batch);
    totalInserted += batch.length;
  }

  await client.query('COMMIT');

  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Successfully inserted ${totalInserted.toLocaleString()} villages in ${totalSec}s!`);
}

async function insertVillagesBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
    params.push(
      r.village_code,
      r.block_code,
      r.district_code,
      r.state_code,
      r.village_name,
      r.village_name_local,
      r.village_version,
      r.village_category,
      r.village_status,
      r.census_2001_code,
      r.census_2011_code,
      r.remark
    );
  }
  await client.query(
    `INSERT INTO villages (
      village_code, block_code, district_code, state_code,
      village_name, village_name_local, village_version, village_category,
      village_status, census_2001_code, census_2011_code, remark
    ) VALUES ${valueClauses.join(', ')}
    ON CONFLICT (village_code) DO NOTHING;`,
    params
  );
}

/**
 * Attach official Pincode -> Village data onto the already-seeded villages
 * table (confirmed 1:1 — every village has at most one official pincode).
 * Uses UPDATE ... FROM (VALUES ...), batched, rather than one UPDATE per
 * row across ~672k records.
 */
async function seedVillagePincodes(client) {
  console.log(`\n📥 Step 6/8: Attaching official pincodes to villages from ${path.basename(FILES.villagePincodes)} (~672,000 records)...`);
  const startTime = Date.now();

  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.villagePincodes, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 2500;
  let totalUpdated = 0;
  let isFirst = true;

  await client.query('BEGIN');

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    const villageCode = cols[7];
    const pincode = cols[9];
    if (!villageCode || isNaN(Number(villageCode)) || !pincode) continue;

    batch.push({ village_code: parseInt(villageCode, 10), pincode });

    if (batch.length >= BATCH_SIZE) {
      await updateVillagePincodesBatch(client, batch);
      totalUpdated += batch.length;
      batch = [];

      if (totalUpdated % 50000 === 0) {
        await client.query('COMMIT');
        await client.query('BEGIN');
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  ⏱️  [Progress] Updated ${totalUpdated.toLocaleString()} village pincodes in ${elapsedSec}s`);
      }
    }
  }

  if (batch.length > 0) {
    await updateVillagePincodesBatch(client, batch);
    totalUpdated += batch.length;
  }

  await client.query('COMMIT');

  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Attached pincodes to ${totalUpdated.toLocaleString()} villages in ${totalSec}s!`);
}

async function updateVillagePincodesBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}::int, $${p++}::varchar)`);
    params.push(r.village_code, r.pincode);
  }
  await client.query(
    `UPDATE villages AS v SET pincode = c.pincode
     FROM (VALUES ${valueClauses.join(', ')}) AS c(village_code, pincode)
     WHERE v.village_code = c.village_code;`,
    params
  );
}

/**
 * Stream & insert Urban Local Bodies (Municipal Corporations,
 * Municipalities, Nagar Panchayats — the city-equivalent of "blocks").
 */
async function seedUrbanLocalBodies(client) {
  console.log(`\n📥 Step 7/8: Seeding Urban Local Bodies from ${path.basename(FILES.urbanLocalBodies)}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.urbanLocalBodies, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 1000;
  let totalInserted = 0;
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[3] || isNaN(Number(cols[3]))) continue;

    batch.push({
      local_body_code: parseInt(cols[3], 10),
      state_code: parseInt(cols[1], 10),
      local_body_version: cols[4] ? parseInt(cols[4], 10) : null,
      local_body_name: cols[5] || 'Unnamed Local Body',
      local_body_name_local: cols[6] || null,
      localbody_type_code: cols[7] || null,
      census_2011_code: cols[8] || null,
    });

    if (batch.length >= BATCH_SIZE) {
      await insertUrbanLocalBodiesBatch(client, batch);
      totalInserted += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertUrbanLocalBodiesBatch(client, batch);
    totalInserted += batch.length;
  }

  console.log(`✅ Inserted ${totalInserted.toLocaleString()} urban local bodies.`);
}

async function insertUrbanLocalBodiesBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
    params.push(
      r.local_body_code,
      r.state_code,
      r.local_body_version,
      r.local_body_name,
      r.local_body_name_local,
      r.localbody_type_code,
      r.census_2011_code
    );
  }
  await client.query(
    `INSERT INTO urban_local_bodies (
      local_body_code, state_code, local_body_version, local_body_name,
      local_body_name_local, localbody_type_code, census_2011_code
    ) VALUES ${valueClauses.join(', ')}
    ON CONFLICT (local_body_code) DO NOTHING;`,
    params
  );
}

/**
 * Stream & insert Urban Local Body Wards — the city-equivalent of
 * "villages", ~97,000 rows.
 */
async function seedUrbanLocalBodyWards(client) {
  console.log(`\n📥 Step 8/8: Seeding Urban Local Body Wards from ${path.basename(FILES.urbanLocalBodyWards)} (~97,000 records)...`);
  const startTime = Date.now();

  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.urbanLocalBodyWards, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 2000;
  let totalInserted = 0;
  let isFirst = true;

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    if (!cols[3] || isNaN(Number(cols[3]))) continue;

    batch.push({
      ward_code: parseInt(cols[3], 10),
      local_body_code: parseInt(cols[1], 10),
      state_code: parseInt(cols[6], 10),
      ward_number: cols[4] || null,
      ward_name: cols[5] || 'Unnamed Ward',
    });

    if (batch.length >= BATCH_SIZE) {
      await insertUrbanLocalBodyWardsBatch(client, batch);
      totalInserted += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertUrbanLocalBodyWardsBatch(client, batch);
    totalInserted += batch.length;
  }

  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Inserted ${totalInserted.toLocaleString()} urban local body wards in ${totalSec}s.`);
}

async function insertUrbanLocalBodyWardsBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}::int, $${p++}::int, $${p++}::int, $${p++}::varchar, $${p++}::varchar)`);
    params.push(r.ward_code, r.local_body_code, r.state_code, r.ward_number, r.ward_name);
  }
  // A handful of wards reference a local_body_code absent from the
  // urban_local_bodies snapshot (source data drift between LGD's two
  // downloadable files, taken at slightly different times) — skip those
  // orphans via WHERE EXISTS rather than failing the whole batch on the
  // foreign key constraint.
  await client.query(
    `INSERT INTO urban_local_body_wards (ward_code, local_body_code, state_code, ward_number, ward_name)
     SELECT v.ward_code, v.local_body_code, v.state_code, v.ward_number, v.ward_name
     FROM (VALUES ${valueClauses.join(', ')}) AS v(ward_code, local_body_code, state_code, ward_number, ward_name)
     WHERE EXISTS (SELECT 1 FROM urban_local_bodies u WHERE u.local_body_code = v.local_body_code)
     ON CONFLICT (ward_code) DO NOTHING;`,
    params
  );
}

/**
 * Stream & insert Pincode -> Urban Local Body mapping (a city commonly
 * spans several pincodes).
 */
async function seedUrbanLocalBodyPincodes(client) {
  console.log(`\n📥 Attaching pincodes to Urban Local Bodies from ${path.basename(FILES.urbanLocalBodyPincodes)}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(FILES.urbanLocalBodyPincodes, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let batch = [];
  const BATCH_SIZE = 1000;
  let totalInserted = 0;
  let isFirst = true;
  const seen = new Set();

  for await (const line of rl) {
    if (isFirst) {
      isFirst = false;
      continue;
    }
    const cols = parseCsvLine(line);
    const localBodyCode = cols[3];
    const pincode = cols[6];
    if (!localBodyCode || isNaN(Number(localBodyCode)) || !pincode) continue;

    const dedupeKey = `${localBodyCode}:${pincode}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    batch.push({ local_body_code: parseInt(localBodyCode, 10), pincode });

    if (batch.length >= BATCH_SIZE) {
      await insertUrbanLocalBodyPincodesBatch(client, batch);
      totalInserted += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertUrbanLocalBodyPincodesBatch(client, batch);
    totalInserted += batch.length;
  }

  console.log(`✅ Inserted ${totalInserted.toLocaleString()} urban local body pincode mappings.`);
}

async function insertUrbanLocalBodyPincodesBatch(client, batch) {
  const valueClauses = [];
  const params = [];
  let p = 1;
  for (const r of batch) {
    valueClauses.push(`($${p++}::int, $${p++}::varchar)`);
    params.push(r.local_body_code, r.pincode);
  }
  await client.query(
    `INSERT INTO urban_local_body_pincodes (local_body_code, pincode)
     SELECT v.local_body_code, v.pincode
     FROM (VALUES ${valueClauses.join(', ')}) AS v(local_body_code, pincode)
     WHERE EXISTS (SELECT 1 FROM urban_local_bodies u WHERE u.local_body_code = v.local_body_code)
     ON CONFLICT (local_body_code, pincode) DO NOTHING;`,
    params
  );
}

/**
 * Step 9: Create high-performance indexes for lightning-fast autocomplete and queries
 */
async function buildIndexes(client) {
  console.log('\n🚀 Step 9/9: Creating high-performance database indexes & analyzing tables...');
  const t0 = Date.now();

  await client.query(`
    -- Foreign key / filter indexes
    CREATE INDEX IF NOT EXISTS idx_districts_state_code ON districts(state_code);
    CREATE INDEX IF NOT EXISTS idx_districts_name_lower ON districts(LOWER(district_name));

    CREATE INDEX IF NOT EXISTS idx_blocks_district_code ON blocks(district_code);
    CREATE INDEX IF NOT EXISTS idx_blocks_state_code ON blocks(state_code);
    CREATE INDEX IF NOT EXISTS idx_blocks_name_lower ON blocks(LOWER(block_name));

    CREATE INDEX IF NOT EXISTS idx_villages_block_code ON villages(block_code);
    CREATE INDEX IF NOT EXISTS idx_villages_district_code ON villages(district_code);
    CREATE INDEX IF NOT EXISTS idx_villages_state_code ON villages(state_code);
    CREATE INDEX IF NOT EXISTS idx_villages_name_lower ON villages(LOWER(village_name));
    CREATE INDEX IF NOT EXISTS idx_villages_block_name ON villages(block_code, LOWER(village_name));
    CREATE INDEX IF NOT EXISTS idx_villages_pincode ON villages(pincode);

    -- Urban Local Bodies (cities) — parallel indexes to the rural block/village ones
    CREATE INDEX IF NOT EXISTS idx_ulb_state_code ON urban_local_bodies(state_code);
    CREATE INDEX IF NOT EXISTS idx_ulb_name_lower ON urban_local_bodies(LOWER(local_body_name));

    CREATE INDEX IF NOT EXISTS idx_ulb_wards_local_body_code ON urban_local_body_wards(local_body_code);
    CREATE INDEX IF NOT EXISTS idx_ulb_wards_state_code ON urban_local_body_wards(state_code);
    CREATE INDEX IF NOT EXISTS idx_ulb_wards_name_lower ON urban_local_body_wards(LOWER(ward_name));

    CREATE INDEX IF NOT EXISTS idx_ulb_pincodes_local_body_code ON urban_local_body_pincodes(local_body_code);
    CREATE INDEX IF NOT EXISTS idx_ulb_pincodes_pincode ON urban_local_body_pincodes(pincode);

    -- Analyze tables for optimal query plans
    ANALYZE states;
    ANALYZE districts;
    ANALYZE blocks;
    ANALYZE villages;
    ANALYZE urban_local_bodies;
    ANALYZE urban_local_body_wards;
    ANALYZE urban_local_body_pincodes;
  `);

  console.log(`✅ Indexes created and tables analyzed in ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
}

/**
 * Main migration execution
 */
async function runMigration() {
  console.log('====================================================');
  console.log('   🇮🇳 LGD PAN-INDIA DATABASE SEEDER (PERN STACK)    ');
  console.log('====================================================');
  const overallStart = Date.now();

  // Validate files exist
  for (const [key, filePath] of Object.entries(FILES)) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Dataset file not found for ${key}: ${filePath}`);
      process.exit(1);
    }
  }

  const client = await pool.connect();

  try {
    await initializeTables(client);
    await seedStates(client);
    await seedDistricts(client);
    await seedBlocks(client);
    await seedVillages(client);
    await seedVillagePincodes(client);
    await seedUrbanLocalBodies(client);
    await seedUrbanLocalBodyWards(client);
    await seedUrbanLocalBodyPincodes(client);
    await buildIndexes(client);

    // Final verification counts
    console.log('\n====================================================');
    console.log('   📊 FINAL DATABASE VERIFICATION ROW COUNTS       ');
    console.log('====================================================');

    const stateCount = (await client.query('SELECT COUNT(*) FROM states')).rows[0].count;
    const distCount = (await client.query('SELECT COUNT(*) FROM districts')).rows[0].count;
    const blockCount = (await client.query('SELECT COUNT(*) FROM blocks')).rows[0].count;
    const villageCount = (await client.query('SELECT COUNT(*) FROM villages')).rows[0].count;
    const villagePincodeCount = (await client.query("SELECT COUNT(*) FROM villages WHERE pincode IS NOT NULL")).rows[0].count;
    const ulbCount = (await client.query('SELECT COUNT(*) FROM urban_local_bodies')).rows[0].count;
    const wardCount = (await client.query('SELECT COUNT(*) FROM urban_local_body_wards')).rows[0].count;
    const ulbPincodeCount = (await client.query('SELECT COUNT(*) FROM urban_local_body_pincodes')).rows[0].count;

    console.log(`• States:                 ${Number(stateCount).toLocaleString()} rows`);
    console.log(`• Districts:              ${Number(distCount).toLocaleString()} rows`);
    console.log(`• Blocks:                 ${Number(blockCount).toLocaleString()} rows`);
    console.log(`• Villages:               ${Number(villageCount).toLocaleString()} rows`);
    console.log(`• Villages w/ pincode:    ${Number(villagePincodeCount).toLocaleString()} rows`);
    console.log(`• Urban Local Bodies:     ${Number(ulbCount).toLocaleString()} rows`);
    console.log(`• Urban Local Body Wards: ${Number(wardCount).toLocaleString()} rows`);
    console.log(`• Urban Local Body Pincodes: ${Number(ulbPincodeCount).toLocaleString()} rows`);

    const elapsed = ((Date.now() - overallStart) / 1000).toFixed(1);
    console.log(`\n🎉 Pan-India LGD dynamic dataset successfully migrated in ${elapsed}s!`);
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ Fatal error during LGD data migration:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
