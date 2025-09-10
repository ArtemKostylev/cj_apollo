import type { DropdownOptionType } from '~/models/dropdownOption';
import { httpClient } from './httpClient';
import type { StudentGroupForRelations } from '~/models/student';

interface GetStudentsRequest {
    teacherId: number;
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
