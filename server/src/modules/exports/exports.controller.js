import { asyncHandler } from '../../middleware/error.middleware.js';
import { streamCandidatesCsv } from '../../services/csv-export.service.js';
import { logExport } from './exports.repository.js';
import hashIp from '../../utils/ip-hash.js';

function timestampedFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `securityjob-candidates-${date}.csv`;
}

export const exportCandidatesCsv = asyncHandler(async (req, res) => {
  const filename = timestampedFilename();

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-store');

  const recordCount = await streamCandidatesCsv(res, req.query);
  res.end();

  await logExport({
    ownerUserId: req.session.ownerUserId,
    filters: req.query,
    recordCount,
    ipHash: hashIp(req.ip),
  });
});
