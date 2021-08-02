import { useMutation } from "@apollo/client";
import React from "react";
import {
  UPLOAD_COURSES_FROM_FILE,
  UPLOAD_STUDENTS_FROM_FILE,
  UPLOAD_TEACHERS_FROM_FILE,
} from "../../../scripts/mutations";
import "../../../styles/FilePicker.css";

export const FilePicker = ({ type, close }) => {
  let title;
  let mutation;

  switch (type) {
    case "teacher":
      title = "учителей";
      mutation = UPLOAD_TEACHERS_FROM_FILE;
      break;
    case "course":
      title = "предметов";
      mutation = UPLOAD_COURSES_FROM_FILE;
      break;
    case "student":
      title = "учеников";
      mutation = UPLOAD_STUDENTS_FROM_FILE;
      break;
    default:
      title = "";
      mutation = UPLOAD_TEACHERS_FROM_FILE;
  }

  const [send] = useMutation(mutation);

  const onChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    console.log(file);
    send({ variables: { file } });
  };

  return (
    <div className="filepicker_container">
      <h1>{`Загрузка списка ${title} из файла`}</h1>
      <input type="file" required onChange={onChange} />
      <button onClick={() => close()}>Закрыть</button>
    </div>
  );
};
