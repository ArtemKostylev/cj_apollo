import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { updateTeacher } from '~/api/teacher';
import { getUserOptions } from '~/api/user';
import { Button } from '~/components/button';
import { Form, FormInput, FormSelect } from '~/components/form';
import { PageLoader } from '~/components/pageLoader';
import type { Teacher } from '~/models/teacher';

interface FormValues {
    name: string;
    surname: string;
    parent: string;
    user: string | undefined;
}

interface Props {
    onClose: () => void;
    teacher: Teacher | undefined;
}

export const TeacherEditModal = (props: Props) => {
    const { onClose, teacher } = props;
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateTeacher,
        onSuccess: () => {
            toast.success('Преподаватель обновлен');
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
            onClose();
        },
        onError: () => {
            toast.error('Ошибка при обновлении преподавателя');
        }
    });

    const {
        data: users,
        isLoading: isLoadingUsers,
        isError: isErrorUsers
    } = useQuery({
        queryKey: ['userOptions'],
        queryFn: getUserOptions
    });

    const onSubmit = useCallback(
        (data: FormValues) => {
            mutate({
                id: teacher?.id || 0,
                name: data.name,
                surname: data.surname,
                parent: data.parent,
                userId: Number(data.user) || undefined
            });
        },
        [mutate, teacher?.id]
    );

    const defaultValues = useMemo((): FormValues => {
        if (!!teacher) {
            return {
                name: teacher.name,
                surname: teacher.surname,
                parent: teacher.parent,
                user: teacher.user?.value ?? undefined
            };
        }
        return {
            name: '',
            surname: '',
            parent: '',
            user: undefined
        };
    }, [teacher]);

    return (
        <PageLoader loading={isLoadingUsers} error={isErrorUsers}>
            <Form onSubmit={onSubmit} defaultValues={defaultValues}>
                <FormInput name="name" label="Имя" type="text" required />
                <FormInput name="surname" label="Фамилия" type="text" required />
                <FormInput name="parent" label="Отчество" type="text" required />
                <FormSelect name="user" label="Пользователь" options={users ?? []} />
                <Button type="submit" loading={isPending}>
                    Сохранить
                </Button>
            </Form>
        </PageLoader>
    );
};
