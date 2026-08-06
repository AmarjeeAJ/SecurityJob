import { asyncHandler } from '../../middleware/error.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { listCandidatesPaginated, getCandidateFullById } from './candidates.repository.js';

export const listCandidates = asyncHandler(async (req, res) => {
  const { rows, total } = await listCandidatesPaginated(req.query);

  res.json({
    success: true,
    data: rows.map((row) => ({
      id: row.id,
      candidateCode: row.candidate_code,
      fullName: row.full_name,
      mobileNumber: row.mobile_number,
      whatsappNumber: row.whatsapp_number,
      currentCity: row.current_city,
      preferredRoles: row.role_names ? row.role_names.split(' | ') : [],
      preferredLocations: row.preferred_city_names ? row.preferred_city_names.split(' | ') : [],
      securityExperienceMonths: row.security_experience_months,
      joiningAvailability: row.joining_availability,
      source: row.source,
      campaign: row.campaign,
      firstRegisteredAt: row.first_registered_at,
      lastSubmittedAt: row.last_submitted_at,
    })),
    pagination: {
      page: req.query.page,
      pageSize: req.query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / req.query.pageSize)),
    },
  });
});

export const getCandidateDetails = asyncHandler(async (req, res) => {
  const candidate = await getCandidateFullById(req.params.id);
  if (!candidate) {
    throw new AppError('Candidate not found.', 404);
  }
  res.json({ success: true, data: candidate });
});
