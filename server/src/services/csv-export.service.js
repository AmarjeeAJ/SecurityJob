import { toCsvRow } from '../utils/csv-sanitizer.js';
import { streamCandidatesForExport } from '../modules/candidates/candidates.repository.js';

const CSV_HEADERS = [
  'Candidate ID', 'Full Name', 'Mobile Number', 'WhatsApp Number', 'Alternate Mobile Number', 'Email',
  'Age', 'Gender', 'Current City', 'Current Area', 'State', 'Preferred Job Roles', 'Preferred Working Cities',
  'Qualification', 'Total Experience (Months)', 'Security Experience (Months)', 'Previous Company',
  'Employment Status', 'Joining Availability', 'Expected Salary', 'Shift Preference', 'Duty-Hour Preference',
  'Ex-Serviceman', 'Aadhaar Available', 'Police Verification Available', 'Training Certificate Available',
  'Driving Licence Available', 'Source', 'Campaign', 'Landing Page', 'First Registration Date',
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
    row.alternate_mobile_number || '',
    row.email || '',
    row.age,
    row.gender,
    row.current_city,
    row.current_area || '',
    row.state,
    row.role_names || '',
    row.preferred_city_names || '',
    row.highest_qualification || '',
    row.total_experience_months,
    row.security_experience_months,
    row.previous_company || '',
    row.current_employment_status,
    row.joining_availability,
    row.expected_salary ?? '',
    row.shift_preference || '',
    row.duty_hour_preference,
    yesNo(row.ex_serviceman),
    yesNo(row.aadhaar_available),
    yesNo(row.police_verification_available),
    yesNo(row.training_certificate_available),
    yesNo(row.driving_licence_available),
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
