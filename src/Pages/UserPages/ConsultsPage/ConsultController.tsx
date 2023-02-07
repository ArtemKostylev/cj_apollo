import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { FETCH_CONSULTS_QUERY } from '../../../graphql/queries/fetchConsults';
import { FETCH_GROUP_CONSULTS_QUERY } from '../../../graphql/queries/fetchGroupConsults';
import { NetworkStatus, useQuery } from '@apollo/client';
import IndividualConsultsView from './IndividualConsultsView';
import GroupConsultsView from './GroupConsultsView';
import moment, { Moment } from 'moment';
import { TableControlsConfig} from '../../../ui/TableControls';
import { useLocation } from 'react-router-dom';
import { insertInPosition, updateInPosition } from '../../../utils/crud';
import { DATE_FORMAT } from '../../../constants/date';
import {
  getCurrentAcademicYear,
  getYearByMonth,
} from '../../../utils/academicDate';
import { useConsultControls } from './useConsultControls';

export type UpdateDatesProps = {
  date: Moment;
  hours?: number;
  column: number;
  row: number;
  predicate?: (value: any) => boolean;
};

export const ConsultController = () => {
  const auth = useAuth();
  const location = useLocation() as any;

  const [currentYear, setCurrentYear] = useState(getCurrentAcademicYear());
  const [course, setCourse] = useState(0);

  const userCourses: Course[] = useMemo(
    () => location.state?.courses || auth.user?.versions[currentYear].courses,
    [location, auth, currentYear]
  );
  const teacher = useMemo(
    () => location.state?.teacher || auth.user.versions[currentYear].id,
    [location, auth, currentYear]
  );

  const onYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const onCourseChange = useCallback((course: number) => {
    setCourse(course);
  }, []);

  let { loading, data, error, refetch, networkStatus } = useQuery(
    userCourses[course].group
      ? FETCH_GROUP_CONSULTS_QUERY
      : FETCH_CONSULTS_QUERY,
    {
      variables: {
        teacherId: teacher,
        courseId: userCourses[course].id,
        year: getYearByMonth(moment().month(), currentYear),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  const updateData = ({ date, hours, column, predicate }: UpdateDatesProps) => {
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

      data = insertInPosition(
        data,
        [{ key: 'consult', index: entityIndex }],
        newConsult
      );

      return;
    }

    data = updateInPosition(
      data,
      [{ key: 'consult', index: entityIndex }, { index: dateIndex }],
      {
        date: date || consult.date,
        hours: hours || 0,
        delete_flag: !date,
        update_flag: !!date,
      }
    );
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
          group.group.split(' ')[2] === '...'
            ? null
            : parseInt(group.group.split(' ')[2]),
        program: group.group.split(' ')[1],
        class: parseInt(group.group.split(' ')[0]),
        consult: groupData,
      });
    });
    return result;
  };

  const controlsConfig = useConsultControls(
    refetch,
    createGroupUpdateData,
    createIndividualUpdateData,
    userCourses,
    course,
    currentYear,
    onCourseChange,
    onYearChange
  ) as TableControlsConfig;

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;
  if (error) throw new Error('503');

  data = userCourses[course].group
    ? data.fetchGroupConsults
    : data.fetchConsults;

  if (userCourses[course].group)
    return (
      <GroupConsultsView
        data={data}
        controlsConfig={controlsConfig}
        updateDates={(props) =>
          updateData({
            ...props,
            predicate: (item: any) => item.group === props.row,
          })
        }
      />
    );

  return (
    <IndividualConsultsView
      data={data}
      controlsConfig={controlsConfig}
      updateDates={(props) =>
        updateData({
          ...props,
          predicate: (item: any) => item.student.id === props.row,
        })
      }
    />
  );
};
