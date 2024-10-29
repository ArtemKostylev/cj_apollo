import { useMemo } from 'react';
import { PROGRAM_SELECT_VALUES } from '../../../../../constants/programSelectValues';
import { Input } from '../../../../../ui/formItems/Input';
import { Select } from '../../../../../ui/formItems/Select';
import { FormLayout } from '../FormLayout';
import { useMutation } from '@apollo/client';
import { UPDATE_STUDENT_MUTATION } from '../../../../../graphql/mutations/updateStudent';
import { NumberInput } from '../../../../../ui/formItems/NumberInput';
import { EntityFormProps } from '../../types';

export function StudentUpdateForm(props: EntityFormProps) {
    const { onClose, data } = props;
    const [updateStudent] = useMutation(UPDATE_STUDENT_MUTATION);

    const student = data as Student;

    // TODO: replace with real query;
    const specializations = useMemo(() => new Map(), []);

    async function onSubmit(values: unknown) {
        await updateStudent({ variables: { data: { ...(values as Student), id: student.id } } });
    }

    return (
        <FormLayout title='Создание учащегося' onSubmit={onSubmit} onClose={onClose}>
            <Input name='surname' label='Фамилия' required defaultValue={student.surname} />
            <Input name='name' label='Имя' required defaultValue={student.name} />
            <NumberInput name='class' label='Класс' required defaultValue={student.class} />
            <Select name='program' label='Программа' defaultValue={student.program} options={PROGRAM_SELECT_VALUES} required />
            <Select name='specialization' label='Специализация' defaultValue={student.specialization.id} options={specializations} />
        </FormLayout>
    )
}