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
      remark TEXT
    );
  `);

  console.log('🧹 Cleaning previous location data for a fresh, clean migration...');
  await client.query('TRUNCATE TABLE villages, blocks, districts, states CASCADE;');
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
 * Step 6: Create high-performance indexes for lightning-fast autocomplete and queries
 */
async function buildIndexes(client) {
  console.log('\n🚀 Step 6/6: Creating high-performance database indexes & analyzing tables...');
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

    -- Analyze tables for optimal query plans
    ANALYZE states;
    ANALYZE districts;
    ANALYZE blocks;
    ANALYZE villages;
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
    await buildIndexes(client);

    // Final verification counts
    console.log('\n====================================================');
    console.log('   📊 FINAL DATABASE VERIFICATION ROW COUNTS       ');
    console.log('====================================================');

    const stateCount = (await client.query('SELECT COUNT(*) FROM states')).rows[0].count;
    const distCount = (await client.query('SELECT COUNT(*) FROM districts')).rows[0].count;
    const blockCount = (await client.query('SELECT COUNT(*) FROM blocks')).rows[0].count;
    const villageCount = (await client.query('SELECT COUNT(*) FROM villages')).rows[0].count;

    console.log(`• States:     ${Number(stateCount).toLocaleString()} rows`);
    console.log(`• Districts:  ${Number(distCount).toLocaleString()} rows`);
    console.log(`• Blocks:     ${Number(blockCount).toLocaleString()} rows`);
    console.log(`• Villages:   ${Number(villageCount).toLocaleString()} rows`);

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
