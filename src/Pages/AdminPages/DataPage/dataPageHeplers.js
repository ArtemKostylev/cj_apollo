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
        exclude: data.excludeFromReport || false,
      };
    case "student":
      console.log(data.specialization);
      return {
        name: data.name || "",
        surname: data.surname || "",
        class: data.class || "",
        program: data.program || "PP_5",
        spec: data.specialization ? data.specialization.id.toString() : "",
      };
    default:
      return {};
  }
};

export const computeUpdateList = (oldList, newList) => {
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

  let result = [...added, ...removed];

  return result.filter((el) => el !== undefined);
};
