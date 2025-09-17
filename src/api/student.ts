import type { DropdownOptionType } from '~/models/dropdownOption';
import { httpClient } from './httpClient';
import type { StudentGroupForRelations } from '~/models/student';

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

export async function deleteStudent(id: number): Promise<void> {
    await httpClient.delete(`/student/${id}`);
}

export async function updateStudent(student: UpdateStudentRequestDto): Promise<void> {
    await httpClient.post('/student', student);
}
