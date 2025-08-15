import { httpClient } from './httpClient';

interface GetConsultsParams {
    courseId: number;
    teacherId: number;
    year: number;
}

interface UpdateConsultDto {
    id: number | undefined;
    date: string;
    hours: number | undefined;
    relationId: number;
    year: number;
}

interface UpdateConsultParams {
    consults: UpdateConsultDto[];
}

interface ConsultDto {
    id: number;
    student: Student;
    consults: Consult[] | null;
}

export async function getConsults(
    params: GetConsultsParams
): Promise<ConsultDto[]> {
    const response = await httpClient.get('/consults', {
        params
    });

    return response.data;
}

export async function updateConsults(params: UpdateConsultParams) {
    await httpClient.post('/consults', {
        params
    });
}
