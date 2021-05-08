import { useAuth } from "../scripts/use-auth";
import { PERIODS, QUATERS_RU } from "../scripts/constants";

import "../styles/Notes.css";
import Controls from "./Controls";
import { useEffect, useState } from "react";
import { getQuater } from "../scripts/utils";
import moment from "moment";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import { FETCH_NOTES_QUERY } from "../scripts/queries";
import { UPDATE_NOTE_MUTATION } from "../scripts/mutations";

export const Notes = (props) => {
  const auth = useAuth();



  const listener = (event) => {
    if (changed) {
      event.preventDefault();
      let confirm = window.confirm("Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.")
      !confirm ? event.stopImmediatePropagation() : setChanged(false);
    }
  }

  useEffect(() => {
    props.menuRef?.current.addEventListener('click', listener)

    return () => { props.menuRef?.current?.removeEventListener('click', listener) }
  })

  const [year, setYear] = useState(2021);
  const [period, setPeriod] = useState(getQuater(moment().month()));
  const [course, setCourse] = useState(0);
  const [changed, setChanged] = useState(false);

  const getYear = (e) => {
    setYear(e.target.value);
    setValue("");
    refetch();
  };

  const getPeriod = (e) => {
    setPeriod(e.target.getAttribute("data-index"));
    setValue("");
    refetch();
  };

  const getCourse = (e) => {
    setCourse(e.target.getAttribute("data-index"));
    setValue("");
    refetch();
  };

  const [update] = useMutation(UPDATE_NOTE_MUTATION);

  const save = async (e) => {
    await update({
      variables: {
        data: {
          id: data.fetchNotes ? data.fetchNotes.id : 0,
          text: value,
          period: PERIODS[period],
          teacherId: props.id ? props.id : auth.user.teacher,
          courseId: auth.user.courses[course].id,
          year: year,
        },
      },
    });
    refetch();
    setChanged(false)
  };

  const { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_NOTES_QUERY,
    {
      variables: {
        teacherId: props.id ? props.id : auth.user.teacher,
        courseId: auth.user.courses[course].id,
        period: PERIODS[period],
        year: parseInt(year),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [value, setValue] = useState("");

  const items = [
    {
      type: "dropdown",
      data: auth.user.courses.map((course) => course.name),
      label: "Предмет :",
      text: auth.user.courses[course].name,
      onClick: getCourse,
    },
    {
      type: "button",
      text: "Сохранить",
      onClick: save,
    },
  ];

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (value === "" && data.fetchNotes && data.fetchNotes.text !== "" && !changed)
    setValue(data.fetchNotes.text);

  const change = (e) => {
    setChanged(true);
    setValue(e.target.value);
  }

  return (
    <div className="notes_container">
      <Controls items={items} />
      <textarea
        placeholder="Это - место для заметок..."
        value={value}
        onChange={change}
      ></textarea>
    </div>
  );
};
