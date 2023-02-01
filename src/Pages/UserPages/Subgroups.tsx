import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import React, {useState, useMemo, ChangeEvent} from 'react';
import {PROGRAMS} from '../../constants/programs';
import {UPDATE_SUBGROUPS_MUTATION} from '../../graphql/mutations/updateSubgroups';
import {FETCH_SUBGROUPS_QUERY} from '../../graphql/queries/fetchSubgroups';
import {useAuth} from '../../hooks/useAuth';
import '../../styles/Subgroups.css';
import {TableControlsConfig, TableControlType} from '../../ui/TableControls/types';
import {getCurrentAcademicYear} from '../../utils/academicDate';

type ItemProps = {
  subgroup: number | undefined;
  id: number;
  group: number;
  updateData: (value: string, id: number, group: number) => void;
  name: string;
  surname: string;
}

const Item = ({subgroup, id, group, updateData, name, surname}: ItemProps) => {
  const [value, setValue] = useState(`${subgroup}`);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length > 0)
      updateData(e.target.value, id, group);
  };

  return (
    <li className='item'>
      <p>{`${surname} ${name}`}</p>
      <label> Группа:</label>
      <input value={value} onChange={onChange} maxLength={1}/>
    </li>
  );
};

export const Subgroups = () => {
  const auth = useAuth();
  const year = useMemo(() => getCurrentAcademicYear(), [])

  const userCourses = auth.user.versions[year].courses.filter((course) => course.group);

  const [course, setCourse] = useState(0);

  const getCourse = (course: number) => {
    setCourse(course);
  };

  let {loading, data, error, refetch, networkStatus} = useQuery(
    FETCH_SUBGROUPS_QUERY,
    {
      variables: {
        courseId: userCourses[course].id,
        teacherId: auth.user.versions[year].id,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  const [update] = useMutation(UPDATE_SUBGROUPS_MUTATION);

  const save = () => {
    const result: { id: number, subgroup: number | undefined }[] = [];
    data.forEach((group: any) => {
      group.relations.forEach((item: TeacherCourseStudent) => {
        result.push({
          id: item.id,
          subgroup: item.subgroup,
        });
      });
    });
    update({
      variables: {
        data: result,
      },
    }).then(() => refetch());
  };

  /*  const controlsConfig: TableControlsConfig = useMemo(() => [
      {
        type: TableControlType.SELECT,
        options: new Map(userCourses.map((it, index) => [index, {value: index, text: it.name}])),
        text: userCourses[course].name,
        onClick: getCourse,
      },
      {
        type: TableControlType.BUTTON,
        text: 'Сохранить',
        onClick: save,
      },
    ], [userCourses, course, data]);*/

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (error) throw new Error('503');

  data = data.fetchSubgroups;

  const updateData = (value: string, id: number, group: number) => {
    const studentIndex = data[group].relations.findIndex(
      (student: TeacherCourseStudent) => student.student.id === id
    );
    data = [
      ...data.slice(0, group),
      {
        ...data[group],
        relations: [
          ...data[group].relations.slice(0, studentIndex),
          {
            ...data[group].relations[studentIndex],
            subgroup: parseInt(value),
          },
          ...data[group].relations.slice(studentIndex + 1),
        ],
      },
      ...data.slice(group + 1),
    ];
  };


  return (
    <div>
      <div className='group_wrapper'>
        <ul className='group_list'>
          {data.map((group: any, index: number) => (
            <>
              <li className='group_header'>{`Класс: ${group.class}${PROGRAMS[group.program]}`}</li>
              {group.relations.map((item: TeacherCourseStudent) => (
                <Item
                  key={item.student.id}
                  name={item.student.name}
                  surname={item.student.surname}
                  subgroup={item.subgroup}
                  group={index}
                  id={item.student.id}
                  updateData={updateData}
                />
              ))}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};
