import 'dotenv/config';
import pg from 'pg';
import { listCandidatesPaginated } from '../src/modules/candidates/candidates.repository.js';
import generateCandidateCode from '../src/utils/candidate-code.js';

const { Pool } = pg;

async function testAllFilters() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();

  try {
    console.log('🧪 Starting Candidate Filter System Verification Test...\n');

    // 1. Insert 3 distinct sample candidates for testing filters
    console.log('1️⃣ Setting up test candidate records...');
    
    // Candidate 1: Mukesh Sharma (Jaipur, Malviya Nagar, Security Guard, direct)
    const code1 = await generateCandidateCode(client);
    const c1 = await client.query(
      `INSERT INTO candidates (
        candidate_code, full_name, mobile_number, normalized_mobile_number,
        whatsapp_number, normalized_whatsapp_number, age, gender, current_city, current_area, state,
        current_employment_status, joining_availability, duty_hour_preference,
        consent_given, consent_timestamp, consent_text_version, last_submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, now(), 'v1', now() - INTERVAL '2 days')
      RETURNING id`,
      [code1, 'Mukesh Sharma', '9829012345', '9829012345', '9829012345', '9829012345', 28, 'male', 'Jaipur', 'Malviya Nagar', 'Rajasthan', 'unemployed', 'immediate', '8_hours']
    );
    await client.query(`INSERT INTO candidate_roles (candidate_id, role_name) VALUES ($1, 'Security Guard')`, [c1.rows[0].id]);
    await client.query(`INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, 'Jaipur')`, [c1.rows[0].id]);
    await client.query(`INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug) VALUES ($1, 'direct', 'none', 'organic', 'security-guard')`, [c1.rows[0].id]);

    // Candidate 2: Kuldeep Singh (Kota, Industrial Area, Security Supervisor, whatsapp)
    const code2 = await generateCandidateCode(client);
    const c2 = await client.query(
      `INSERT INTO candidates (
        candidate_code, full_name, mobile_number, normalized_mobile_number,
        whatsapp_number, normalized_whatsapp_number, age, gender, current_city, current_area, state,
        current_employment_status, joining_availability, duty_hour_preference,
        consent_given, consent_timestamp, consent_text_version, last_submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, now(), 'v1', now() - INTERVAL '1 day')
      RETURNING id`,
      [code2, 'Kuldeep Singh', '9414012345', '9414012345', '9414012345', '9414012345', 34, 'male', 'Kota', 'Industrial Area', 'Rajasthan', 'employed', 'within_15_days', '12_hours']
    );
    await client.query(`INSERT INTO candidate_roles (candidate_id, role_name) VALUES ($1, 'Security Supervisor')`, [c2.rows[0].id]);
    await client.query(`INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, 'Kota')`, [c2.rows[0].id]);
    await client.query(`INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug) VALUES ($1, 'whatsapp', 'share', 'supervisor_promo', 'security-supervisor')`, [c2.rows[0].id]);

    // Candidate 3: Vikram Rathore (Jodhpur, RIICO Zone, Armed Guard, facebook)
    const code3 = await generateCandidateCode(client);
    const c3 = await client.query(
      `INSERT INTO candidates (
        candidate_code, full_name, mobile_number, normalized_mobile_number,
        whatsapp_number, normalized_whatsapp_number, age, gender, current_city, current_area, state,
        current_employment_status, joining_availability, duty_hour_preference,
        consent_given, consent_timestamp, consent_text_version, last_submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, now(), 'v1', now())
      RETURNING id`,
      [code3, 'Vikram Rathore', '9828012345', '9828012345', '9828012345', '9828012345', 30, 'male', 'Jodhpur', 'RIICO Zone', 'Rajasthan', 'unemployed', 'immediate', 'any']
    );
    await client.query(`INSERT INTO candidate_roles (candidate_id, role_name) VALUES ($1, 'Armed Guard')`, [c3.rows[0].id]);
    await client.query(`INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, 'Jodhpur')`, [c3.rows[0].id]);
    await client.query(`INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug) VALUES ($1, 'facebook', 'cpc', 'jodhpur_gunman', 'armed-guard')`, [c3.rows[0].id]);

    console.log(`   Created: ${code1} (Mukesh - Jaipur - Guard)`);
    console.log(`   Created: ${code2} (Kuldeep - Kota - Supervisor)`);
    console.log(`   Created: ${code3} (Vikram - Jodhpur - Armed Guard)`);

    // 2. Test Filters
    const testCases = [
      {
        name: 'Filter 1: No filters (All Candidates)',
        filters: { page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 3,
      },
      {
        name: 'Filter 2: Search by Name ("Mukesh")',
        filters: { search: 'Mukesh', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].full_name === 'Mukesh Sharma',
      },
      {
        name: 'Filter 3: Search by Mobile ("9414012345")',
        filters: { search: '9414012345', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].full_name === 'Kuldeep Singh',
      },
      {
        name: 'Filter 4: Search by Candidate ID Code',
        filters: { search: code3, page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].full_name === 'Vikram Rathore',
      },
      {
        name: 'Filter 5: Filter by City ("Jaipur")',
        filters: { city: 'Jaipur', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].current_city === 'Jaipur',
      },
      {
        name: 'Filter 6: Filter by Area / Locality ("RIICO")',
        filters: { area: 'RIICO', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].full_name === 'Vikram Rathore',
      },
      {
        name: 'Filter 7: Filter by Preferred Role ("Security Supervisor")',
        filters: { role: 'Security Supervisor', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].role_names.includes('Security Supervisor'),
      },
      {
        name: 'Filter 8: Filter by Source ("facebook")',
        filters: { source: 'facebook', page: 1, pageSize: 25, sortBy: 'latest_submission', sortDir: 'desc' },
        expectedCount: 1,
        validate: (rows) => rows[0].full_name === 'Vikram Rathore',
      },
      {
        name: 'Filter 9: Filter by Date Range (past 36 hours)',
        filters: {
          dateFrom: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          page: 1,
          pageSize: 25,
          sortBy: 'latest_submission',
          sortDir: 'desc',
        },
        expectedCount: 2, // Kuldeep and Vikram
      },
      {
        name: 'Filter 10: Sort by Name Ascending',
        filters: { page: 1, pageSize: 25, sortBy: 'name', sortDir: 'asc' },
        expectedCount: 3,
        validate: (rows) => rows[0].full_name === 'Kuldeep Singh' && rows[2].full_name === 'Vikram Rathore',
      },
    ];

    console.log('\n2️⃣ Executing Filter Tests against Database API repository:');
    let allPassed = true;

    for (const tc of testCases) {
      const res = await listCandidatesPaginated(tc.filters);
      const countMatch = res.total === tc.expectedCount && res.rows.length === tc.expectedCount;
      const customMatch = tc.validate ? tc.validate(res.rows) : true;
      const passed = countMatch && customMatch;

      if (passed) {
        console.log(`   ✅ ${tc.name}: PASSED (returned ${res.total} matching records)`);
      } else {
        allPassed = false;
        console.log(`   ❌ ${tc.name}: FAILED (expected ${tc.expectedCount}, got ${res.total})`);
      }
    }

    if (allPassed) {
      console.log('\n🎉 ALL 10 FILTER CRITERIA ARE 100% OPERATIONAL & WORKING ACCURATELY!');
    } else {
      console.log('\n⚠️ Some filter tests failed.');
    }
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testAllFilters();
