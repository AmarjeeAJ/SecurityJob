// Mirrors the backend's SLUG_TO_ROLE map (server/src/utils/job-roles.js) so the
// homepage's role links always land on a slug the backend will pre-select correctly.
export const ROLE_SLUGS = [
  { slug: 'security-guard', label: 'Security Guard', description: 'General duty security across offices, residential sites and events.', icon: 'shield', category: 'Guard & Protection', popular: true },
  { slug: 'lady-security-guard', label: 'Lady Security Guard', description: 'Frisking and access control roles for schools, malls and hospitals.', icon: 'shield', category: 'Guard & Protection' },
  { slug: 'armed-guard', label: 'Armed Guard', description: 'Licensed armed security for high-value sites.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'gunman', label: 'Gunman', description: 'Armed protection for cash vans and VIP details.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'bodyguard', label: 'Bodyguard', description: 'Personal protection for individuals.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'bouncer', label: 'Bouncer', description: 'Crowd control for events, clubs and venues.', icon: 'hand', category: 'Guard & Protection', popular: true },
  { slug: 'event-security-guard', label: 'Event Security Guard', description: 'Short-term security for events and gatherings.', icon: 'hand', category: 'Guard & Protection' },

  { slug: 'security-supervisor', label: 'Security Supervisor', description: 'Lead and coordinate guard teams on-site.', icon: 'badge', category: 'Supervision & Management', popular: true },
  { slug: 'field-officer', label: 'Field Officer', description: 'Multi-site inspection and quality checks.', icon: 'clipboard', category: 'Supervision & Management' },
  { slug: 'security-inspector', label: 'Security Inspector', description: 'Audit compliance and site readiness.', icon: 'badge', category: 'Supervision & Management' },
  { slug: 'security-manager', label: 'Security Manager', description: 'Manage operations across multiple sites.', icon: 'badge', category: 'Supervision & Management' },
  { slug: 'facility-supervisor', label: 'Facility Supervisor', description: 'Oversee facility upkeep and security together.', icon: 'building', category: 'Supervision & Management' },

  { slug: 'cctv-operator', label: 'CCTV Operator', description: 'Monitor live camera feeds from a control room.', icon: 'camera', category: 'Technical & Control Room', popular: true },
  { slug: 'control-room-operator', label: 'Control Room Operator', description: 'Coordinate alerts and incident response.', icon: 'monitor', category: 'Technical & Control Room' },
  { slug: 'fire-marshal', label: 'Fire Marshal', description: 'Fire safety monitoring and evacuation support.', icon: 'flame', category: 'Technical & Control Room' },
  { slug: 'dog-handler', label: 'Dog Handler', description: 'K9 patrol and detection support.', icon: 'paw', category: 'Technical & Control Room' },

  { slug: 'housekeeping-staff', label: 'Housekeeping Staff', description: 'Facility housekeeping roles.', icon: 'sparkles', category: 'Support & Logistics' },
  { slug: 'cash-van-driver', label: 'Cash Van Driver', description: 'Drive secure cash-in-transit vehicles.', icon: 'truck', category: 'Support & Logistics' },
  { slug: 'atm-custodian', label: 'ATM Custodian', description: 'ATM replenishment and site security.', icon: 'card', category: 'Support & Logistics' },
];

export const ROLE_CATEGORIES = [...new Set(ROLE_SLUGS.map((r) => r.category))];
export const POPULAR_ROLES = ROLE_SLUGS.filter((r) => r.popular);

export default ROLE_SLUGS;
