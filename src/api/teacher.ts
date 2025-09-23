import type { Teacher, TeacherForRelations } from '~/models/teacher';
import { httpClient } from './httpClient';
import type { OffsetResponse } from '~/models/offsetResponse';
import type { OffsetRequest } from '~/models/offsetRequest';

interface UpdateTeacherRequestDto {
    id: number;
    name: string;
    surname: string;
    parent: string;
    userId: number | undefined;
}

export async function getTeachersForRelations(): Promise<TeacherForRelations[]> {
    const response = await httpClient.get('/teacher/forRelations');
    return response.data;
}

interface GetTeachersRequest extends OffsetRequest {
    name: string;
}

export async function getTeachers(request: GetTeachersRequest): Promise<OffsetResponse<Teacher>> {
    const response = await httpClient.get('/teacher/list', {
        params: request
    });
    return response.data;
}

export async function updateTeacher(teacher: UpdateTeacherRequestDto): Promise<void> {
    await httpClient.post('/teacher', teacher);
}

export async function deleteTeacher(id: number): Promise<void> {
    await httpClient.delete(`/teacher/${id}`);
}
