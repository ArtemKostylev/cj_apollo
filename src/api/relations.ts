import type { ChangedRelation, Relation } from '~/models/relation';
import { httpClient } from './httpClient';

export async function getRelations(): Promise<Record<number, Relation>> {
    const response = await httpClient.get('/relations');
    return response.data;
}

export async function updateStudentRelations(values: ChangedRelation[]): Promise<void> {
    await httpClient.post('/relations/updateStudentRelations', values);
}

export async function updateCourseRelations(values: ChangedRelation[]): Promise<void> {
    await httpClient.post('/relations/updateCourseRelations', values);
}
