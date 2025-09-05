import { useFormik } from 'formik';
import { FormSelect } from '~/components/formItems/formSelect';
import { FormInput } from '~/components/formItems/formInput';
import { Button } from '~/components/button';
import { TextArea } from '~/components/formItems/formTextArea';
import styles from './midtermExam.module.css';
import type { MidtermExam } from '~/models/midtermExam';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudents } from '~/api/student';
import { updateMidtermExam, type UpdateMidtermExamRequest } from '~/api/midtermExam';
import { PageLoader } from '~/components/pageLoader';

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

    const formik = useFormik({
        initialValues: midtermExam ?? ({} as MidtermExam),
        onSubmit: (values: MidtermExam) => {
            updateMidtermExamMutation({
                date: values.date,
                id: midtermExam?.id || 0,
                typeId: values.typeId,
                teacherId,
                studentId: values.studentId,
                contents: values.contents,
                result: values.result
            });
        },
        onReset: () => {
            onClose();
        }
    });

    return (
        <PageLoader loading={isLoadingStudents} error={isErrorStudents}>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <div className={styles.formWrapper}>
                    <FormSelect
                        name="studentId"
                        value={formik.values?.studentId}
                        onChange={formik.setFieldValue}
                        label="Имя ученика"
                        options={students}
                        required
                    />
                    <FormInput
                        name="date"
                        value={formik.values.date}
                        onChange={formik.setFieldValue}
                        label="Дата"
                        type="date"
                        required
                    />
                    <TextArea
                        name="contents"
                        value={formik.values.contents}
                        onChange={formik.setFieldValue}
                        label="Программа"
                        required
                        rows={7}
                    />
                    <TextArea
                        name="result"
                        value={formik.values.result}
                        onChange={formik.setFieldValue}
                        label="Результат"
                        required
                        rows={5}
                    />
                    <div className={styles.buttonRow}>
                        <Button type="reset">Отмена</Button>
                        <Button type="submit" loading={isPending} disabled={isPending}>
                            Сохранить
                        </Button>
                    </div>
                </div>
            </form>
        </PageLoader>
    );
};
