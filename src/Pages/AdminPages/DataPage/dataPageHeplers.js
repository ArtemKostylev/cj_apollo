export const createCoditionalState = (type, data = {}) => {
  switch (type) {
    case "teacher":
      return {
        surname: data.surname || "",
        name: data.name || "",
        parent: data.parent || "",
      };
    case "course":
      return {
        name: data.name || "",
        group: data.group || false,
      };
    case "student":
      return {
        name: data.name || "",
        surname: data.surname || "",
        class: data.class || "",
        program: data.program || "PP_5",
      };
    default:
      return {};
  }
};

export const computeUpdateList = (oldList, newList) => {
  console.log("oldList", oldList);
  console.log("newList", newList);
  let added = newList.map((course) => {
    if (!oldList.find((el) => el === course)) {
      return { id: course, archived: false };
    }
    return undefined;
  });

  let removed = oldList.map((course) => {
    if (!newList.find((el) => el === course)) {
      return { id: course, archived: true };
    }
    return undefined;
  });

  console.log("added", added);
  console.log("removed", removed);

  let result = [...added, ...removed];

  return result.filter((el) => el !== undefined);
};
