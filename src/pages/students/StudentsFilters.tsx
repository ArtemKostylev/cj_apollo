import { useCallback, useMemo } from 'react';
import type { StudentFilter } from '~/models/student';
import { Form, FormInput } from '~/components/form';
import { Button } from '~/components/button';
import { FormSelect } from '~/components/form/formSelect';
import { PROGRAMS } from '~/constants/programs';
import { useQuery } from '@tanstack/react-query';
import { getSpecializationList } from '~/api/specialization';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { PageLoader } from '~/components/pageLoader';
import styles from './students.module.css';

interface Props {
    filter: StudentFilter | undefined;
    onFilter: (filter: StudentFilter | undefined) => void;
}

const classPattern = {
    value: /^[0-9]{1,2}$/,
    message: 'Класс должен быть числом от 1 до 11'
};

const PROGRAM_OPTIONS = [
    { text: PROGRAMS.OP, value: 'OP' },
    { text: PROGRAMS.PP_5, value: 'PP_5' },
    { text: PROGRAMS.PP_8, value: 'PP_8' }
];

export const StudentsFilters = (props: Props) => {
    const { filter, onFilter } = props;

    const {
        data: specializations,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['specializations'],
        queryFn: getSpecializationList,
        select: (data) => toSelectOptions(data, 'id', 'name')
    });

    const defaultFilter: StudentFilter = useMemo(
        () => ({
            name: filter?.name || undefined,
            surname: filter?.surname || undefined,
            class: filter?.class || undefined,
            program: filter?.program === ' ' ? undefined : filter?.program,
            specialization: filter?.specialization === ' ' ? undefined : filter?.specialization
        }),
        [filter]
    );

    const onSubmit = useCallback(
        (data: StudentFilter) => {
            onFilter({
                ...data,
                program: data.program === ' ' ? undefined : data.program,
                specialization: data.specialization === ' ' ? undefined : data.specialization
            });
        },
        [onFilter]
    );

    return (
        <PageLoader loading={isLoading} error={isError}>
            <Form defaultValues={defaultFilter} onSubmit={onSubmit}>
                <FormInput name="name" label="Имя" type="text" />
                <FormInput name="surname" label="Фамилия" type="text" />
                <FormInput name="class" label="Класс" type="text" pattern={classPattern} />
                <FormSelect name="program" label="Программа" options={PROGRAM_OPTIONS} />
                <FormSelect name="specialization" label="Специальность" options={specializations || []} />
                <div className={styles.buttons}>
                    <Button type="submit">Фильтровать</Button>
                    <Button type="button" onClick={() => onFilter(undefined)}>
                        Сбросить
                    </Button>
                </div>
            </Form>
        </PageLoader>
    );
};
