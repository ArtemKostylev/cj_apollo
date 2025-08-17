import { httpClient } from './httpClient';

interface GetAllGroupConsultsReturnValue {
    group: string;
    class: number;
    program: string;
    subgroup: number;
    consults: {
        id: number;
        date: string;
        hours: number;
    }[];
}

interface GroupConsultDto {
    program: string;
    subgroup: number;
    class: number;
    consultId: number | undefined;
    date: string | undefined;
    hours: number | undefined;
    year: number;
}

interface UpdateGroupConsultParams {
    consults: GroupConsultDto[];
    teacher: number;
    course: number;
}

interface GetAllGroupConsultsParams {
    teacherId: number;
    courseId: number;
    year: number;
}

export async function getAllGroupConsults(
    params: GetAllGroupConsultsParams
): Promise<GetAllGroupConsultsReturnValue[]> {
    const response = await httpClient.get('/groupConsult', { params });

    return response.data;
}

export async function updateGroupConsults(
    params: UpdateGroupConsultParams
): Promise<void> {
    await httpClient.post('/groupConsults', params);
}
