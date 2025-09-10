import type { Relation } from '~/models/relation';
import { httpClient } from './httpClient';

export async function getRelations(): Promise<Record<number, Relation>> {
    const response = await httpClient.get('/relations');
    return response.data;
}
