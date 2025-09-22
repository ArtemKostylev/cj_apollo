import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser } from '~/api/user';
import { Button } from '~/components/button';
import { Form, FormInput, FormSelect } from '~/components/form';
import { toast } from 'react-hot-toast';

const ROLE_OPTIONS = [
    {
        text: 'Администратор',
        value: '1'
    },
    {
        text: 'Преподаватель',
        value: '2'
    }
];

const defaultValues = {
    login: '',
    password: '',
    role: '1'
};

interface Props {
    onClose: () => void;
}

export const RegisterUser = (props: Props) => {
    const { onClose } = props;
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Пользователь успешно зарегистрирован');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: () => {
            toast.error('Не удалось зарегистрировать пользователя. Попробуйте снова.');
        }
    });

    return (
        <Form onSubmit={(data) => mutate(data)} defaultValues={defaultValues}>
            <FormInput
                name="login"
                label="Логин"
                type="text"
                required
                pattern={{ value: /^[a-zA-Z0-9]+$/, message: 'Логин должен содержать только латинские буквы и цифры' }}
                minLength={3}
            />
            <FormInput
                name="password"
                label="Пароль"
                type="text"
                required
                pattern={{ value: /^[a-zA-Z0-9]+$/, message: 'Пароль должен содержать только латинские буквы и цифры' }}
                minLength={8}
            />
            <FormSelect name="role" label="Роль" options={ROLE_OPTIONS} required />
            <Button type="submit" loading={isPending}>
                Зарегистрировать
            </Button>
        </Form>
    );
};
