import type { DropdownOptionType } from '~/models/dropdownOption';
import { httpClient } from './httpClient';
import type { Student, StudentFilter, StudentGroupForRelations } from '~/models/student';
import type { OffsetResponse } from '~/models/offsetResponse';
import type { OffsetRequest } from '~/models/offsetRequest';

interface GetStudentsRequest {
    teacherId: number;
}

interface UpdateStudentRequestDto {
    id: number;
    name: string;
    surname: string;
    class: number;
    program: string;
    specializationId: number;
}

export async function getStudents(params: GetStudentsRequest): Promise<DropdownOptionType[]> {
    const response = await httpClient.get('/student/forTeacher', {
        params
    });
    return response.data;
}

export async function getStudentsForRelations(): Promise<StudentGroupForRelations[]> {
    const response = await httpClient.get('/student/forRelations');
    return response.data;
}

export async function getStudentsList(
    params: OffsetRequest & { filters: StudentFilter | undefined }
): Promise<OffsetResponse<Student>> {
    const response = await httpClient.post(`/student/list`, params);
    return response.data;
}

export async function deleteStudent(id: number): Promise<void> {
    await httpClient.delete(`/student/${id}`);
}

export async function updateStudent(student: UpdateStudentRequestDto): Promise<void> {
    await httpClient.post('/student', student);
}
