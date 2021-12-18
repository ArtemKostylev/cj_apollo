import React, { useState } from 'react';
import { FaCheckCircle, FaPen, FaTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { FormInput } from '../../../../shared/ui/FormInput';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 70%;
`;

export const SpecInputView = ({
  initialData,
  isEnabled,
  updateSpec,
  deleteSpec,
  refetch,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [inputData, setInputData] = useState(initialData);

  const handleSave = async () => {
    await updateSpec({
      variables: {
        data: {
          id: inputData.id,
          name: inputData.name,
        },
      },
    });
    setEnabled(false);
    refetch();
  };

  const handleDelete = async () => {
    await deleteSpec({
      variables: {
        id: inputData.id,
      },
    });
    setEnabled(false);
    refetch();
  };

  const handleChange = (e) => {
    setInputData((prev) => ({ ...prev, name: e.target.value }));
  };

  return (
    <InputWrapper onChange={handleChange}>
      <FormInput
        value={inputData.name}
        disabled={!enabled}
        placeholder={'Введите название специальности'}
        size={35}
      />
      {enabled ? (
        <FaCheckCircle
          size={28}
          style={{ cursor: 'pointer', marginTop: '20px' }}
          onClick={() => handleSave()}
        />
      ) : (
        <FaPen
          size={28}
          style={{ cursor: 'pointer', marginTop: '20px' }}
          onClick={() => setEnabled(true)}
        />
      )}
      {initialData.name && (
        <FaTrashAlt
          size={28}
          style={{ cursor: 'pointer', marginTop: '20px' }}
          onClick={() => handleDelete()}
        />
      )}
    </InputWrapper>
  );
};
