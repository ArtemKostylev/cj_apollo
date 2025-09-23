import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getStudentsList } from '~/api/student';
import { TableCell } from '~/components/cells/tableCell';
import { Modal } from '~/components/modal';
import { PageWrapper } from '~/components/pageWrapper';
import { ScrollTable } from '~/components/scrollTable';
import type { ScrollTableColumn } from '~/components/scrollTable/header';
import { TableControls } from '~/components/tableControls';
import { PROGRAMS } from '~/constants/programs';
import type { Student } from '~/models/student';
import { StudentEditModal } from './StudentEditModal';
import { ControlButton } from '~/components/tableControls/controlButton';
import { StudentFilter } from '~/models/student';
import { StudentsFilters } from './StudentsFilters';

const columns: ScrollTableColumn[] = [
    {
        title: 'Имя',
        key: 'name',
        width: 200
    },
    {
        title: 'Фамилия',
        key: 'surname',
        width: 200
    },
    {
        title: 'Класс',
        key: 'class',
        width: 200
    },
    {
        title: 'Программа',
        key: 'program',
        width: 200,
        render: (data, style) => <TableCell style={style}>{PROGRAMS[(data as Student).program]}</TableCell>
    },
    {
        title: 'Специальность',
        key: 'specialization',
        width: 200,
        render: (data, style) => <TableCell style={style}>{(data as Student).specialization?.text}</TableCell>
    }
];

const MODAL_TYPES = {
    ADD: 'add',
    EDIT: 'edit',
    FILTERS: 'filters'
};

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export const Students = () => {
    const [selectedRow, setSelectedRow] = useState<Student | undefined>(undefined);
    const [modalState, setModalState] = useState<ModalType | undefined>(undefined);
    const [filters, setFilters] = useState<StudentFilter | undefined>(undefined);

    const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['students', filters],
        queryFn: (ctx) => getStudentsList({ limit: 10, offset: ctx.pageParam, filters }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset
    });

    const onClose = useCallback(() => {
        setModalState(undefined);
        setSelectedRow(undefined);
    }, []);

    const onFilter = useCallback((filters: StudentFilter | undefined) => {
        setFilters(filters ? { ...filters } : undefined);
        setModalState(undefined);
    }, []);

    return (
        <PageWrapper>
            <TableControls>
                <ControlButton onClick={() => setModalState(MODAL_TYPES.ADD)} text="Добавить ученика" />
                <ControlButton
                    onClick={() => setModalState(MODAL_TYPES.EDIT)}
                    disabled={!selectedRow}
                    text="Редактировать ученика"
                />
                <ControlButton onClick={() => setModalState(MODAL_TYPES.FILTERS)} text="Фильтровать" />
            </TableControls>
            <ScrollTable
                data={data?.pages.flatMap((page) => page.rows) || []}
                loading={isFetching || isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNext={hasNextPage}
                columns={columns}
                rowSize={100}
                hasControls
                onRowClick={setSelectedRow}
                selectedRow={selectedRow}
            />
            <Modal
                opened={!!modalState}
                onClose={onClose}
                title={modalState === MODAL_TYPES.ADD ? 'Добавить ученика' : 'Редактировать ученика'}
            >
                {modalState === MODAL_TYPES.ADD && <StudentEditModal student={undefined} onClose={onClose} />}
                {modalState === MODAL_TYPES.EDIT && <StudentEditModal student={selectedRow} onClose={onClose} />}
                {modalState === MODAL_TYPES.FILTERS && <StudentsFilters filter={filters} onFilter={onFilter} />}
            </Modal>
        </PageWrapper>
    );
};
