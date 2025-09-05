import { httpClient } from './httpClient';

export async function fetchAnnualReport(): Promise<string> {
    const response = await httpClient.get(`/reports/annual`);
    return response.data;
}
