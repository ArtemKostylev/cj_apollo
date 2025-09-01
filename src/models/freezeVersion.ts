import { z } from 'zod';

export const freezeVersionSchema = z.object({
    id: z.number(),
    year: z.number()
});

export type FreezeVersion = z.infer<typeof freezeVersionSchema>;