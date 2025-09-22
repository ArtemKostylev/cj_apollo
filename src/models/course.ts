import { z } from 'zod';
import { freezeVersionSchema } from './freezeVersion';

export const courseSchema = z.object({
    id: z.number(),
    name: z.string(),
    group: z.boolean(),
    onlyHours: z.boolean().optional(),
    freezeVersion: freezeVersionSchema.optional(),
    excludeFromReport: z.boolean().optional()
});

export type Course = z.infer<typeof courseSchema>;

export interface CourseForRelations {
    id: number;
    courseName: string;
}
