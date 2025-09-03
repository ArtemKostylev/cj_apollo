import type { MidtermExamType } from '~/models/midtermExamType';
import { httpClient } from './httpClient';

interface GetMidtermExamTypesResponseDto {
    midtermExamTypes: MidtermExamType[];
    midtermExamTypesById: Record<number, MidtermExamType>;
}

export async function getMidtermExamTypes(): Promise<GetMidtermExamTypesResponseDto> {
    const response = await httpClient.get('/midtermExamType');
    return response.data;
}

export async function updateMidtermExamType(params: MidtermExamType): Promise<void> {
    await httpClient.post('/midtermExamType', params);
}

export async function deleteMidtermExamType(id: number): Promise<void> {
    await httpClient.delete(`/midtermExamType/${id}`);
}
