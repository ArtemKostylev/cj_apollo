import { useMutation } from '@apollo/client';
import { UPDATE_COURSE_MUTATION } from '../../../../../graphql/mutations/updateCourse';
import { FormLayout } from '../FormLayout';
import { Checkbox } from '../../../../../ui/formItems/Checkbox';
import { Input } from '../../../../../ui/formItems/Input';
import { EntityFormProps } from '../../types';

export function CourseUpdateForm(props: EntityFormProps) {
    const { onClose, data } = props;
    const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION);

    const course = data as Course;

    async function onSubmit(values: unknown) {
        await updateCourse({ variables: { data: {...(values as Course), id: course.id}}});
    }

    return (
        <FormLayout title='Создание предмета' onSubmit={onSubmit} onClose={onClose}>
            <Input name='name' label='Наименование' defaultValue={course.name}/>
            <Checkbox name='group' label='Групповой' defaultValue={course.group}/>
            <Checkbox name='onlyHours' label='Часы вместо оценок' defaultValue={course.onlyHours}/>
            <Checkbox name='excludeFromReport' label='Исключить из ведомости' defaultValue={course.excludeFromReport}/>
        </FormLayout>
    )
}