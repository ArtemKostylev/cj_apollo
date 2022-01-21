export const findMark = (date, student) => {
  if (date === '' || !date) return '';
  if (typeof date === 'string') date = date.split('T')[0];
  else date = date.format('YYYY-MM-DD');
  const mark = student.find((el) => el.date.split('T')[0] === date);
  return mark !== undefined ? mark.mark : '';
};

export const getMonthFromUTCString = (date) => {
  return `${parseInt(date.split('T')[0].split('-')[1])}`;
};

export const createDates = (initialDate) => {
  let result = [];
  let start = initialDate.clone().startOf('month');
  let end = initialDate.clone().endOf('month');

  for (let date = start; date <= end; date.add(1, 'day')) {
    if (date.isoWeekday() !== 7) result.push(date.clone());
  }
  return result;
};

const createDailyUpdateData = (updates) => {
  let result = [];

  for (let i = 0; i < updates.length; i++) {
    let student = updates[i].journalEntry;
    for (let j = 0; j < student.length; j++) {
      let entry = student[j];
      if (entry.update_flag)
        result.push({
          id: entry.id,
          mark: entry.mark,
          date: entry.date,
          relationId: updates[i].id,
        });
    }
  }

  return result;
};

const createDailyDeleteData = (updates) => {
  let result = [];
  for (let i = 0; i < updates.length; i++) {
    let student = updates[i].journalEntry;
    for (let j = 0; j < student.length; j++) {
      let entry = student[j];
      if (entry.delete_flag && entry.id !== 0) result.push(entry.id);
    }
  }
  return result;
};

const createQuarterUpdateData = (updates) => {
  let result = [];
  updates.forEach((student) => {
    student.quaterMark.forEach((mark) => {
      if (mark.update_flag)
        result.push({
          id: mark.id,
          mark: mark.mark,
          period: mark.period,
          relationId: student.id,
        });
    });
  });
  return result;
};

const createQuarterDeleteData = (updates) => {
  let result = [];
  updates.forEach((student) => {
    student.quaterMark.forEach((mark) => {
      if (mark.delete_flag && mark.id !== 0) result.push(mark.id);
    });
  });
  return result;
};

export const prepareSaveData = (updates) => {
  return {
    updateCasual: createDailyUpdateData(updates),
    updatePeriod: createQuarterUpdateData(updates),
    deleteCasual: createDailyDeleteData(updates),
    deletePeriod: createQuarterDeleteData(updates),
  };
};
