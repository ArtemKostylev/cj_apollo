import { useMutation } from '@apollo/client/react';
import { FormLayout } from '../FormLayout';
import { Input } from '../../../../../ui/formItems/Input';
import { CREATE_COURSE_MUTATION } from '../../../../../graphql/mutations/createCourse';
import { Checkbox } from '../../../../../ui/formItems/Checkbox';
import { EntityFormProps } from '../../types';

export function CourseCreateForm(props: EntityFormProps) {
    const { onClose } = props;
    const [createCourse] = useMutation(CREATE_COURSE_MUTATION);

    async function onSubmit(values: unknown) {
        await createCourse({ variables: { data: values } });
    }

    return (
        <FormLayout title='Создание предмета' onSubmit={onSubmit} onClose={onClose}>
            <Input name='name' label='Наименование' />
            <Checkbox name='group' label='Групповой' />
            <Checkbox name='onlyHours' label='Часы вместо оценок' />
            <Checkbox name='excludeFromReport' label='Исключить из ведомости' />
        </FormLayout>
    )
}