import { httpClient } from "./httpClient";

export async function getAllTeachers(): Promise<Teacher[]> {
  const response = await httpClient.get("/teachers");
  return response.data;
}