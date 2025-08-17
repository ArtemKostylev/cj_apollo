export interface ConsultDto {
    id: number;
    student: Student;
    consults: Consult[] | null;
}
