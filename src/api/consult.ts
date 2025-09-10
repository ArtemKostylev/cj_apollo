import { httpClient } from './httpClient';
import { AcademicYears } from '~/constants/date';

interface GetConsultsParams {
    courseId: number;
    teacherId: number;
    year: number;
}

interface UpdateConsultDto {
    id: number | undefined;
    date: string | undefined;
    hours: number | undefined;
    relationId: number;
    year: AcademicYears;
}

interface UpdateConsultParams {
    consults: UpdateConsultDto[];
}

interface ConsultDto {
    id: number;
    date: string;
    hours: number;
}

interface GetConsultsResponse {
    relationId: number;
    studentName: string;
    archived: boolean;
    consults: ConsultDto[] | null;
}

export async function getConsults(params: GetConsultsParams): Promise<GetConsultsResponse[]> {
    const response = await httpClient.get('/consult', {
        params
    });

    return response.data;
}

export async function updateConsults(params: UpdateConsultParams) {
    await httpClient.post('/consult', params);
}
