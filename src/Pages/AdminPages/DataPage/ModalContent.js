import React, { useState } from 'react';
import { createConditionalState } from './dataPageHeplers';
import '../../../styles/ModalContent.css';

export const ModalContent = ({
  type,
  close,
  createTeacher,
  createCourse,
  createStudent,
  refetch,
}) => {
  const [values, setValues] = useState(createConditionalState(type));

  const submit = async () => {
    if (type === 'teacher') {
      await createTeacher({
        variables: {
          data: {
            name: values.name,
            surname: values.surname,
            parent: values?.parent || '',
          },
        },
      });
    } else if (type === 'course') {
      await createCourse({
        variables: {
          data: {
            name: values.name,
            group: values.group,
          },
        },
      });
    } else if (type === 'student') {
      if (!Number.isInteger(parseInt(values.class))) {
        alert('Класс должен быть числом!');
        return;
      }
      await createStudent({
        variables: {
          data: {
            name: values.name,
            surname: values.surname,
            class: parseInt(values.class),
            program: values.program,
          },
        },
      });
    }
    refetch();
  };

  let innerContent;

  if (type === 'teacher') {
    innerContent = (
      <div className='form_input_container'>
        <div className='form_input'>
          <label>Фамилия</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
        </div>
        <div className='form_input'>
          <label>Имя</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>Отчество</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, parent: e.target.value }))
            }
            value={values.parent}
          />
        </div>
      </div>
    );
  } else if (type === 'course') {
    innerContent = (
      <div className='form_input_container'>
        <div className='form_input'>
          <label>Название</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>Групповой</label>
          <input
            type='checkbox'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, group: e.target.checked }))
            }
            checked={values.group}
          />
        </div>
      </div>
    );
  } else if (type === 'student') {
    innerContent = (
      <div className='form_input_container'>
        <div className='form_input'>
          <label>Фамилия</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
        </div>
        <div className='form_input'>
          <label>Имя</label>

          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>Класс</label>
          <input
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                class: e.target.value,
              }))
            }
            type='text'
            pattern='\d*'
            maxLength='1'
            value={values.class}
          />
        </div>
        <div className='form_input'>
          <label>Программа</label>
          <select
            defaultValue={'PP_5'}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                program: e.target.value,
              }))
            }
            value={values.program}
          >
            <option value='PP_5'>(5)ПП</option>
            <option value='PP_8'>(8)ПП</option>
            <option value='OP'>ОП</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className='modal_container'>
      <h1>
        {type === 'teacher'
          ? 'Создание преподавателя'
          : type === 'course'
          ? 'Создание предмета'
          : 'Создание учащегося'}
      </h1>
      {innerContent}
      <div className='modal_controls'>
        <button onClick={submit}>Сохранить</button>
        <button onClick={() => close(false)}>Отмена</button>
      </div>
    </div>
  );
};
