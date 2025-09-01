import { z } from 'zod';
import { freezeVersionSchema } from './freezeVersion';

export const courseSchema = z.object({
    id: z.number(),
    name: z.string(),
    group: z.boolean(),
    onlyHours: z.boolean().nullable(),
    freezeVersion: freezeVersionSchema.optional()
});

export type Course = z.infer<typeof courseSchema>;
