import type { Course, CourseForRelations } from '~/models/course';
import { httpClient } from './httpClient';
import type { OffsetResponse } from '~/models/offsetResponse';
import type { OffsetRequest } from '~/models/offsetRequest';
import type { ResponseWithIds } from '~/models/responseWithIds';

interface UpdateCourseRequestDto {
    id: number;
    name: string;
    group: boolean;
    excludeFromReport: boolean;
    onlyHours: boolean;
}

export async function getCourses(request: OffsetRequest): Promise<OffsetResponse<Course>> {
    const response = await httpClient.get('/course/list', {
        params: request
    });
    return response.data;
}

export async function getCoursesForRelations(): Promise<ResponseWithIds<CourseForRelations>> {
    const response = await httpClient.get('/course/forRelations');
    return response.data;
}

export async function deleteCourse(id: number): Promise<void> {
    await httpClient.delete(`/course/${id}`);
}

export async function updateCourse(course: UpdateCourseRequestDto): Promise<void> {
    await httpClient.post('/course', course);
}
