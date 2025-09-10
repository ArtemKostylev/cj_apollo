import type { TeacherForRelations } from '~/models/teacher';
import { httpClient } from './httpClient';

export async function getTeachersForRelations(): Promise<TeacherForRelations[]> {
    const response = await httpClient.get('/teacher/forRelations');
    return response.data;
}
