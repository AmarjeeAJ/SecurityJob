export const JOB_ROLES = [
  'Security Guard',
  'Lady Security Guard',
  'Armed Guard',
  'Gunman',
  'CCTV Operator',
  'Security Supervisor',
  'Field Officer',
  'Security Inspector',
  'Security Manager',
  'Bouncer',
  'Event Security Guard',
  'Bodyguard',
  'Facility Supervisor',
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
  'facility-supervisor': 'Facility Supervisor',
  // Removed: control-room-operator, fire-marshal, dog-handler,
  // housekeeping-staff, cash-van-driver, atm-custodian — no longer
  // offered roles, dropped from JOB_ROLES above. A candidate landing on
  // one of these old slugs now just gets no role preselected (roleForSlug
  // returns null) instead of a role that would fail validation.
};

export function roleForSlug(slug) {
  return SLUG_TO_ROLE[slug] || null;
}

export default JOB_ROLES;
