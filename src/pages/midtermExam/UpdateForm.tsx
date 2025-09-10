import { Button } from '~/components/button';
import styles from './midtermExam.module.css';
import type { MidtermExam } from '~/models/midtermExam';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudents } from '~/api/student';
import { updateMidtermExam, type UpdateMidtermExamRequest } from '~/api/midtermExam';
import { PageLoader } from '~/components/pageLoader';
import { Form, FormSelect, FormTextArea, FormInput } from '~/components/form';

interface Props {
    midtermExam: MidtermExam | undefined;
    teacherId: number;
    onClose: () => void;
}

export const UpdateForm = (props: Props) => {
    const { midtermExam, teacherId, onClose } = props;
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
            date: values.date,
            id: midtermExam?.id || 0,
            typeId: values.typeId,
            teacherId,
            studentId: values.studentId,
            contents: values.contents,
            result: values.result
        });
    };

    return (
        <PageLoader loading={isLoadingStudents} error={isErrorStudents}>
            <Form<MidtermExam> onSubmit={onSubmit} defaultValues={midtermExam ?? ({} as MidtermExam)} onReset={onClose}>
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
    );
};
