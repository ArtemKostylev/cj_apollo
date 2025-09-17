import type { TeacherForRelations } from '~/models/teacher';
import { httpClient } from './httpClient';

interface UpdateTeacherRequestDto {
    id: number;
    name: string;
    surname: string;
    parent: string;
}

export async function getTeachersForRelations(): Promise<TeacherForRelations[]> {
    const response = await httpClient.get('/teacher/forRelations');
    return response.data;
}

export async function updateTeacher(teacher: UpdateTeacherRequestDto): Promise<void> {
    await httpClient.post('/teacher', teacher);
}

export async function deleteTeacher(id: number): Promise<void> {
    await httpClient.delete(`/teacher/${id}`);
}
