import type { CourseForRelations } from '~/models/course';
import { httpClient } from './httpClient';

export async function getCoursesForRelations(): Promise<CourseForRelations[]> {
    const response = await httpClient.get('/course/forRelations');
    return response.data;
}
