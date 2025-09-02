import { z } from 'zod';

import { courseSchema } from './course';

export const userDataSchema = z.object({
    role: z.number(),
    versions: z.record(
        z.string(),
        z.object({
            teacherId: z.number(),
            coursesById: z.record(z.string(), courseSchema),
            allCourses: z.array(courseSchema),
            courses: z.array(courseSchema),
            groupCourses: z.array(courseSchema)
        })
    )
});

export type UserData = z.infer<typeof userDataSchema>;
