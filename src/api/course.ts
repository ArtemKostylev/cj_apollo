import type { CourseForRelations } from '~/models/course';
import { httpClient } from './httpClient';

interface UpdateCourseRequestDto {
    id: number;
    name: string;
    group: boolean;
    excludeFromReport: boolean;
    onlyHours: boolean;
}

export async function getCoursesForRelations(): Promise<CourseForRelations[]> {
    const response = await httpClient.get('/course/forRelations');
    return response.data;
}

export async function deleteCourse(id: number): Promise<void> {
    await httpClient.delete(`/course/${id}`);
}

export async function updateCourse(course: UpdateCourseRequestDto): Promise<void> {
    await httpClient.post('/course', course);
}
