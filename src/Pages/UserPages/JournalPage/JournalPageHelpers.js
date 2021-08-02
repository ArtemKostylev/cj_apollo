export const findMark = (date, student) => {
  if (date === "" || !date) return "";
  if (typeof date === "string") date = date.split("T")[0];
  else date = date.format("YYYY-MM-DD");
  const mark = student.find((el) => el.date.split("T")[0] === date);
  return mark !== undefined ? mark.mark : "";
};
