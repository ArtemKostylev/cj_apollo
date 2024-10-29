import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { FormLayout } from '../FormLayout';
import { CREATE_STUDENT_MUTATION } from '../../../../../graphql/mutations/createStudent';
import { Input } from '../../../../../ui/formItems/Input';
import { PROGRAMS } from '../../../../../constants/programs';
import { Select } from '../../../../../ui/formItems/Select';
import { useMemo } from 'react';
import { NumberInput } from '../../../../../ui/formItems/NumberInput';
import { EntityFormProps } from '../../types';

const PROGRAM_VALUES = new Map()
    .set(PROGRAMS.PP_5, 'ПП(5)')
    .set(PROGRAMS.PP_8, 'ПП(8)')
    .set(PROGRAMS.OP, 'ОП')

export function StudentCreateForm(props: EntityFormProps) {
    const { onClose } = props;
    const [createStudent] = useMutation(CREATE_STUDENT_MUTATION);

    // TODO: replace with real query;
    const specializations = useMemo(() => new Map(), []);

    async function onSubmit(values: unknown) {
        await createStudent({ variables: { data: values } });
    }

    return (
        <FormLayout title='Создание учащегося' onSubmit={onSubmit} onClose={onClose}>
            <Input name='surname' label='Фамилия' required/>
            <Input name='name' label='Имя' required/>
            <NumberInput name='class' label='Класс' required/>
            <Select name='program' label='Программа' defaultValue={PROGRAMS.PP_5} options={PROGRAM_VALUES} required/>
            <Select name='specialization' label='Специализация' options={specializations}/>
        </FormLayout>
    )
}