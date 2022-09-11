declare type updateJournalPayload = {
  updateCasual: JournalEntry[],
  updatePeriod: QuarterMark[],
  deleteCasual: number[],
  deletePeriod: number[]
}

declare type AuthPayload = {
  token: string;
  user: UserPayload;
}

declare type UserPayload = {
  id: number;
  role: Role;
  email: string;
  teacher?: Teacher;
}