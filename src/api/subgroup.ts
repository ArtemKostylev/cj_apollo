import { httpClient } from "./httpClient";

export interface SubgroupStudent {
    relationId: number;
    studentName: string;
    subgroup: number;
}

interface SubgroupUpdateInfo {
    relationId: number;
    subgroup: number;
}

interface Subgroup {
    subgroupName: string;
    students: SubgroupStudent[];
}

export async function getSubgroups(courseId: number, teacherId: number): Promise<Subgroup[]> {
  const response = await httpClient.get(`/subgroup`, {
    params: {
      courseId,
      teacherId,
    },
  });
  return response.data;
}

export async function saveSubgroups(params: SubgroupUpdateInfo[]): Promise<void> {
  await httpClient.post("/subgroup", {
    subgroups: params,
  });
}