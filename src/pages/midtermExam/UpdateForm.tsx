import { Button } from '~/components/button';
import styles from './midtermExam.module.css';
import type { MidtermExam } from '~/models/midtermExam';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudents } from '~/api/student';
import { updateMidtermExam, type UpdateMidtermExamRequest } from '~/api/midtermExam';
import { PageLoader } from '~/components/pageLoader';
import { Form, FormSelect, FormTextArea, FormInput } from '~/components/form';
import type { MidtermExamType } from '~/models/midtermExamType';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { DATE_FORMAT, INPUT_DATE_FORMAT } from '~/constants/date';
import { format } from 'date-fns';

interface Props {
    midtermExam: MidtermExam | undefined;
    types: MidtermExamType[];
    teacherId: number;
    onClose: () => void;
}

function toDefaultValues(midtermExam: MidtermExam) {
    return {
        typeId: midtermExam.typeId,
        studentId: midtermExam.studentId,
        date: format(new Date(midtermExam.date), INPUT_DATE_FORMAT),
        contents: midtermExam.contents,
        result: midtermExam.result
    };
}

export const UpdateForm = (props: Props) => {
    const { midtermExam, types, teacherId, onClose } = props;
    const queryClient = useQueryClient();

    const {
        data: students,
        isLoading: isLoadingStudents,
        isError: isErrorStudents
    } = useQuery({
        queryKey: ['students'],
        queryFn: () =>
            getStudents({
                teacherId
            })
    });

    const { mutate: updateMidtermExamMutation, isPending } = useMutation({
        mutationFn: (values: UpdateMidtermExamRequest) => updateMidtermExam(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['midterm-exams'] });
            onClose();
        }
    });

    const onSubmit = (values: MidtermExam) => {
        updateMidtermExamMutation({
            date: format(new Date(values.date), DATE_FORMAT),
            id: midtermExam?.id || 0,
            typeId: values.typeId,
            teacherId,
            studentId: values.studentId,
            contents: values.contents,
            result: values.result
        });
    };

    const typeOptions = toSelectOptions(types, 'id', 'name');

    return (
        <div className={styles.formWrapper}>
            <PageLoader loading={isLoadingStudents} error={isErrorStudents}>
                <Form<MidtermExam>
                    onSubmit={onSubmit}
                    defaultValues={midtermExam ? toDefaultValues(midtermExam) : ({} as MidtermExam)}
                    onReset={onClose}
                >
                    <FormSelect
                        name="typeId"
                        label="Тип промежуточной аттестации"
                        options={typeOptions ?? []}
                        required
                    />
                    <FormSelect name="studentId" label="Имя ученика" options={students ?? []} required />
                    <FormInput name="date" label="Дата" type="date" required />
                    <FormTextArea name="contents" label="Программа" required rows={7} />
                    <FormTextArea name="result" label="Результат" required rows={5} />
                    <div className={styles.buttonRow}>
                        <Button type="reset">Отмена</Button>
                        <Button type="submit" loading={isPending} disabled={isPending}>
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </PageLoader>
        </div>
    );
};
