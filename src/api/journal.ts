import type {
    ChangedMark,
    ChangedQuarterMark,
    JournalRow
} from '~/pages/journal/types';
import { httpClient } from './httpClient';

export interface UpdateJournalParams {
    marks: ChangedMark[];
    quarterMarks: ChangedQuarterMark[];
}

interface GetJournalParams {
    teacherId: number;
    courseId: number;
    year: number;
    month: number;
}

export const getJournal = async (
    params: GetJournalParams
): Promise<JournalRow[]> => {
    const response = await httpClient.get(`/journal`, { params });

    return response.data;
};

export const updateJournal = async (
    params: UpdateJournalParams
): Promise<void> => {
    await httpClient.post(`/journal`, params);
};
