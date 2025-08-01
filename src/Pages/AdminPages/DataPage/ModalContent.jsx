import React, { useState } from 'react';
import { createConditionalState } from './dataPageHeplers';
import '../../../styles/ModalContent.css';
import { t } from '../../../static/text';

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
        alert(t('class_is_number'));
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
          <label>{t('surname')}</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
        </div>
        <div className='form_input'>
          <label>{t('name')}</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>{t('famname')}</label>
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
          <label>{t('title')}</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>{t('group')}</label>
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
          <label>{t('surname')}</label>
          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
        </div>
        <div className='form_input'>
          <label>{t('name')}</label>

          <input
            type='text'
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
        </div>
        <div className='form_input'>
          <label>{t('class')}</label>
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
          <label>{t('program')}</label>
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
            <option value='PP_5'>{t('PP_5')}</option>
            <option value='PP_8'>{t('PP_8')}</option>
            <option value='OP'>{t('OP')}</option>
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
        <button onClick={submit}>{t('save')}</button>
        <button onClick={() => close(false)}>{t('cancel')}</button>
      </div>
    </div>
  );
};
