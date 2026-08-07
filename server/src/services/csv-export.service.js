import { toCsvRow } from '../utils/csv-sanitizer.js';
import { streamCandidatesForExport } from '../modules/candidates/candidates.repository.js';

// Only the fields the registration form actually collects. Columns for
// long-removed fields (email, alternate mobile, previous company, expected
// salary, shift preference, total experience, and the ex-serviceman / police
// verification / training certificate / driving licence flags) were still
// being emitted as permanently blank, padding every row with dead commas and
// making the file hard to read — especially on a phone.
const CSV_HEADERS = [
  'Candidate ID', 'Full Name', 'Mobile Number', 'WhatsApp Number',
  'Age', 'Gender', 'Current City', 'Current Area', 'State', 'Preferred Job Roles', 'Preferred Working Cities',
  'Qualification', 'Experienced', 'Security Experience (Months)',
  'Employment Status', 'Joining Availability', 'Duty-Hour Preference',
  'Aadhaar Available', 'Source', 'Campaign', 'Landing Page', 'First Registration Date',
  'Latest Submission Date', 'Consent Status',
];

function yesNo(value) {
  return value ? 'Yes' : 'No';
}

function formatDate(value) {
  return value ? new Date(value).toISOString() : '';
}

function rowToCsvValues(row) {
  return [
    row.candidate_code,
    row.full_name,
    row.mobile_number,
    row.whatsapp_number,
    row.age,
    row.gender,
    row.current_city,
    row.current_area || '',
    row.state,
    row.role_names || '',
    row.preferred_city_names || '',
    row.highest_qualification || '',
    yesNo(row.is_experienced),
    row.security_experience_months,
    row.current_employment_status || '',
    row.joining_availability || '',
    row.duty_hour_preference || '',
    yesNo(row.aadhaar_available),
    row.source || '',
    row.campaign || '',
    row.landing_page_slug || '',
    formatDate(row.first_registered_at),
    formatDate(row.last_submitted_at),
    yesNo(row.consent_given),
  ];
}

/**
 * Streams a UTF-8 (BOM) CSV of candidate records to `res`, batching database
 * reads so the full result set is never held in memory at once.
 */
export async function streamCandidatesCsv(res, filters) {
  res.write('﻿');
  res.write(toCsvRow(CSV_HEADERS));

  let recordCount = 0;
  for await (const row of streamCandidatesForExport(filters)) {
    res.write(toCsvRow(rowToCsvValues(row)));
    recordCount += 1;
  }

  return recordCount;
}
