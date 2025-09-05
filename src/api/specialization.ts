import type { Specialization } from '~/models/specialization';
import { httpClient } from './httpClient';

export async function getSpecializationList(): Promise<Specialization[]> {
    const response = await httpClient.get('/specialization');
    return response.data;
}

export async function updateSpecialization(specialization: Specialization): Promise<void> {
    await httpClient.post(`/specialization`, specialization);
}

export async function deleteSpecialization(id: number): Promise<void> {
    await httpClient.delete(`/specialization/${id}`);
}
