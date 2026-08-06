import withTransaction from '../../db/transaction.js';
import { AppError } from '../../middleware/error.middleware.js';
import normalizeIndianMobile from '../../utils/phone-normalizer.js';
import generateCandidateCode from '../../utils/candidate-code.js';
import { roleForSlug } from '../../utils/job-roles.js';
import {
  findCandidateByNormalizedMobile,
  insertCandidate,
  updateCandidateOnResubmit,
  replaceCandidateRoles,
  replaceCandidatePreferredLocations,
  insertCandidateDocument,
  insertCandidateSubmission,
  upsertCandidateSource,
} from './candidates.repository.js';

function buildCandidateRow(input) {
  return {
    full_name: input.fullName,
    mobile_number: input.normalizedMobile,
    normalized_mobile_number: input.normalizedMobile,
    whatsapp_number: input.normalizedWhatsapp,
    normalized_whatsapp_number: input.normalizedWhatsapp,
    alternate_mobile_number: input.alternateMobileNumber || null,
    email: input.email || null,
    date_of_birth: input.dateOfBirth || null,
    age: input.age,
    gender: input.gender,
    current_city: input.currentCity,
    current_area: input.currentArea,
    state: input.state,
    highest_qualification: input.highestQualification || null,
    total_experience_months: input.totalExperienceMonths ?? 0,
    security_experience_months: input.securityExperienceMonths ?? 0,
    previous_company: input.previousCompany || null,
    current_employment_status: input.currentEmploymentStatus,
    joining_availability: input.joiningAvailability,
    expected_salary: input.expectedSalary ?? null,
    shift_preference: input.shiftPreference || null,
    duty_hour_preference: input.dutyHourPreference,
    height_cm: input.heightCm ?? null,
    languages: input.languages || null,
    ex_serviceman: !!input.exServiceman,
    aadhaar_available: !!input.aadhaarAvailable,
    police_verification_available: !!input.policeVerificationAvailable,
    training_certificate_available: !!input.trainingCertificateAvailable,
    driving_licence_available: !!input.drivingLicenceAvailable,
    additional_message: input.additionalMessage || null,
    consent_given: true,
    consent_timestamp: new Date(),
    consent_text_version: 'v1',
  };
}

function resolveTracking(body, jobSlug) {
  const hasUtm = body.utmSource || body.utmMedium || body.utmCampaign;
  const isDirect = !hasUtm;

  return {
    landingPageSlug: jobSlug || body.jobSlug || 'security-guard',
    source: body.utmSource || (isDirect ? 'direct' : 'unknown'),
    medium: body.utmMedium || (isDirect ? 'none' : 'unknown'),
    campaign: body.utmCampaign || (isDirect ? 'personal_link' : 'unknown'),
    utmSource: body.utmSource || null,
    utmMedium: body.utmMedium || null,
    utmCampaign: body.utmCampaign || null,
    utmContent: body.utmContent || null,
    utmTerm: body.utmTerm || null,
    fbclid: body.fbclid || null,
    fbp: body.fbp || null,
    fbc: body.fbc || null,
    referrerUrl: body.referrerUrl || null,
    landingPageUrl: body.landingPageUrl || null,
    deviceType: body.deviceType || null,
    browser: body.browser || null,
  };
}

export async function registerCandidate({ body, files, jobSlug, ipHash }) {
  const normalizedMobile = normalizeIndianMobile(body.mobileNumber);
  if (!normalizedMobile) {
    throw new AppError('Please enter a valid 10-digit mobile number.', 422, { mobileNumber: 'Invalid mobile number' });
  }

  const normalizedWhatsapp = normalizeIndianMobile(body.whatsappNumber) || normalizedMobile;

  let preferredRoles = [...body.preferredRoles];
  const slugRole = roleForSlug(jobSlug);
  if (slugRole && !preferredRoles.includes(slugRole)) {
    preferredRoles = [slugRole, ...preferredRoles];
  }

  const candidateRow = buildCandidateRow({ ...body, normalizedMobile, normalizedWhatsapp });
  const tracking = resolveTracking(body, jobSlug);
  tracking.ipHash = ipHash;

  const result = await withTransaction(async (client) => {
    const existing = await findCandidateByNormalizedMobile(client, normalizedMobile);
    let candidate;
    let isExistingCandidate = false;

    if (existing) {
      candidate = await updateCandidateOnResubmit(client, existing.id, candidateRow);
      isExistingCandidate = true;
    } else {
      const candidateCode = await generateCandidateCode(client);
      candidate = await insertCandidate(client, candidateCode, candidateRow);
    }

    await replaceCandidateRoles(client, candidate.id, preferredRoles, body.otherRoleText || null);
    await replaceCandidatePreferredLocations(client, candidate.id, body.preferredLocations);

    if (files?.photo?.[0]) {
      const file = files.photo[0];
      await insertCandidateDocument(client, candidate.id, {
        documentType: 'photo',
        originalFileName: file.originalname,
        storedFileName: file.filename,
        fileUrl: `/uploads/photos/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
      });
    }

    if (files?.resume?.[0]) {
      const file = files.resume[0];
      await insertCandidateDocument(client, candidate.id, {
        documentType: 'resume',
        originalFileName: file.originalname,
        storedFileName: file.filename,
        fileUrl: `/uploads/resumes/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
      });
    }

    await insertCandidateSubmission(client, candidate.id, tracking);
    await upsertCandidateSource(client, candidate.id, tracking);

    return { candidateCode: candidate.candidate_code, isExistingCandidate };
  });

  return result;
}
