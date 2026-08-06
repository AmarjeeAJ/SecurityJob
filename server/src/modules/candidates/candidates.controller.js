import { asyncHandler } from '../../middleware/error.middleware.js';
import { registerCandidate } from './candidates.service.js';
import { JOB_ROLES, roleForSlug } from '../../utils/job-roles.js';
import hashIp from '../../utils/ip-hash.js';

const ROLE_LABELS = {
  'security-guard': 'Security Guard',
  'security-supervisor': 'Security Supervisor',
  'lady-security-guard': 'Lady Security Guard',
  'cctv-operator': 'CCTV Operator',
  'field-officer': 'Field Officer',
  bouncer: 'Bouncer',
};

export const register = asyncHandler(async (req, res) => {
  const jobSlug = (req.body.jobSlug || '').trim();
  const ipHash = hashIp(req.ip);

  const { candidateCode, isExistingCandidate } = await registerCandidate({
    body: req.body,
    files: req.files,
    jobSlug,
    ipHash,
  });

  res.status(201).json({
    success: true,
    message: isExistingCandidate
      ? 'Your details have been submitted successfully. Your previous registration was found and your latest information has been updated.'
      : 'Your details have been submitted successfully.',
    candidateCode,
    isExistingCandidate,
  });
});

export const pageConfig = asyncHandler(async (req, res) => {
  const { jobSlug } = req.params;
  const preselectedRole = roleForSlug(jobSlug);
  const label = ROLE_LABELS[jobSlug] || preselectedRole || 'Security Job';

  res.json({
    success: true,
    jobSlug,
    title: `${label} Jobs`,
    heading: `${label} Jobs`,
    preselectedRole,
    jobRoles: JOB_ROLES,
  });
});
