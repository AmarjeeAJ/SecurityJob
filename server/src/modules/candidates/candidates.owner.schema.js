import { z } from 'zod';

export const listCandidatesQuerySchema = z.object({
  search: z.string().trim().max(150).optional(),
  city: z.string().trim().max(100).optional(),
  role: z.string().trim().max(80).optional(),
  source: z.string().trim().max(100).optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  sortBy: z.enum(['latest_submission', 'first_registered', 'name']).optional().default('latest_submission'),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.preprocess((v) => Number(v) || 1, z.number().int().min(1)).optional().default(1),
  pageSize: z.preprocess((v) => Number(v) || 25, z.number().int().min(1).max(100)).optional().default(25),
});

export const exportCandidatesQuerySchema = listCandidatesQuerySchema.omit({ page: true, pageSize: true });

export const candidateIdParamSchema = z.object({
  id: z.preprocess((v) => Number(v), z.number().int().positive('Invalid candidate id')),
});
