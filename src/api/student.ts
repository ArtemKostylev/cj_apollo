import type { DropdownOptionType } from '~/models/dropdownOption';
import { httpClient } from './httpClient';
import type { AcademicYears } from '~/constants/date';

interface GetStudentsRequest {
    teacherId: number;
}

export async function getStudents(params: GetStudentsRequest): Promise<DropdownOptionType[]> {
    const response = await httpClient.get('/student/forTeacher', {
        params
    });
    return response.data;
}
