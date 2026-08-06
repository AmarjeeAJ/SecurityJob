import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import generateCandidateCode from '../src/utils/candidate-code.js';

const { Pool } = pg;

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
  const client = await pool.connect();

  try {
    const ownerEmail = process.env.OWNER_DEFAULT_EMAIL;
    const ownerPassword = process.env.OWNER_DEFAULT_PASSWORD;

    if (!ownerEmail || !ownerPassword) {
      throw new Error('OWNER_DEFAULT_EMAIL and OWNER_DEFAULT_PASSWORD must be set to seed the owner account.');
    }

    const rounds = Number(process.env.PASSWORD_HASH_ROUNDS || 12);
    const passwordHash = await bcrypt.hash(ownerPassword, rounds);

    const existing = await client.query('SELECT id FROM owner_users WHERE email = $1', [ownerEmail]);
    if (existing.rows.length === 0) {
      await client.query(
        `INSERT INTO owner_users (email, password_hash, full_name) VALUES ($1, $2, $3)`,
        [ownerEmail, passwordHash, 'SecurityJob Owner']
      );
      console.log(`Seeded owner account: ${ownerEmail}`);
    } else {
      console.log(`Owner account already exists: ${ownerEmail} (skipped)`);
    }

    if (isProduction) {
      console.log('NODE_ENV=production — skipping development test-candidate seed data.');
    } else {
      const testMobile = '9999900001';
      const existingCandidate = await client.query(
        'SELECT id FROM candidates WHERE normalized_mobile_number = $1',
        [testMobile]
      );

      if (existingCandidate.rows.length === 0) {
        const candidateCode = await generateCandidateCode(client);

        const candidateResult = await client.query(
          `INSERT INTO candidates (
            candidate_code, full_name, mobile_number, normalized_mobile_number,
            whatsapp_number, normalized_whatsapp_number, age, gender, current_city, state,
            current_employment_status, joining_availability, duty_hour_preference,
            consent_given, consent_timestamp, consent_text_version
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,now(),'v1')
          RETURNING id`,
          [
            candidateCode, 'Test Candidate', testMobile, testMobile,
            testMobile, testMobile, 28, 'male', 'Jaipur', 'Rajasthan',
            'unemployed', 'immediate', 'any', true,
          ]
        );

        const candidateId = candidateResult.rows[0].id;

        await client.query(
          `INSERT INTO candidate_roles (candidate_id, role_name) VALUES ($1, $2)`,
          [candidateId, 'Security Guard']
        );
        await client.query(
          `INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, $2)`,
          [candidateId, 'Jaipur']
        );
        await client.query(
          `INSERT INTO candidate_submissions (
            candidate_id, landing_page_slug, source, medium, campaign, landing_page_url
          ) VALUES ($1, 'security-guard', 'direct', 'none', 'personal_link', 'http://localhost:5173/apply/security-guard')`,
          [candidateId]
        );
        await client.query(
          `INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug)
           VALUES ($1, 'direct', 'none', 'personal_link', 'security-guard')`,
          [candidateId]
        );

        console.log(`Seeded development test candidate: ${candidateCode}`);
      } else {
        console.log('Development test candidate already exists (skipped)');
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
