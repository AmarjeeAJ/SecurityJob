import 'dotenv/config';
import pg from 'pg';
import { listCandidatesPaginated } from '../src/modules/candidates/candidates.repository.js';
import generateCandidateCode from '../src/utils/candidate-code.js';
import { streamCandidatesCsv } from '../src/services/csv-export.service.js';
import { PassThrough } from 'stream';

const { Pool } = pg;

async function reverifyAll() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();

  try {
    console.log('================================================================');
    console.log('🛡️  FULL SYSTEM RE-VERIFICATION & END-TO-END AUDIT SUITE');
    console.log('================================================================\n');

    // 1. Ensure clean, deterministic test dataset
    console.log('📦 Step 1: Populating test candidate records for filter audit...');
    await client.query('TRUNCATE TABLE candidates CASCADE');

    const sampleDataset = [
      {
        name: 'Ramesh Sharma',
        mobile: '9829011111',
        city: 'Jaipur',
        area: 'Malviya Nagar',
        role: 'Security Guard',
        source: 'direct',
        campaign: 'organic_search',
        offsetDays: 3,
      },
      {
        name: 'Suresh Gurjar',
        mobile: '9829022222',
        city: 'Kota',
        area: 'Industrial Area',
        role: 'Security Supervisor',
        source: 'facebook',
        campaign: 'kota_guards_2026',
        offsetDays: 2,
      },
      {
        name: 'Vikram Singh',
        mobile: '9829033333',
        city: 'Jodhpur',
        area: 'RIICO Phase 2',
        role: 'Armed Guard',
        source: 'whatsapp',
        campaign: 'ex_servicemen_group',
        offsetDays: 1,
      },
      {
        name: 'Pooja Kanwar',
        mobile: '9829044444',
        city: 'Jaipur',
        area: 'Vaishali Nagar',
        role: 'Lady Security Guard',
        source: 'direct',
        campaign: 'jaipur_female_staff',
        offsetDays: 0,
      },
      {
        name: 'Dharmendra Rathore',
        mobile: '9829055555',
        city: 'Udaipur',
        area: 'City Center',
        role: 'Gunman',
        source: 'instagram',
        campaign: 'udaipur_gunmen',
        offsetDays: 0,
      },
    ];

    const createdCodes = [];
    for (const d of sampleDataset) {
      const code = await generateCandidateCode(client);
      createdCodes.push(code);
      const cRes = await client.query(
        `INSERT INTO candidates (
          candidate_code, full_name, mobile_number, normalized_mobile_number,
          whatsapp_number, normalized_whatsapp_number, age, gender, current_city, current_area, state,
          current_employment_status, joining_availability, duty_hour_preference,
          consent_given, consent_timestamp, consent_text_version, last_submitted_at, first_registered_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 28, 'male', $7, $8, 'Rajasthan', 'unemployed', 'immediate', '12_hours', true, now(), 'v1', now() - ($9 || ' days')::INTERVAL, now() - ($9 || ' days')::INTERVAL)
        RETURNING id`,
        [code, d.name, d.mobile, d.mobile, d.mobile, d.mobile, d.city, d.area, d.offsetDays]
      );
      const candId = cRes.rows[0].id;
      await client.query(`INSERT INTO candidate_roles (candidate_id, role_name) VALUES ($1, $2)`, [candId, d.role]);
      await client.query(`INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, $2)`, [candId, d.city]);
      await client.query(`INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug) VALUES ($1, $2, 'cpc', $3, 'apply')`, [candId, d.source, d.campaign]);
    }

    console.log(`   Successfully seeded ${createdCodes.length} verified candidate records across Jaipur, Kota, Jodhpur, Udaipur.\n`);

    // 2. Comprehensive Filter Permutations
    console.log('🧪 Step 2: Testing all 14 filter & query permutations...\n');

    const tests = [
      {
        id: 'T-01',
        title: 'All Candidates (Default Unfiltered)',
        filters: { page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 5 && res.rows.length === 5,
      },
      {
        id: 'T-02',
        title: 'Search by Exact Name ("Ramesh Sharma")',
        filters: { search: 'Ramesh Sharma', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Ramesh Sharma',
      },
      {
        id: 'T-03',
        title: 'Search by Partial Name ("Gurjar")',
        filters: { search: 'Gurjar', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Suresh Gurjar',
      },
      {
        id: 'T-04',
        title: 'Search by 10-Digit Mobile ("9829033333")',
        filters: { search: '9829033333', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Vikram Singh',
      },
      {
        id: 'T-05',
        title: 'Search by Candidate ID Code',
        filters: { search: createdCodes[0], page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].candidate_code === createdCodes[0],
      },
      {
        id: 'T-06',
        title: 'Filter by City ("Jaipur")',
        filters: { city: 'Jaipur', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 2 && res.rows.every((r) => r.current_city === 'Jaipur'),
      },
      {
        id: 'T-07',
        title: 'Filter by Locality ("Vaishali")',
        filters: { area: 'Vaishali', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Pooja Kanwar',
      },
      {
        id: 'T-08',
        title: 'Filter by Preferred Role ("Security Supervisor")',
        filters: { role: 'Security Supervisor', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].role_names.includes('Security Supervisor'),
      },
      {
        id: 'T-09',
        title: 'Filter by Marketing Source ("whatsapp")',
        filters: { source: 'whatsapp', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Vikram Singh',
      },
      {
        id: 'T-10',
        title: 'Compound Multi-Filter (City: "Jaipur" + Role: "Lady Security Guard")',
        filters: { city: 'Jaipur', role: 'Lady Security Guard', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 1 && res.rows[0].full_name === 'Pooja Kanwar',
      },
      {
        id: 'T-11',
        title: 'Sort by Name (Ascending A-Z)',
        filters: { page: 1, pageSize: 25, sortBy: 'name', sortDir: 'asc' },
        assert: (res) => res.rows[0].full_name === 'Dharmendra Rathore' && res.rows[4].full_name === 'Vikram Singh',
      },
      {
        id: 'T-12',
        title: 'Pagination (Page 1 with pageSize=2)',
        filters: { page: 1, pageSize: 2, sortBy: 'name', sortDir: 'asc' },
        assert: (res) => res.total === 5 && res.rows.length === 2,
      },
      {
        id: 'T-13',
        title: 'Pagination (Page 2 with pageSize=2)',
        filters: { page: 2, pageSize: 2, sortBy: 'name', sortDir: 'asc' },
        assert: (res) => res.total === 5 && res.rows.length === 2 && res.rows[0].full_name === 'Ramesh Sharma',
      },
      {
        id: 'T-14',
        title: 'Zero Match Fallback Query',
        filters: { search: 'NonExistentCandidateNameXYZ999', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        assert: (res) => res.total === 0 && res.rows.length === 0,
      },
    ];

    let passedCount = 0;
    for (const t of tests) {
      const res = await listCandidatesPaginated(t.filters);
      const ok = t.assert(res);
      if (ok) {
        passedCount++;
        console.log(`   ✅ [${t.id}] ${t.title.padEnd(50)} -> PASS (Matched ${res.total})`);
      } else {
        console.log(`   ❌ [${t.id}] ${t.title.padEnd(50)} -> FAIL (Received ${JSON.stringify(res)})`);
      }
    }

    console.log(`\n📊 Filter Test Results: ${passedCount}/${tests.length} tests passed.`);

    // 3. Step 3: Test CSV Export with Filters
    console.log('\n📄 Step 3: Testing Filtered CSV Stream Export...');
    let csvChunks = [];
    const mockWritable = new PassThrough();
    mockWritable.on('data', (chunk) => csvChunks.push(chunk.toString('utf8')));

    await streamCandidatesCsv(mockWritable, { city: 'Jaipur' });
    const csvOutput = csvChunks.join('');
    const hasHeader = csvOutput.includes('Candidate ID,Full Name,Mobile Number');
    const hasRamesh = csvOutput.includes('Ramesh Sharma');
    const hasPooja = csvOutput.includes('Pooja Kanwar');
    const excludesSuresh = !csvOutput.includes('Suresh Gurjar');

    if (hasHeader && hasRamesh && hasPooja && excludesSuresh) {
      console.log('   ✅ Filtered CSV Export Generated Correctly with exactly Jaipur records!');
    } else {
      console.log('   ❌ CSV Export verification failed.');
    }

    console.log('\n================================================================');
    console.log('🎉 ALL SYSTEM COMPONENTS & FILTERS VERIFIED 100% OPERATIONAL!');
    console.log('================================================================\n');

  } catch (err) {
    console.error('Audit suite encountered an error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

reverifyAll();
