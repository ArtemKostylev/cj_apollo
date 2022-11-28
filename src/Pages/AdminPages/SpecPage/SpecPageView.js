import React from 'react';
import {PageWrapper} from '../../../ui/PageWrapper';
import {FormWrapper} from '../../../ui/FormWrapper';
import {SpecInput} from './SpecInput';

export const SpecPageView = ({initialData, refetch}) => {
    return (
        <PageWrapper>
            <FormWrapper>
                {initialData.map((spec) => (
                    <SpecInput isEnabled={false} initialData={spec} refetch={refetch}/>
                ))}
                <SpecInput isEnabled={true} refetch={refetch}/>
            </FormWrapper>
        </PageWrapper>
    );
};
