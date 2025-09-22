import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '~/api/course';
import type { Course } from '~/models/course';
import { toast } from 'react-hot-toast';
import { Form, FormInput } from '~/components/form';
import { useCallback, useMemo } from 'react';
import { Button } from '~/components/button';

interface Props {
    onClose: () => void;
    course: Course | undefined;
}

interface FormValues {
    name: string;
    group: boolean;
    onlyHours: boolean;
    excludeFromReport: boolean;
}

export const CourseEditModal = (props: Props) => {
    const { onClose, course } = props;

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateCourse,
        onSuccess: () => {
            toast.success('Учебный предмет успешно обновлен');
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            onClose();
        },
        onError: () => {
            toast.error('Ошибка при обновлении учебного предмета');
        }
    });

    const onSubmit = useCallback(
        (data: FormValues) => {
            mutate({
                id: course?.id || 0,
                name: data.name,
                group: data.group,
                onlyHours: data.onlyHours,
                excludeFromReport: data.excludeFromReport
            });
        },
        [mutate, course?.id]
    );

    const defaultValues = useMemo(() => {
        return {
            name: course?.name || '',
            group: course?.group || false,
            onlyHours: course?.onlyHours || false,
            excludeFromReport: course?.excludeFromReport || false
        };
    }, [course]);

    return (
        <Form onSubmit={onSubmit} defaultValues={defaultValues}>
            <FormInput name="name" label="Название" type="text" required />
            <FormInput name="group" label="Групповой" type="checkbox" />
            <FormInput name="onlyHours" label="Только часы" type="checkbox" />
            <FormInput name="excludeFromReport" label="Исключить из отчета" type="checkbox" />
            <Button type="submit" loading={isPending}>
                Сохранить
            </Button>
        </Form>
    );
};
