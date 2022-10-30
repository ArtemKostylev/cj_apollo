import moment, {Moment} from 'moment';

export const findMark = (date: Moment | undefined, student: JournalEntry[]) => {
  if (!date) return "";

  const mark = student.find((el) => moment(el.date).isSame(date, 'days'));
  return mark !== undefined ? mark.mark : "";
};
