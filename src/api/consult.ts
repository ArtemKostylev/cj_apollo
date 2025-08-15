import { httpClient } from './httpClient';

interface GetConsultsParams {
    courseId: number;
    teacherId: number;
    year: number;
}

interface ConsultDto {
    id: number | undefined;
    date: string;
    hours: number | undefined;
    relationId: number;
    year: number;
}

interface UpdateConsultParams {
    consults: ConsultDto[];
}

export async function getConsults(params: GetConsultsParams) {
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
