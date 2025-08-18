import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { UPDATE_MIDTERM_EXAM } from '../../graphql/mutations/updateMidtermExam';
import styled from 'styled-components';
import { FormSelect } from '../../../ui/formItems/FormSelect';
import { useMidtermExamContext } from './useMidtermExamContext';
import { Input } from '../../../ui/formItems/Input';
import { Button } from '../../../ui/Button';
import { BlockingSpinner } from '../../../ui/Spinner';
import moment from 'moment';
import { TextArea } from '../../../ui/formItems/TextArea';
import { DATE_FORMAT } from '../../constants/date';

interface Props {
    data?: MidtermExam | undefined;
    onClose: (submitted: boolean) => void;
}

const Wrapper = styled.div`
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 30px;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const ButtonRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
`;

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
            <Wrapper>
                {loading && <BlockingSpinner />}
                <FormSelect
                    name="student"
                    value={formik.values?.student}
                    onChange={formik.setFieldValue}
                    label="Имя ученика"
                    options={select}
                    required
                />
                <Input
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
                <ButtonRow>
                    <Button type="reset">Отмена</Button>
                    <Button type="submit">Сохранить</Button>
                </ButtonRow>
            </Wrapper>
        </form>
    );
};
