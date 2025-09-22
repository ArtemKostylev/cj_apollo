import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { getUsers } from '~/api/user';
import { TableCell } from '~/components/cells/tableCell';
import { Modal } from '~/components/modal';
import { PageWrapper } from '~/components/pageWrapper';
import { ScrollTable } from '~/components/scrollTable';
import type { ScrollTableColumn } from '~/components/scrollTable/header';
import { TableControls } from '~/components/tableControls';
import { ControlButton } from '~/components/tableControls/controlButton';
import type { User } from '~/models/user';
import { RegisterUser } from './RegisterUserForm';

const columns: ScrollTableColumn[] = [
    { key: 'id', title: 'ID', width: 200 },
    { key: 'login', title: 'Логин' },
    {
        key: 'role',
        title: 'Роль',
        width: 200,
        render: (data, style) => (
            <TableCell style={style}>{(data as User).role === 1 ? 'Администратор' : 'Преподаватель'}</TableCell>
        )
    }
];

export const Users = () => {
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['users'],
        queryFn: (ctx) => getUsers(10, ctx.pageParam),
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        initialPageParam: 0
    });

    const users = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data?.pages.length]);

    const onRegisterClick = useCallback(() => {
        setRegisterModalOpen(true);
    }, []);

    const onClose = useCallback(() => {
        setRegisterModalOpen(false);
    }, []);

    return (
        <PageWrapper>
            <TableControls>
                <ControlButton onClick={onRegisterClick} text="Добавить пользователя" />
            </TableControls>
            <ScrollTable
                data={users}
                loading={isFetching || isFetchingNextPage}
                hasNext={hasNextPage}
                fetchNextPage={fetchNextPage}
                rowSize={100}
                columns={columns}
            />
            <Modal opened={registerModalOpen} onClose={onClose} title="Регистрация пользователя">
                <RegisterUser onClose={onClose} />
            </Modal>
        </PageWrapper>
    );
};
