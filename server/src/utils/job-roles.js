export const JOB_ROLES = [
  'Security Guard',
  'Lady Security Guard',
  'Armed Guard',
  'Gunman',
  'Security Supervisor',
  'Field Officer',
  'Security Inspector',
  'Security Manager',
  'Bouncer',
  'Event Security Guard',
  'Bodyguard',
  'Other',
];

// Maps a landing-page URL slug to the job role that should be preselected on the form.
export const SLUG_TO_ROLE = {
  'security-guard': 'Security Guard',
  'lady-security-guard': 'Lady Security Guard',
  'armed-guard': 'Armed Guard',
  gunman: 'Gunman',
  'security-supervisor': 'Security Supervisor',
  'field-officer': 'Field Officer',
  'security-inspector': 'Security Inspector',
  'security-manager': 'Security Manager',
  bouncer: 'Bouncer',
  'event-security-guard': 'Event Security Guard',
  bodyguard: 'Bodyguard',
  // Backward compatibility fallbacks
  'cctv-operator': 'CCTV Operator',
  'control-room-operator': 'Control Room Operator',
  'fire-marshal': 'Fire Marshal',
  'dog-handler': 'Dog Handler',
  'facility-supervisor': 'Facility Supervisor',
  'housekeeping-staff': 'Housekeeping Staff',
  'cash-van-driver': 'Cash Van Driver',
  'atm-custodian': 'ATM Custodian',
};

export function roleForSlug(slug) {
  return SLUG_TO_ROLE[slug] || null;
}

export default JOB_ROLES;
