import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getSpecializationList } from '~/api/specialization';
import { updateStudent } from '~/api/student';
import { Button } from '~/components/button';
import { Form, FormInput, FormSelect } from '~/components/form';
import { PageLoader } from '~/components/pageLoader';
import { PROGRAMS } from '~/constants/programs';
import type { Student } from '~/models/student';
import { toSelectOptions } from '~/utils/toSelectOptions';

interface Props {
    student: Student | undefined;
    onClose: () => void;
}

interface FormValues {
    name: string;
    surname: string;
    class: number;
    program: string;
    specialization: string;
}

const PROGRAM_OPTIONS = [
    { text: PROGRAMS.OP, value: 'OP' },
    { text: PROGRAMS.PP_5, value: 'PP_5' },
    { text: PROGRAMS.PP_8, value: 'PP_8' }
];

export const StudentEditModal = (props: Props) => {
    const { student, onClose } = props;
    const queryClient = useQueryClient();

    const {
        data: specializations,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['specializations'],
        queryFn: getSpecializationList,
        select: (data) => toSelectOptions(data, 'id', 'name')
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Ученик успешно обновлен');
            onClose();
        },
        onError: () => {
            toast.error('Ошибка при обновлении ученика');
        }
    });

    const defaultValues: FormValues = {
        name: student?.name || '',
        surname: student?.surname || '',
        class: student?.class || 0,
        program: student?.program || 'OP',
        specialization: String(student?.specialization?.value || ' ')
    };

    const onSubmit = useCallback(
        (formValues: FormValues) => {
            mutate({
                id: student?.id || 0,
                name: formValues.name,
                surname: formValues.surname,
                class: formValues.class,
                program: formValues.program,
                specializationId: Number(formValues.specialization)
            });
        },
        [mutate, student?.id]
    );

    return (
        <PageLoader loading={isLoading} error={isError}>
            <Form<FormValues> defaultValues={defaultValues} onSubmit={onSubmit}>
                <FormInput name="name" label="Имя" type="text" required />
                <FormInput name="surname" label="Фамилия" type="text" required />
                <FormInput name="class" label="Класс" type="number" required />
                <FormSelect name="program" label="Программа" options={PROGRAM_OPTIONS} required />
                <FormSelect name="specialization" label="Специальность" options={specializations || []} required />
                <Button type="submit" loading={isPending}>
                    Сохранить
                </Button>
            </Form>
        </PageLoader>
    );
};
