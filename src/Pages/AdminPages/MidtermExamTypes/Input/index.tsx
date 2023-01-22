import React, {ChangeEvent, useState} from "react";
import {useMutation} from "@apollo/client";
import {UPDATE_MIDTERM_EXAM_TYPE} from '../../../../graphql/mutations/updateMidtermExamType';
import {DELETE_MIDTERM_EXAM_TYPE} from '../../../../graphql/mutations/deleteMidtermExamType';
import {FormInput} from '../../../../ui/FormInput';
import {FaCheckCircle, FaPen, FaTrashAlt} from 'react-icons/fa';
import styled from 'styled-components';
import {FETCH_MIDTERM_EXAM_TYPES} from "../../../../graphql/queries/fetchMidterExamTypes";

interface Props {
  initialData?: MidtermExamType;
  isEnabled: boolean;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 70%;
`;

export const Input = ({initialData = {id: 0, name: ''} as MidtermExamType, isEnabled}: Props) => {

    const [update] = useMutation(UPDATE_MIDTERM_EXAM_TYPE, {refetchQueries: [{query: FETCH_MIDTERM_EXAM_TYPES}]});
    const [remove] = useMutation(DELETE_MIDTERM_EXAM_TYPE, {refetchQueries: [{query: FETCH_MIDTERM_EXAM_TYPES}]});

    const [enabled, setEnabled] = useState(isEnabled);
    const [inputData, setInputData] = useState(initialData);

    const handleSave = async () => {
      await update({
        variables: {
          data: {
            id: inputData.id || 0,
            name: inputData.name,
          },
        },
      });
      setEnabled(false);
      setInputData(initialData);
    };

    const handleDelete = async () => {
      await remove({
        variables: {
          id: inputData.id,
        },
      });
      setEnabled(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputData((prev) => ({...prev, name: e.target.value}));
    };

    return (
      <InputWrapper>
        <FormInput
          onChange={handleChange}
          value={inputData.name}
          disabled={!enabled}
          placeholder={'Введите название специальности'}
          size={35}
        />
        {enabled ? (
          <FaCheckCircle
            size={28}
            style={{cursor: 'pointer', marginTop: '20px'}}
            onClick={() => handleSave()}
          />
        ) : (
          <FaPen
            size={28}
            style={{cursor: 'pointer', marginTop: '20px'}}
            onClick={() => setEnabled(true)}
          />
        )}
        {initialData.name && (
          <FaTrashAlt
            size={28}
            style={{cursor: 'pointer', marginTop: '20px'}}
            onClick={() => handleDelete()}
          />
        )}
      </InputWrapper>
    );
  }
;
