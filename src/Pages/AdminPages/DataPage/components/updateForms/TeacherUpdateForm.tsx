import { useMutation } from '@apollo/client/react';
import { FormLayout } from '../FormLayout';
import { Input } from '../../../../../ui/formItems/Input';
import { UPDATE_TEACHER_MUTATION } from '../../../../../graphql/mutations/updateTeacher';
import { EntityFormProps } from '../../types';

export function TeacherUpdateForm(props: EntityFormProps) {
    const { onClose, data } = props;
    const [updateTeacher] = useMutation(UPDATE_TEACHER_MUTATION);

    const teacher = data as Teacher;

    async function onSubmit(values: unknown) {
        await updateTeacher({ variables: { data: {...values as Teacher, id: teacher.id}}});
    }

    return (
        <FormLayout title='Создание преподавателя' onSubmit={onSubmit} onClose={onClose}>
            <Input name='surname' label='Фамилия' defaultValue={teacher.surname}/>
            <Input name='name' label='Имя' defaultValue={teacher.name}/>
            <Input name='parent' label='Отчество' defaultValue={teacher.parent}/>
        </FormLayout>
    )
}