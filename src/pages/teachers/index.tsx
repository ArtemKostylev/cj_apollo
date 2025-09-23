import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeacher, getTeachers } from '~/api/teacher';
import { useCallback, useState } from 'react';
import { PageWrapper } from '~/components/pageWrapper';
import { TableControls } from '~/components/tableControls';
import { ControlButton } from '~/components/tableControls/controlButton';
import { ScrollTable } from '~/components/scrollTable';
import type { ScrollTableColumn } from '~/components/scrollTable/header';
import { TableCell } from '~/components/cells/tableCell';
import { Modal } from '~/components/modal';
import { TeacherEditModal } from './TeacherEditModal';
import type { Teacher as TeacherModel } from '~/models/teacher';

const columns: ScrollTableColumn[] = [
    { key: 'id', title: 'ID', width: 200 },
    { key: 'surname', title: 'Фамилия', width: 200 },
    { key: 'name', title: 'Имя', width: 200 },
    { key: 'parent', title: 'Отчество', width: 200 },
    {
        key: 'user',
        title: 'Пользователь',
        width: 200,
        render: (data, style) => {
            return <TableCell style={style}>{(data as TeacherModel).user?.text}</TableCell>;
        }
    }
];

const MODAL_TYPES = {
    ADD: 'ADD',
    EDIT: 'EDIT'
};

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export const Teachers = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherModel | undefined>(undefined);
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState<ModalType | undefined>(undefined);

    const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['teachers'],
        queryFn: (ctx) => getTeachers({ limit: 10, offset: ctx.pageParam, name }),
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        initialPageParam: 0
    });

    const queryClient = useQueryClient();

    const { mutate: deleteTeacherMutation, isPending: isDeleteTeacherPending } = useMutation({
        mutationFn: (id: number) => deleteTeacher(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        }
    });

    const onCloseModal = useCallback(() => {
        setModalType(undefined);
        setSelectedTeacher(undefined);
    }, []);

    const onDeleteTeacher = useCallback(() => {
        if (selectedTeacher && confirm('Вы уверены, что хотите удалить преподавателя?')) {
            deleteTeacherMutation(selectedTeacher.id);
        }
    }, [deleteTeacherMutation, selectedTeacher]);

    return (
        <PageWrapper>
            <TableControls>
                <ControlButton onClick={() => setModalType(MODAL_TYPES.ADD)} text="Добавить преподавателя" />
                <ControlButton
                    onClick={() => setModalType(MODAL_TYPES.EDIT)}
                    text="Редактировать преподавателя"
                    disabled={!selectedTeacher}
                />
                <ControlButton
                    onClick={onDeleteTeacher}
                    disabled={!selectedTeacher}
                    loading={isDeleteTeacherPending}
                    text="Удалить преподавателя"
                />
            </TableControls>
            <ScrollTable
                selectedRow={selectedTeacher}
                onRowClick={(row) => setSelectedTeacher(row)}
                data={data?.pages.flatMap((page) => page.rows) ?? []}
                loading={isFetching || isFetchingNextPage}
                hasNext={hasNextPage}
                fetchNextPage={fetchNextPage}
                rowSize={100}
                columns={columns}
                hasControls
            />
            <Modal
                opened={!!modalType}
                onClose={onCloseModal}
                title={modalType === MODAL_TYPES.ADD ? 'Добавить преподавателя' : 'Редактировать преподавателя'}
            >
                {modalType === MODAL_TYPES.ADD && <TeacherEditModal onClose={onCloseModal} teacher={undefined} />}
                {modalType === MODAL_TYPES.EDIT && (
                    <TeacherEditModal onClose={onCloseModal} teacher={selectedTeacher} />
                )}
            </Modal>
        </PageWrapper>
    );
};
