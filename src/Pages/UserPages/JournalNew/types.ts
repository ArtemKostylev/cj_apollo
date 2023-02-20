export interface GroupJournalEntry {
  subgroup: string;
  months: {
    month: string,
    dates: Date[]
  }[]
  students: {
    studentName: string;
    marksByMonth: {
      month: string;
      marks: Mark[];
    }[]
    quarterMarks: QuarterMark[];
  }[]
}

export interface IndividualJournalEntry {
  studentName: string;
  studentClass: string;
  marks: Mark[];
  quarterMarks: QuarterMark[];
}

export interface Mark {
  id: number;
  value: string;
  date: Date;
}