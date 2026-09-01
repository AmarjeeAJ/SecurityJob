// Mirrors the backend's SLUG_TO_ROLE map (server/src/utils/job-roles.js) so the
// homepage's role links always land on a slug the backend will pre-select correctly.
export const ROLE_SLUGS = [
  { slug: 'security-guard', label: 'Security Guard', description: 'General duty security across offices, residential sites and events.', icon: 'shield', category: 'Guard & Protection', popular: true },
  { slug: 'lady-security-guard', label: 'Lady Security Guard', description: 'Frisking and access control roles for schools, malls and hospitals.', icon: 'shield', category: 'Guard & Protection' },
  { slug: 'armed-guard', label: 'Armed Guard', description: 'Licensed armed security for high-value sites.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'gunman', label: 'Gunman', description: 'Armed protection for bank branches, jewelry vaults and cash depots.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'bodyguard', label: 'Bodyguard', description: 'Personal close protection and VIP security.', icon: 'shield-check', category: 'Guard & Protection' },
  { slug: 'bouncer', label: 'Bouncer & Event Security Guards', description: 'Crowd control for events, clubs, luxury venues and VIP protection.', icon: 'hand', category: 'Guard & Protection', popular: true },
  { slug: 'event-security-guard', label: 'Event Security Guard', description: 'Short-term and event security crowd management.', icon: 'hand', category: 'Guard & Protection' },

  { slug: 'cctv-operator', label: 'CCTV Operator', description: 'Surveillance feed monitoring, control room management and incident logging.', icon: 'video', category: 'Guard & Protection', popular: true },
  { slug: 'security-supervisor', label: 'Security Supervisor', description: 'Lead guard shifts, briefings, and post allocations on-site.', icon: 'badge', category: 'Supervision & Management', popular: true },
  { slug: 'field-officer', label: 'Field Officer', description: 'Multi-site inspection, deployment audits and quality checks.', icon: 'clipboard', category: 'Supervision & Management' },
  { slug: 'security-inspector', label: 'Security Inspector', description: 'Audit compliance, turnout and site readiness.', icon: 'badge', category: 'Supervision & Management' },
  { slug: 'security-manager', label: 'Security Manager', description: 'Oversee entire security operations and strategy across sites.', icon: 'badge', category: 'Supervision & Management' },
];

export const ROLE_CATEGORIES = [...new Set(ROLE_SLUGS.map((r) => r.category))];
export const POPULAR_ROLES = ROLE_SLUGS.filter((r) => r.popular);

export default ROLE_SLUGS;
