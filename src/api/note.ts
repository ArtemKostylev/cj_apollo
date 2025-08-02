import { Note } from "../models/note";
import { httpClient } from "./httpClient";

interface UpdateNoteParams {
    noteId: number;
    text: string;
    year: number;
    teacherId: number;
    courseId: number;
}

interface GetNoteParams {
    courseId: number;
    teacherId: number;
    year: number;
}

export async function getNote(params: GetNoteParams): Promise<Note | null> {
    const response = await httpClient.get('/note', {
        params
    })

    return response.data;
}

export async function updateNote(params: UpdateNoteParams): Promise<void> {
    await httpClient.post('/note', params)
}