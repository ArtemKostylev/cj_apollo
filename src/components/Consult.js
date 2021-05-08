import moment from "moment";
import React, { useEffect, useState } from "react";
import { PERIODS, QUATERS_RU } from "../scripts/constants";
import { useAuth } from "../scripts/use-auth";
import { getQuater } from "../scripts/utils";
import Controls from "./Controls";
import { EditableDateCell } from "./EditableDateCell";
import {
  DELETE_CONSULTS_MUTATION,
  UPDATE_CONSULTS_MUTATION,
} from "../scripts/mutations";

import { FETCH_CONSULTS_QUERY } from "../scripts/queries";
import "../styles/Consult.css";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";

export const Consult = (props) => {
  const auth = useAuth();

  

  const [year, setYear] = useState(2021);
  const [period, setPeriod] = useState(getQuater(moment().month()));
  const [course, setCourse] = useState(0);

  var changed = false;

  const listener = (event) => {
    if (changed) {
      event.preventDefault();
      let confirm = window.confirm("Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.")
      if (!confirm) event.stopImmediatePropagation();
    }
  }

  useEffect(() => {
    props.menuRef?.current.addEventListener('click', listener)

    return () => { props.menuRef?.current?.removeEventListener('click', listener) }
  })

  const getYear = (e) => {
    setYear(e.target.value);
    refetch();
  };

  const getPeriod = (e) => {
    setPeriod(e.target.getAttribute("data-index"));
    refetch();
  };

  const getCourse = (e) => {
    setCourse(e.target.getAttribute("data-index"));
    refetch();
  };

  let { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_CONSULTS_QUERY,
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

  const [update] = useMutation(UPDATE_CONSULTS_MUTATION);
  const [clear] = useMutation(DELETE_CONSULTS_MUTATION);

  const updateDates = (value, index, row) => {
    const student = data.find((item, index) => item.student.id === row);
    const studentIndex = data.indexOf(student);
    var date = student.consult.find((item) => item.id === index);
    const dateIndex = student.consult.indexOf(date);
    changed = true;
    value = value.toLocaleDateString("ru-RU").split(".");

    if (!date) {
      const newConsult = {
        id: !date ? 0 : date.id,
        date: `${value[2]}-${value[1]}-${value[0]}`.concat("T00:00:00.000Z"),
        period: PERIODS[period],
        year: parseInt(year),
        update_flag: true,
        delete_flag: false,
      };
      data = [
        ...data.slice(0, studentIndex),
        {
          ...data[studentIndex],
          consult: [...data[studentIndex].consult, newConsult],
        },
        ...data.slice(studentIndex + 1),
      ];
      return;
    }
    let flag = value === "";
    data = [
      ...data.slice(0, studentIndex),
      {
        ...data[studentIndex],
        consult: [
          ...data[studentIndex].consult.slice(0, dateIndex),
          {
            ...data[studentIndex].consult[dateIndex],
            date: `${value[2]}-${value[1]}-${value[0]}`.concat("T00:00:00.000Z"),
            delete_flag: flag,
            update_flag: !flag,
          },
          ...data[studentIndex].consult.slice(dateIndex + 1),
        ],
      },
      ...data.slice(studentIndex + 1),
    ];
    console.log(data);
    
  };

  const createUpdateData = () => {
    let result = [];
    data.forEach((student) => {
      student.consult.forEach((date) => {
        if (date.update_flag)
          result.push({
            id: date.id,
            date: date.date,
            period: 'fourth',
            year: 2021,
            relationId: student.id,
          });
      });
    });
    return result;
  };

  const createClearData = () => {
    let result = [];
    data.forEach((student) => {
      student.consult.forEach((date) => {
        if (date.delete_flag && date.id !== 0) result.push(date.id);
      });
    });
    return result;
  };

  const save = async (e) => {

    await update({
      variables: {
        data: createUpdateData(),
      },
    });

    await clear({
      variables: {
        ids: createClearData(),
      },
    });
    refetch();
  };

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
  if (error) {

  }

  data = data.fetchConsults;

  return (
    <div className="consult_container">
      <Controls items={items} />
      <table className="consult_table">
        <thead>
          <tr>
            <th className="name_column">Имя ученика</th>
            <th className="date_columns" colSpan="5">
              Даты
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr>
              <td className="name_cell">
                {`${item.student.surname} ${item.student.name}`}
              </td>
              {Array(5)
                .fill(1)
                .map((num, index) => (
                  <td>
                    <EditableDateCell
                      initialValue={
                        item.consult[index]
                          ? new Date(item.consult[index].date.split("T")[0])
                          : ""
                      }
                      column={item.consult[index]?.id ? item.consult[index]?.id : 0}
                      group={item.student.id}
                      updateDates={updateDates}
                    />
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
