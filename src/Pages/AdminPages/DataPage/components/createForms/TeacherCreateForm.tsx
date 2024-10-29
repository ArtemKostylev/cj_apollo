import { useMutation } from '@apollo/client/react';
import { FormLayout } from '../FormLayout';
import { Input } from '../../../../../ui/formItems/Input';
import { CREATE_TEACHER_MUTATION } from '../../../../../graphql/mutations/createTeacher';
import { EntityFormProps } from '../../types';

export function TeacherCreateForm(props: EntityFormProps) {
    const { onClose } = props;
    const [createTeacher] = useMutation(CREATE_TEACHER_MUTATION);

    async function onSubmit(values: unknown) {
        await createTeacher({ variables: { data: values } });
    }

    return (
        <FormLayout title='Создание преподавателя' onSubmit={onSubmit} onClose={onClose}>
            <Input name='surname' label='Фамилия' />
            <Input name='name' label='Имя' />
            <Input name='parent' label='Отчество' />
        </FormLayout>
    )
}