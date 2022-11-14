import React, {useCallback, useMemo, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import {DELETE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteGroupConsults";
import {DELETE_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteConsults";
import {FETCH_CONSULTS_QUERY} from "../../../graphql/queries/fetchConsults";
import {UPDATE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/updateGroupConsults";
import {UPDATE_CONSULTS_MUTATION} from "../../../graphql/mutations/updateConsults";
import {FETCH_GROUP_CONSULTS_QUERY} from "../../../graphql/queries/fetchGroupConsults";
import {NetworkStatus, useMutation, useQuery} from "@apollo/client";
import IndividualConsultsView from "./IndividualConsultsView";
import GroupConsultsView from "./GroupConsultsView";
import moment, {Moment} from "moment";
import {TableControlsConfig, TableControlType} from '../../../shared/ui/TableControls';
import {YEARS} from '../../../@types/date';
import {useLocation} from "react-router-dom";
import {insertInPosition, updateInPosition} from '../../../utils/crud';
import {DATE_FORMAT} from '../../../@types/date';
import {getCurrentAcademicYear, getYearByMonth} from '../../../utils/academicDate';

export type UpdateDatesProps = {
  date: Moment;
  hours?: number;
  column: number;
  row: number;
  predicate?: (value: any) => boolean;
}

export const ConsultController = () => {
  const auth = useAuth();
  const location = useLocation() as any;

  const [currentYear, setCurrentYear] = useState(getCurrentAcademicYear());
  const [course, setCourse] = useState(0);

  const userCourses: Course[] = useMemo(() => location.state?.courses || auth.user?.versions[currentYear].courses, [location, auth, currentYear]);
  const teacher = useMemo(() => location.state?.teacher || auth.user.versions[currentYear].id, [location, auth, currentYear]);

  const [update] = useMutation(userCourses[course].group ? UPDATE_GROUP_CONSULTS_MUTATION : UPDATE_CONSULTS_MUTATION);
  const [clear] = useMutation(userCourses[course].group ? DELETE_GROUP_CONSULTS_MUTATION : DELETE_CONSULTS_MUTATION);

  const onYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const onCourseChange = useCallback((course: number) => {
    setCourse(course);
  }, []);

  let {loading, data, error, refetch, networkStatus} = useQuery(
    userCourses[course].group ? FETCH_GROUP_CONSULTS_QUERY : FETCH_CONSULTS_QUERY,
    {
      variables: {
        teacherId: teacher,
        courseId: userCourses[course].id,
        year: getYearByMonth(moment().month(), currentYear)
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only"
    }
  );

  const updateData = ({date, hours, column, predicate}: UpdateDatesProps) => {
    const entity = data.find(predicate);
    const entityIndex = data.indexOf(entity);
    const consult = entity.consult.find((item: any) => {
      const consultIndex = item.id ? item.id : item.uiIndex;
      return consultIndex === column;
    });
    const dateIndex = entity.consult.indexOf(consult);

    if (!consult) {
      const newConsult = {
        uiIndex: column,
        id: 0,
        date: date,
        year: currentYear,
        update_flag: true,
        delete_flag: false,
        hours: hours || 0,
      };

      data = insertInPosition(data, [{key: 'consult', index: entityIndex}], newConsult)

      return;
    }

    data = updateInPosition(data, [{key: 'consult', index: entityIndex}, {index: dateIndex}], {
      date: date || consult.date,
      hours: hours || 0,
      delete_flag: !!date,
      update_flag: !date,
    })
  };

  const createIndividualUpdateData = () => {
    const result: any[] = [];

    data.forEach((student: any) => {
      student.consult.forEach((consult: any) => {
        if (consult.update_flag)
          result.push({
            id: consult.id,
            date: consult.date.format(DATE_FORMAT),
            year: currentYear,
            hours: consult.hours,
            relationId: student.id,
          });
      });
    });

    return result;
  };

  const createGroupUpdateData = () => {
    let result: any[] = [];

    data.forEach((group: any) => {
      let groupData: any[] = [];
      group.consult.forEach((consult: any) => {
        if (consult.update_flag)
          groupData.push({
            id: consult.id,
            date: consult.date.format(DATE_FORMAT),
            year: currentYear,
            hours: consult.hours,
          });
      });

      result.push({
        subgroup:
          group.group.split(" ")[2] === "..."
            ? null
            : parseInt(group.group.split(" ")[2]),
        program: group.group.split(" ")[1],
        class: parseInt(group.group.split(" ")[0]),
        consult: groupData,
      });
    });
    return result;
  };

  const createClearData = () => {
    let result: number[] = [];
    data.forEach((student: any) => {
      student.consult.forEach((date: any) => {
        if (date.delete_flag && date.id !== 0) result.push(date.id);
      });
    });
    return result;
  };

  const saveIndividual = async () => {
    await update({
      variables: {
        data: createIndividualUpdateData(),
      },
    });

    await clear({
      variables: {
        ids: createClearData(),
      },
    });
    refetch();
  };

  const saveGroup = async () => {
    await update({
      variables: {
        teacher: location.state?.teacher || auth.user.versions[currentYear].id,
        course: userCourses[course].id,
        data: createGroupUpdateData(),
      },
    });
    refetch();
  };

  const save = async () => {
    return userCourses[course].group ? saveGroup() : saveIndividual();
  };

  const controlsConfig: TableControlsConfig = useMemo(() => [
    {
      type: TableControlType.SELECT,
      options: new Map(userCourses.map((it, index) => [index, {value: index, text: it.name}])),
      text: userCourses[course].name,
      onClick: onCourseChange,
    },
    {
      type: TableControlType.SELECT,
      options: YEARS,
      text: YEARS.get(currentYear)?.text,
      onClick: onYearChange,
    },
    {
      type: TableControlType.BUTTON,
      text: "Сохранить",
      onClick: save,
    },
  ], [userCourses, currentYear, course, data]);

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;
  if (error) throw new Error('503');

  data = userCourses[course].group ? data.fetchGroupConsults : data.fetchConsults;

  if (userCourses[course].group) return <GroupConsultsView data={data} controlsConfig={controlsConfig}
                                                           updateDates={(props) => updateData({
                                                             ...props,
                                                             predicate: (item: any) => item.group === props.row
                                                           })}
                                                           year={currentYear}/>

  return <IndividualConsultsView data={data} controlsConfig={controlsConfig}
                                 updateDates={(props) => updateData({
                                   ...props,
                                   predicate: (item: any) => item.student.id === props.row
                                 })} year={currentYear}/>
};
