import { httpClient } from "./httpClient";

export async function getAllTeachers(): Promise<Teacher[]> {
  const response = await httpClient.get("/teacher");
  return response.data;
}

export async function createTeacher(teacher: Teacher): Promise<Teacher> {
  const response = await httpClient.post("/teacher", teacher);
  return response.data;
}

export async function updateTeacher(teacher: Teacher): Promise<Teacher> {
  const response = await httpClient.put(`/teacher/${teacher.id}`, teacher);
  return response.data;
}

export async function deleteTeacher(id: number): Promise<void> {
  await httpClient.delete(`/teacher/${id}`);
}