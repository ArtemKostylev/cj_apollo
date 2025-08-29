import { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { UPDATE_MIDTERM_EXAM } from '../../graphql/mutations/updateMidtermExam';
import { FormSelect } from '~/components/formItems/formSelect';
import { useMidtermExamContext } from './useMidtermExamContext';
import { FormInput } from '~/components/formItems/formInput';
import { Button } from '~/components/button';
import { Spinner } from '~/components/spinner';
import moment from 'moment';
import { TextArea } from '~/components/formItems/formTextArea';
import { DATE_FORMAT } from '../../constants/date';
import styles from './midtermExam.module.css';

interface Props {
    data?: MidtermExam | undefined;
    onClose: (submitted: boolean) => void;
}

export const UpdateForm = ({ data = {} as MidtermExam, onClose }: Props) => {
    const [update] = useMutation(UPDATE_MIDTERM_EXAM);
    const {
        data: { select },
        type,
        teacherId,
        refetch
    } = useMidtermExamContext();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            ...data,
            student: data?.student?.id
        },
        onSubmit: (values) => {
            setLoading(true);
            update({
                variables: {
                    data: {
                        date: moment(values.date).format(DATE_FORMAT),
                        id: data?.id || 0,
                        typeId: type,
                        teacherId,
                        studentId: values.student + '',
                        contents: values.contents,
                        result: values.result
                    }
                }
            }).then(() => {
                formik.resetForm();
                setLoading(false);
                refetch();
                onClose(true);
            });
        },
        onReset: () => {
            onClose(false);
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div className={styles.formWrapper}>
                {loading && <Spinner />}
                <FormSelect
                    name="student"
                    value={formik.values?.student}
                    onChange={formik.setFieldValue}
                    label="Имя ученика"
                    options={select}
                    required
                />
                <FormInput
                    name="date"
                    value={
                        formik.values.date &&
                        moment(formik.values.date).format('YYYY-MM-DD')
                    }
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
                    <Button type="submit">Сохранить</Button>
                </div>
            </div>
        </form>
    );
};
