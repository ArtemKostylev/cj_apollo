import { httpClient } from './httpClient';
import type { ChangedReplacement, ReplacementTable } from '~/models/replacement';

interface RequestDto {
    year: number;
    month: number;
    teacherId: number;
    courseId: number;
}

export async function getReplacementList(params: RequestDto): Promise<ReplacementTable> {
    const response = await httpClient.get('/replacement/list', { params });
    return response.data;
}

export async function updateReplacements(params: ChangedReplacement[]): Promise<void> {
    await httpClient.post('/replacement/update', params);
}
