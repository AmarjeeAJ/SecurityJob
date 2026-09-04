import fs from 'node:fs';
import path from 'node:path';
import { asyncHandler, AppError } from '../../middleware/error.middleware.js';
import query from '../../db/query.js';
import { uploadRoot } from '../../middleware/upload.middleware.js';
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

  const documents = (candidate.documents || []).map((doc) => ({
    ...doc,
    view_url: `/api/owner/candidates/${candidate.id}/documents/${doc.id}`,
    download_url: `/api/owner/candidates/${candidate.id}/documents/${doc.id}?download=1`,
  }));

  res.json({
    success: true,
    data: {
      ...candidate,
      documents,
    },
  });
});

export const getCandidateDocumentFile = asyncHandler(async (req, res) => {
  const { id: candidateId, docId } = req.params;

  const result = await query(
    'SELECT id, candidate_id, document_type, original_file_name, stored_file_name, file_url, mime_type, file_size FROM candidate_documents WHERE id = $1 AND candidate_id = $2',
    [docId, candidateId]
  );

  const doc = result.rows[0];
  if (!doc) {
    throw new AppError('Document not found.', 404);
  }

  const possiblePaths = [
    path.resolve(uploadRoot, 'aadhaar', doc.stored_file_name),
    path.resolve(uploadRoot, doc.file_url.replace(/^\/?(api\/)?uploads\/?/, '')),
    path.resolve(uploadRoot, doc.stored_file_name),
  ];

  const filePath = possiblePaths.find((p) => fs.existsSync(p));
  if (!filePath) {
    throw new AppError('Document file not found on disk.', 404);
  }

  res.setHeader('Content-Type', doc.mime_type || 'image/jpeg');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'private, max-age=86400');

  if (req.query.download === '1' || req.query.download === 'true') {
    const downloadName = doc.original_file_name || `${doc.document_type || 'document'}.jpg`;
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  }

  return res.sendFile(filePath);
});

export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidateId = req.params.id;

  const candidateCheck = await query('SELECT id, candidate_code, full_name FROM candidates WHERE id = $1', [candidateId]);
  if (candidateCheck.rowCount === 0) {
    throw new AppError('Candidate not found.', 404);
  }
  const targetCandidate = candidateCheck.rows[0];

  const docsResult = await query(
    'SELECT stored_file_name, file_url FROM candidate_documents WHERE candidate_id = $1',
    [candidateId]
  );

  await query('DELETE FROM candidates WHERE id = $1', [candidateId]);

  for (const doc of docsResult.rows) {
    const possiblePaths = [
      path.resolve(uploadRoot, 'aadhaar', doc.stored_file_name || ''),
      path.resolve(uploadRoot, (doc.file_url || '').replace(/^\/?(api\/)?uploads\/?/, '')),
      path.resolve(uploadRoot, doc.stored_file_name || ''),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        try {
          fs.unlinkSync(p);
        } catch {
          // Ignore deletion errors on disk
        }
      }
    }
  }

  res.json({
    success: true,
    message: `Candidate ${targetCandidate.candidate_code || targetCandidate.full_name} deleted successfully.`,
    data: {
      id: targetCandidate.id,
      candidateCode: targetCandidate.candidate_code,
    },
  });
});

