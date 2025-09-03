import { httpClient } from './httpClient';
import type { MidtermExam } from '~/models/midtermExam';

interface GetMidtermExamsRequest {
    teacherId: number;
    year: number;
    period: string;
    type: number;
}

export async function getMidtermExams(params: GetMidtermExamsRequest): Promise<MidtermExam[]> {
    const response = await httpClient.get('/midtermExam', {
        params
    });

    return response.data;
}

export interface UpdateMidtermExamRequest {
    id: number;
    studentId: number;
    teacherId: number;
    typeId: number;
    date: string;
    contents: string;
    result: string;
}

export async function updateMidtermExam(params: UpdateMidtermExamRequest): Promise<void> {
    await httpClient.post('/midtermExam', params);
}

export async function deleteMidtermExam(id: number): Promise<void> {
    await httpClient.delete(`/midtermExam/${id}`);
}
