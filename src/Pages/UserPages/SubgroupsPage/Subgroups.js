import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { PROGRAMS } from '../../../constants/programs';
import { UPDATE_SUBGROUPS_MUTATION } from '../../../utils/mutations';
import { FETCH_SUBGROUPS_QUERY } from '../../../utils/queries';
import { useAuth } from '../../../utils/use-auth';
import '../../../styles/Subgroups.css';

import Controls from '../../../shared/ui/Controls';

export const Subgroups = () => {
  const auth = useAuth();

  const availableCourses = auth.user.courses.filter((course) => course.group);

  const [course, setCourse] = useState(0);

  const getCourse = (e) => {
    setCourse(e.target.getAttribute('data-index'));
  };

  var { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_SUBGROUPS_QUERY,
    {
      variables: {
        courseId: availableCourses[course].id,
        teacherId: auth.user.teacher,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  const [update] = useMutation(UPDATE_SUBGROUPS_MUTATION);

  const save = () => {
    const result = [];
    data.forEach((group) => {
      group.relations.forEach((item) => {
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
    });
    refetch();
  };

  const items = [
    {
      type: 'dropdown',
      data: availableCourses.map((course) => course.name),
      label: 'Предмет :',
      text: availableCourses[course].name,
      onClick: getCourse,
    },
    {
      type: 'button',
      text: 'Сохранить',
      onClick: save,
    },
    {
      type: 'button',
      text: 'Отменить изменения',
      onClick: () => refetch(),
    },
  ];

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (error) throw new Error(503);

  data = data.fetchSubgroups;

  const updateData = (value, id, group) => {
    const studentIndex = data[group].relations.findIndex(
      (student) => student.student.id === id
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

  const Item = (props) => {
    const [value, setValue] = useState(props.subgroup);

    const onChange = (e) => {
      setValue(e.target.value);
      if (e.target.value.length > 0)
        props.updateData(e.target.value, props.id, props.group);
    };

    return (
      <li className='item'>
        <p>{`${props.surname} ${props.name}`}</p>
        <label> Группа:</label>
        <input value={value} onChange={onChange} maxlength='1' />
      </li>
    );
  };

  return (
    <div>
      <Controls items={items} />
      <div className='group_wrapper'>
        <ul className='group_list'>
          {data.map((group, index) => (
            <>
              <li className='group_header'>{`Класс: ${group.class}${
                PROGRAMS[group.program]
              }`}</li>
              {group.relations.map((item) => (
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
