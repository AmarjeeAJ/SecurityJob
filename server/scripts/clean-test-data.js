import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

async function cleanTestData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();

  try {
    console.log('Connecting to database to clean test candidate data...');

    // Begin transaction
    await client.query('BEGIN');

    // Count before cleaning
    const countRes = await client.query('SELECT COUNT(*) FROM candidates');
    const totalCandidates = countRes.rows[0].count;
    console.log(`Found ${totalCandidates} candidate records in database.`);

    // Truncate candidates table (cascades to candidate_roles, candidate_preferred_locations, candidate_documents, candidate_submissions, candidate_sources)
    await client.query('TRUNCATE TABLE candidates CASCADE');
    console.log('Cleared candidates and all associated child tables (roles, locations, documents, submissions, sources).');

    // Also clear export logs if exists
    try {
      await client.query('TRUNCATE TABLE export_logs CASCADE');
      console.log('Cleared export_logs.');
    } catch (e) {
      // export_logs might not exist
    }

    await client.query('COMMIT');
    console.log('✅ Successfully cleaned all test data from the database!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to clean database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanTestData();
