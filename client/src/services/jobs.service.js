import ROLE_SLUGS from '../utils/roleSlugs.js';
import { INDIAN_CITIES } from '../utils/locations.js';

// Comprehensive, realistic security industry job catalog matching core security roles
// Comprehensive, realistic security industry job catalog matching core security roles in Rajasthan
export const JOBS_CATALOG = [
  {
    id: 'sj-001',
    slug: 'security-guard',
    title: 'Security Guard',
    category: 'Guard & Protection',
    popular: true,
    featured: true,
    employer: 'Premier Facility & Security Services',
    locations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Alwar', 'Bhiwadi', 'Neemrana', 'Bhilwara', 'Bikaner'],
    primaryLocation: 'Jaipur, Alwar & Jodhpur',
    salaryMin: 16000,
    salaryMax: 24000,
    salaryPeriod: 'month',
    salaryDisplay: '₹16,000 – ₹24,000 / month',
    experienceRequired: '0 - 3 years (Freshers Welcome)',
    experienceLevel: 'Fresher / Experienced',
    qualification: '10th Pass / 12th Pass',
    shift: '8 Hours / 12 Hours (Day/Night Rotational)',
    jobType: 'Full-time',
    vacancies: 45,
    genderEligibility: 'Male / Female',
    postedDate: 'Recently Posted',
    summary: 'Responsible for safeguarding client premises, access control, monitoring visitor logs, and maintaining perimeter security.',
    overview: 'Join leading security agency deployments across Rajasthan commercial complexes, IT parks, retail malls, residential societies, and industrial premises. Free uniforms and standard statutory benefits provided by employers.',
    responsibilities: [
      'Perform access control and identity verification at entry/exit gates',
      'Maintain visitor, vehicle, and material inward/outward registers',
      'Conduct regular foot patrols across designated facility perimeters',
      'Monitor safety hazards and report incidents promptly to supervisors',
      'Assist visitors with basic directions while upholding site decorum',
      'Operate hand-held metal detectors (HHMD) and under-vehicle search mirrors when required',
    ],
    requirements: [
      'Minimum age: 18 years, Maximum age: 50 years',
      'Physical fitness and clean background verification',
      'Ability to read and write basic Hindi/English for register entries',
      'Aadhaar card and local address proof',
    ],
    benefits: [
      'PF (Provident Fund) and ESIC health coverage',
      'Uniform & duty shoes provided',
      'Overtime allowance as per site norms',
      'On-site accommodation / hostel assistance at select locations',
    ],
    documentsRequired: [
      'Aadhaar Card (Front & Back)',
      '10th / School Leaving Certificate or Marksheet',
      '2 Passport Size Photographs',
      'Bank Account Passbook / Cancelled Cheque',
    ],
  },
  {
    id: 'sj-002',
    slug: 'lady-security-guard',
    title: 'Lady Security Guard',
    category: 'Guard & Protection',
    popular: true,
    featured: true,
    employer: 'Apex Facility Solutions & Hospital Security',
    locations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bhilwara', 'Bikaner', 'Sikar'],
    primaryLocation: 'Jaipur, Udaipur & Kota',
    salaryMin: 17000,
    salaryMax: 25000,
    salaryPeriod: 'month',
    salaryDisplay: '₹17,000 – ₹25,000 / month',
    experienceRequired: '0 - 2 years (Freshers Welcome)',
    experienceLevel: 'Fresher / Experienced',
    qualification: '10th Pass / 12th Pass',
    shift: '8 Hours / 12 Hours (Day Shifts Preferred)',
    jobType: 'Full-time',
    vacancies: 30,
    genderEligibility: 'Female Only',
    postedDate: 'Recently Posted',
    summary: 'Dedicated female security personnel for frisking, access control, and visitor assistance at hospitals, corporate offices, schools, and malls in Rajasthan.',
    overview: 'Specialized female security roles in safe, structured environments including schools, female staff corporate campuses, shopping malls, and healthcare institutions across Rajasthan.',
    responsibilities: [
      'Conduct respectful frisking and bag checks for female visitors and employees',
      'Monitor female-dedicated floors, locker rooms, and restricted office zones',
      'Assist female visitors, students, and patients with courteous orientation',
      'Maintain front desk and reception security entry registers',
      'Coordinate with senior security control room officers on duty alerts',
    ],
    requirements: [
      'Age: 18 to 45 years',
      'Height: 152 cm (5 ft) or above preferred',
      'Pleasant demeanor, punctual, and disciplined',
      'Basic communication skills in Hindi and regional language',
    ],
    benefits: [
      'PF, ESIC and statutory medical benefits',
      'Day shifts with scheduled weekly offs',
      'Safe corporate and educational campus work environments',
      'Uniform provided by agency',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Educational Qualification Marksheet',
      'Bank Account Details',
      'Photographs',
    ],
  },
  {
    id: 'sj-003',
    slug: 'security-supervisor',
    title: 'Security Supervisor',
    category: 'Supervision & Management',
    popular: true,
    featured: true,
    employer: 'Frontline Security Management Services',
    locations: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bhiwadi', 'Neemrana', 'Alwar'],
    primaryLocation: 'Jaipur, Bhiwadi & Udaipur',
    salaryMin: 24000,
    salaryMax: 36000,
    salaryPeriod: 'month',
    salaryDisplay: '₹24,000 – ₹36,000 / month',
    experienceRequired: '2 - 6 years in Security / Facility',
    experienceLevel: 'Experienced (2+ Years)',
    qualification: '12th Pass / Graduate',
    shift: '12 Hours (Rotational)',
    jobType: 'Full-time',
    vacancies: 20,
    genderEligibility: 'Male / Female',
    postedDate: '2 days ago',
    summary: 'Lead guard shifts, conduct daily briefings, manage site attendance rosters, and coordinate emergency responses in Rajasthan facilities.',
    overview: 'Supervisory role overseeing on-site guard deployments, shift handover protocols, client escalation management, and site safety audits across corporate headquarters, manufacturing plants, and residential townships in Rajasthan.',
    responsibilities: [
      'Conduct daily guard muster roll, turnout inspection, and post allocations',
      'Oversee visitor management, material passes, and loading bay protocols',
      'Act as primary point of contact for site client managers and administrative officers',
      'Investigate site incidents, draft initial incident reports, and preserve evidence',
      'Conduct bi-weekly mock drills for fire safety and emergency evacuation',
      'Ensure 100% adherence to PSARA guidelines and client SOPs',
    ],
    requirements: [
      'Minimum 2 years experience as a Senior Guard or Security Supervisor',
      'Working knowledge of security registers, CCTV overview, and basic smartphone reporting apps',
      'Strong leadership, team coordination, and crisis de-escalation skills',
      'Ex-servicemen / NCC certificate holders given priority',
    ],
    benefits: [
      'Attractive performance incentive and supervisory allowance',
      'PF, ESIC, and annual bonus as per labour standards',
      'Clear career progression to Assistant Field Officer (AFO) and Field Officer',
    ],
    documentsRequired: [
      'Aadhaar Card & PAN Card',
      'Experience Certificates / Relieving Letters from past security agencies',
      '12th / Degree Certificate',
      'Bank Passbook & Photos',
    ],
  },
  {
    id: 'sj-005',
    slug: 'armed-guard',
    title: 'Armed Guard',
    category: 'Guard & Protection',
    popular: true,
    featured: true,
    employer: 'SecureCash & High-Value Asset Protection',
    locations: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Sikar', 'Barmer'],
    primaryLocation: 'Jaipur, Jodhpur & Rajasthan Hubs',
    salaryMin: 26000,
    salaryMax: 40000,
    salaryPeriod: 'month',
    salaryDisplay: '₹26,000 – ₹40,000 / month',
    experienceRequired: '2+ years with valid gun licence',
    experienceLevel: 'Licensed Gunman / Armed Specialist',
    qualification: '10th Pass / Ex-Servicemen Preferred',
    shift: '8 Hours / 12 Hours (Day/Night)',
    jobType: 'Full-time',
    vacancies: 15,
    genderEligibility: 'Male',
    postedDate: '3 days ago',
    summary: 'Licensed armed personnel for banking institutions, jewellery vaults, cash management, and high-value cargo protection in Rajasthan.',
    overview: 'High-responsibility armed security roles offering competitive compensation for candidates with valid Indian Arms licences (DBBL / SBBL / Revolver / Pistol). Weapons maintenance and safe handling mandatory.',
    responsibilities: [
      'Provide lethal and non-lethal armed deterrent at banking branches, ATM vaults, and currency chests',
      'Escort cash-in-transit transit vehicles during intra-state Rajasthan routes',
      'Safeguard VIP clients and high-value commercial assets',
      'Maintain arms cleaning logs and ensure ammunition safety compliance',
    ],
    requirements: [
      'Valid Indian Arms Licence with Rajasthan / All-India jurisdiction',
      'Ex-Servicemen (Army, Navy, Air Force, BSF, CRPF, CISF, Police) preferred',
      'Sound mental and physical fitness certificate',
    ],
    benefits: [
      'High monthly remuneration with weapon allowance',
      'Insurance coverage and medical benefits',
      'Prompt monthly salary disbursement',
    ],
    documentsRequired: [
      'Valid Indian Gun Licence Book (All pages)',
      'Discharge Book / Service Record (for Ex-Servicemen)',
      'Aadhaar & PAN Card',
      'Weapon Registration Proof',
    ],
  },
  {
    id: 'sj-005b',
    slug: 'cctv-operator',
    title: 'CCTV Operator',
    category: 'Guard & Protection',
    popular: true,
    featured: true,
    employer: 'Modern Surveillance & Facility Management',
    locations: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Alwar', 'Bhiwadi', 'Ajmer', 'Bhilwara'],
    primaryLocation: 'Jaipur, Jodhpur & Udaipur',
    salaryMin: 18000,
    salaryMax: 28000,
    salaryPeriod: 'month',
    salaryDisplay: '₹18,000 – ₹28,000 / month',
    experienceRequired: '0 - 3 years in CCTV / Surveillance Room',
    experienceLevel: 'Fresher / Experienced',
    qualification: '10th / 12th Pass / Basic Computer Knowledge',
    shift: '8 Hours / 12 Hours (Rotational Shifts)',
    jobType: 'Full-time',
    vacancies: 30,
    genderEligibility: 'Male / Female',
    postedDate: 'Recently Posted',
    summary: 'Monitor live multi-camera feeds, detect security anomalies, log visitor activity, and coordinate emergency responses from the central control room.',
    overview: 'Control room surveillance roles across IT parks, shopping malls, luxury hotels, residential townships, and industrial plants across Rajasthan.',
    responsibilities: [
      'Monitor multi-channel CCTV surveillance monitors in real time',
      'Identify perimeter breaches, unattended items, and suspicious activities',
      'Maintain daily digital incident logs and export video footage upon supervisor request',
      'Coordinate with on-ground patrolling security guards via walkie-talkie radio',
      'Test and ensure continuous recording functionality of DVR/NVR servers',
    ],
    requirements: [
      'Basic familiarity with computer operations and monitor screens',
      'Good observational attention to detail and ability to stay alert during shifts',
      'Clean background record and valid identification documents',
    ],
    benefits: [
      'Statutory PF & ESIC coverage with regular salary credit',
      'AC Control Room working environment',
      'Shift allowance and overtime benefits as applicable',
    ],
    documentsRequired: [
      'Aadhaar Card',
      '10th / 12th Marksheet or Certificate',
      'Bank Account Passbook',
      '2 Passport Size Photographs',
    ],
  },
  {
    id: 'sj-006',
    slug: 'bouncer',
    title: 'Bouncer & Event Security Guards',
    category: 'Guard & Protection',
    popular: true,
    featured: true,
    employer: 'Elite Event Security & Hospitality Group',
    locations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Pushkar', 'Kota', 'Bikaner', 'Jaisalmer'],
    primaryLocation: 'Jaipur, Udaipur & Jodhpur (Palaces & Resorts)',
    salaryMin: 22000,
    salaryMax: 35000,
    salaryPeriod: 'month',
    salaryDisplay: '₹22,000 – ₹35,000 / month',
    experienceRequired: '1 - 5 years in Crowd Control / Hospitality Security',
    experienceLevel: 'Experienced (Physique & Height Criteria)',
    qualification: '10th Pass / 12th Pass',
    shift: 'Evening / Night Shifts & Weekend Events',
    jobType: 'Full-time / Event Contract',
    vacancies: 25,
    genderEligibility: 'Male / Female',
    postedDate: 'Recently Posted',
    summary: 'Professional crowd control, VIP protection, and venue safety at heritage palaces, luxury resorts, private events, weddings, and concerts in Rajasthan.',
    overview: 'Immediate requirements for disciplined, well-built bouncers for luxury hospitality venues, destination royal weddings, exhibitions, and upscale lounges across Rajasthan.',
    responsibilities: [
      'Manage venue entrance queues, age verification, and dress code checks',
      'Prevent entry of unauthorized persons, weapons, and banned substances',
      'Diffuse verbal altercations and escort disruptive guests off premises safely',
      'Maintain close security around VIP tables, stages, and private banquet halls',
      'Coordinate with local law enforcement and venue managers during emergencies',
    ],
    requirements: [
      'Height: 5ft 10in (178 cm) or above for male; 5ft 6in (168 cm) for female',
      'Strong athletic physique and clean police background record',
      'Calm temperament under pressure with strong communication skills',
    ],
    benefits: [
      'Competitive pay with event-based tip sharing and food provided on shift',
      'Flexible options for full-time contracts or high-pay weekend assignments',
      'Branded dark suit / tactical uniform provided',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Full-Length Photograph showing physique',
      'Police Clearance / Verification Certificate',
      'Bank Account Details',
    ],
  },
  {
    id: 'sj-007',
    slug: 'field-officer',
    title: 'Field Officer',
    category: 'Supervision & Management',
    popular: false,
    featured: false,
    employer: 'National Security Agency Operations',
    locations: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Alwar', 'Bhiwadi', 'Ajmer', 'Bhilwara'],
    primaryLocation: 'Jaipur, Alwar & Jodhpur Hubs',
    salaryMin: 28000,
    salaryMax: 42000,
    salaryPeriod: 'month',
    salaryDisplay: '₹28,000 – ₹42,000 / month',
    experienceRequired: '3 - 8 years in Security Operations',
    experienceLevel: 'Senior Operations',
    qualification: 'Graduate / Ex-Defence JCO / Police',
    shift: 'General Shift + Night Surprise Audits',
    jobType: 'Full-time',
    vacancies: 10,
    genderEligibility: 'Male',
    postedDate: '4 days ago',
    summary: 'Multi-site operational management, client relationship handling, guard deployment audits, and recruitment coordination across Rajasthan.',
    overview: 'Lead field operations across 10 to 20 client sites in Rajasthan. Ensure 100% guard turnout, resolve site billing hours, conduct client feedback meetings, and manage emergency replacements.',
    responsibilities: [
      'Conduct scheduled day visits and surprise night inspections across assigned units',
      'Monitor guard attendance, uniform compliance, weapon handling, and register records',
      'Meet site facility managers weekly to review security performance and solve escalations',
      'Manage guard shortfalls by deploying reliever staff promptly',
      'Coordinate with branch office for payroll signoffs, OT validation, and new guard induction',
    ],
    requirements: [
      'Two-wheeler with valid driving licence mandatory',
      'Prior experience managing 100+ security personnel in agency operations',
      'Good written & spoken communication skills in Hindi & English',
    ],
    benefits: [
      'Fuel allowance and travel reimbursement',
      'Mobile bill reimbursement',
      'PF, ESIC, and annual performance incentive',
    ],
    documentsRequired: [
      'Aadhaar Card, PAN Card, Driving Licence',
      'Past Employer Relieving Letters',
      'Degree Certificates',
    ],
  },
  {
    id: 'sj-008',
    slug: 'bodyguard',
    title: 'Bodyguard / PSO',
    category: 'Guard & Protection',
    popular: false,
    featured: false,
    employer: 'Executive Close Protection Services',
    locations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Jaisalmer'],
    primaryLocation: 'Jaipur, Udaipur & Jodhpur',
    salaryMin: 35000,
    salaryMax: 60000,
    salaryPeriod: 'month',
    salaryDisplay: '₹35,000 – ₹60,000 / month',
    experienceRequired: '3+ years in VIP Protection / Commando Background',
    experienceLevel: 'Executive Protection Specialist',
    qualification: '12th Pass / Graduate / Ex-Army / Para / NSG',
    shift: 'Flexible / As per Principal Schedule',
    jobType: 'Full-time',
    vacancies: 8,
    genderEligibility: 'Male / Female',
    postedDate: '5 days ago',
    summary: 'Personal Security Officer (PSO) providing close protection for business leaders, high-net-worth families, and public figures in Rajasthan.',
    overview: 'Elite personal security role requiring tactical awareness, route reconnaissance, defensive driving coordination, and unobtrusive escort for principals in Rajasthan.',
    responsibilities: [
      'Maintain close personal escort during daily transit, public appearances, and office visits',
      'Perform advance route checks, venue safety inspections, and secure entrance assessments',
      'Manage crowd proximity and prevent unauthorized approaches',
      'Coordinate with principal’s executive chauffeur and administrative team',
    ],
    requirements: [
      'Certified close protection training or ex-special forces / NSG / Commando background',
      'Valid arms licence (Revolver/Pistol preferred for armed PSO roles)',
      'Sharp attire, polite protocol etiquette, and absolute confidentiality',
    ],
    benefits: [
      'Premium compensation package',
      'Travel and accommodation covered during outstation trips',
      'Comprehensive accident insurance',
    ],
    documentsRequired: [
      'Aadhaar & PAN Card',
      'Arms Licence (if applying for Armed PSO)',
      'Military / Commando Service Record (if Ex-Serviceman)',
    ],
  },
  {
    id: 'sj-009',
    slug: 'gunman',
    title: 'Gunman',
    category: 'Guard & Protection',
    popular: false,
    featured: false,
    employer: 'Securitas & Vault Logistics',
    locations: ['Jaipur', 'Jodhpur', 'Bikaner', 'Ajmer', 'Udaipur', 'Kota', 'Sikar', 'Alwar'],
    primaryLocation: 'Jaipur, Jodhpur & Bikaner',
    salaryMin: 25000,
    salaryMax: 38000,
    salaryPeriod: 'month',
    salaryDisplay: '₹25,000 – ₹38,000 / month',
    experienceRequired: '1+ years with licensed weapon',
    experienceLevel: 'Licensed Gunman',
    qualification: '10th Pass',
    shift: '12 Hours (Day/Night)',
    jobType: 'Full-time',
    vacancies: 20,
    genderEligibility: 'Male',
    postedDate: '1 week ago',
    summary: 'Stationary and mobile armed security for retail jewelers, cash depots, and private industrial estates in Rajasthan.',
    overview: 'Deploy with valid 12 Bore DBBL/SBBL or NPB weapon at designated high-value retail and banking sites in Rajasthan. Prompt salary with arms maintenance allowance.',
    responsibilities: [
      'Stationed at entry portals of jewellery stores, commercial banks, and gold loan branches',
      'Maintain continuous vigil and challenge unauthorized access attempts',
      'Ensure weapon is handled with safety lock on at all times',
    ],
    requirements: [
      'Valid Gun Licence valid in Rajasthan / All India',
      'Weapon in certified working condition with ammunition permit',
    ],
    benefits: ['PF, ESIC, Monthly Weapon Allowance', 'Permanent site placement'],
    documentsRequired: ['Gun Licence Copy', 'Aadhaar Card', 'Address Proof'],
  },
  {
    id: 'sj-017',
    slug: 'event-security-guard',
    title: 'Event Security Guard',
    category: 'Guard & Protection',
    popular: false,
    featured: false,
    employer: 'Exhibition & Concert Security Crew',
    locations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Pushkar', 'Jaisalmer', 'Kota', 'Kumbhalgarh'],
    primaryLocation: 'Jaipur & Udaipur Destination Palaces',
    salaryMin: 18000,
    salaryMax: 26000,
    salaryPeriod: 'month',
    salaryDisplay: '₹18,000 – ₹26,000 / month (or Daily Pay ₹900 - ₹1400/shift)',
    experienceRequired: '0 - 2 years',
    experienceLevel: 'Fresher / Experienced',
    qualification: '10th Pass',
    shift: 'Event Shifts (Day/Night)',
    jobType: 'Full-time / Event Contract',
    vacancies: 40,
    genderEligibility: 'Male / Female',
    postedDate: 'Recently Posted',
    summary: 'Short-term and seasonal crowd management for destination weddings, trade expos, stadium concerts, and corporate summits in Rajasthan.',
    overview: 'Great opportunity for candidates seeking high-energy event assignments in Rajasthan destination wedding palaces, heritage resorts, and Jaipur expo centers.',
    responsibilities: [
      'Manage venue ticket entry gates and wristband checkpoints',
      'Direct visitor vehicle parking in designated fairgrounds',
      'Assist guests with polite directions and maintain queue discipline',
    ],
    requirements: ['Neat grooming, polite behavior, and energetic attitude'],
    benefits: ['Meals provided during shifts', 'Prompt event payout options'],
    documentsRequired: ['Aadhaar Card', 'Bank Details'],
  },
  {
    id: 'sj-018',
    slug: 'security-inspector',
    title: 'Security Inspector',
    category: 'Supervision & Management',
    popular: false,
    featured: false,
    employer: 'National Security Quality Audit Group',
    locations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Alwar', 'Bhiwadi', 'Ajmer'],
    primaryLocation: 'Jaipur & Rajasthan Industrial Hubs',
    salaryMin: 28000,
    salaryMax: 40000,
    salaryPeriod: 'month',
    salaryDisplay: '₹28,000 – ₹40,000 / month',
    experienceRequired: '3 - 7 years in Security Compliance & Audits',
    experienceLevel: 'Senior Audit Specialist',
    qualification: 'Graduate / Ex-Army / Police',
    shift: 'General Shift + Field Visits',
    jobType: 'Full-time',
    vacancies: 8,
    genderEligibility: 'Male',
    postedDate: '6 days ago',
    summary: 'Perform surprise site compliance audits, weapon checks, guard biometric verification, and PSARA legal standard reviews in Rajasthan.',
    overview: 'Ensure that all deployed security personnel adhere strictly to client service level agreements (SLAs), PSARA regulations, and agency standards across Rajasthan.',
    responsibilities: [
      'Conduct unannounced day and night audit visits across client premises',
      'Score unit readiness: uniform, grooming, register completeness, weapon condition, and CCTV logs',
      'Submit detailed audit scoring sheets to branch operations directors',
    ],
    requirements: ['Strong analytical and report writing skills', 'Valid two-wheeler/four-wheeler driving licence'],
    benefits: ['PF, ESIC, Travel allowance, Performance bonuses'],
    documentsRequired: ['Aadhaar & PAN Card', 'Audit / Security Experience Proof', 'Degree'],
  },
  {
    id: 'sj-019',
    slug: 'security-manager',
    title: 'Security Manager',
    category: 'Supervision & Management',
    popular: false,
    featured: false,
    employer: 'Corporate Infrastructure Security Group',
    locations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bhiwadi', 'Neemrana', 'Ajmer'],
    primaryLocation: 'Jaipur, Neemrana & Udaipur',
    salaryMin: 45000,
    salaryMax: 75000,
    salaryPeriod: 'month',
    salaryDisplay: '₹45,000 – ₹75,000 / month',
    experienceRequired: '6 - 15 years (Ex-Defence Officer / Corporate Security Head)',
    experienceLevel: 'Management Level',
    qualification: 'Graduate / Post Graduate / Ex-Army Captain/Major',
    shift: 'General Shift',
    jobType: 'Full-time',
    vacancies: 5,
    genderEligibility: 'Male / Female',
    postedDate: '1 week ago',
    summary: 'Lead entire campus security operations, direct disaster response planning, manage multi-agency vendors, and interface with senior management in Rajasthan.',
    overview: 'Senior management leadership role accountable for physical security strategy, executive protection, asset risk mitigation, and compliance across large Rajasthan enterprise sites.',
    responsibilities: [
      'Formulate and execute campus-wide security protocols, SOPs, and emergency disaster recovery plans',
      'Manage contracts with security manpower agencies and electronic security system vendors',
      'Liaise directly with local police departments, fire authorities, and corporate risk directors',
      'Oversee internal investigations into loss, theft, data breaches, or safety violations',
    ],
    requirements: [
      'Ex-Commissioned Military Officer (Army/Navy/Air Force) or seasoned Corporate Security Manager with CPP/PSP certification preferred',
      'Exceptional leadership, crisis management, and stakeholder presentation capabilities',
    ],
    benefits: [
      'Executive salary package + annual performance bonus',
      'Health insurance for self and family',
      'Company vehicle / travel reimbursement',
    ],
    documentsRequired: [
      'Military Service Discharge Record (for Ex-Officers) / Corporate Relieving Letters',
      'Educational Degrees & Certifications',
      'Aadhaar & PAN Card',
    ],
  },
];

// Helper functions for filtering and search
export function getJobBySlug(slug) {
  if (!slug) return null;
  return JOBS_CATALOG.find((job) => job.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function filterJobs({
  role = '',
  category = '',
  city = '',
  experience = '',
  jobType = '',
  salaryMin = 0,
  gender = '',
  searchQuery = '',
}) {
  let filtered = [...JOBS_CATALOG];

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q) ||
        job.locations.some((loc) => loc.toLowerCase().includes(q)) ||
        job.primaryLocation.toLowerCase().includes(q)
    );
  }

  if (role && role.trim()) {
    const r = role.trim().toLowerCase();
    filtered = filtered.filter((job) => job.slug.toLowerCase() === r || job.title.toLowerCase().includes(r));
  }

  if (category && category.trim() && category !== 'All') {
    filtered = filtered.filter((job) => job.category.toLowerCase() === category.toLowerCase());
  }

  if (city && city.trim() && city !== 'All') {
    const c = city.trim().toLowerCase();
    filtered = filtered.filter(
      (job) => job.locations.some((loc) => loc.toLowerCase() === c) || job.primaryLocation.toLowerCase().includes(c)
    );
  }

  if (experience && experience.trim() && experience !== 'All') {
    if (experience.toLowerCase().includes('fresher')) {
      filtered = filtered.filter((job) => job.experienceRequired.toLowerCase().includes('fresher') || job.experienceLevel.toLowerCase().includes('fresher'));
    } else if (experience.toLowerCase().includes('experienced')) {
      filtered = filtered.filter((job) => !job.experienceLevel.toLowerCase().startsWith('fresher only'));
    }
  }

  if (jobType && jobType.trim() && jobType !== 'All') {
    filtered = filtered.filter((job) => job.jobType.toLowerCase().includes(jobType.toLowerCase()));
  }

  if (salaryMin && Number(salaryMin) > 0) {
    filtered = filtered.filter((job) => job.salaryMax >= Number(salaryMin));
  }

  if (gender && gender.trim() && gender !== 'All') {
    if (gender.toLowerCase() === 'female') {
      filtered = filtered.filter((job) => job.genderEligibility.toLowerCase().includes('female'));
    } else if (gender.toLowerCase() === 'male') {
      filtered = filtered.filter((job) => job.genderEligibility.toLowerCase().includes('male'));
    }
  }

  return filtered;
}

export const POPULAR_JOB_ROLES = JOBS_CATALOG.filter((j) => j.popular);
export const FEATURED_JOB_ROLES = JOBS_CATALOG.filter((j) => j.featured);

export default JOBS_CATALOG;
