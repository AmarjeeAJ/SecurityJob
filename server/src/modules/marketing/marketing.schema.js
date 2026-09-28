import { z } from 'zod';

export const marketingFiltersQuerySchema = z.object({
  brand: z.string().trim().max(50).optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  platform: z.string().trim().max(30).optional(),
  source: z.string().trim().max(100).optional(),
  campaignId: z.string().trim().max(100).optional(),
  adsetId: z.string().trim().max(100).optional(),
  adId: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  role: z.string().trim().max(80).optional(),
});

export const metaSyncBodySchema = z.object({
  since: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional(),
  until: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional(),
});
