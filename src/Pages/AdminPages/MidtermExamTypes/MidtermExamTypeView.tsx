import React from 'react';
import {PageWrapper} from '../../../ui/PageWrapper';
import {FormWrapper} from '../../../ui/FormWrapper';
import {Input} from './Input';

interface Props {
  initialData: MidtermExamType[];
}

export const MidtermExamTypeView = ({initialData}: Props) => {
  return (
    <PageWrapper>
      <FormWrapper>
        {initialData.map((type) => (
          <Input isEnabled={false} initialData={type} key={type.name}/>
        ))}
        <Input isEnabled={true}/>
      </FormWrapper>
    </PageWrapper>
  );
};
