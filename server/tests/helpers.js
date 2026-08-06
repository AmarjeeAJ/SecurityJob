import crypto from 'node:crypto';
import pool from '../src/db/pool.js';

export function randomMobile() {
  const suffix = crypto.randomInt(1000000, 9999999);
  return `9${String(suffix).padStart(9, '0')}`;
}

// Letters-only tag (fullName validation rejects digits), safe to append to test names.
export function randomNameTag() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let tag = '';
  for (let i = 0; i < 8; i += 1) {
    tag += letters[crypto.randomInt(0, letters.length)];
  }
  return tag;
}

export async function deleteCandidateByMobile(mobile) {
  await pool.query('DELETE FROM candidates WHERE normalized_mobile_number = $1', [mobile]);
}

export function baseRegistrationFields(mobile) {
  return {
    fullName: 'Test Candidate',
    mobileNumber: mobile,
    whatsappNumber: mobile,
    age: '27',
    gender: 'male',
    currentCity: 'Jaipur',
    currentArea: 'Vaishali Nagar',
    state: 'Rajasthan',
    preferredRoles: JSON.stringify(['Security Guard']),
    preferredLocations: JSON.stringify(['Jaipur']),
    currentEmploymentStatus: 'unemployed',
    joiningAvailability: 'immediate',
    dutyHourPreference: 'any',
    consentGiven: 'true',
  };
}
