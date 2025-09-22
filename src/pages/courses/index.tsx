import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getCourses } from '~/api/course';
import { TableCell } from '~/components/cells/tableCell';
import { Modal } from '~/components/modal';
import { PageWrapper } from '~/components/pageWrapper';
import { ScrollTable } from '~/components/scrollTable';
import type { ScrollTableColumn } from '~/components/scrollTable/header';
import { TableControls } from '~/components/tableControls';
import { ControlButton } from '~/components/tableControls/controlButton';
import type { Course } from '~/models/course';
import { CourseEditModal } from './CourseEditModal';

const columns: ScrollTableColumn[] = [
    {
        key: 'name',
        title: 'Название',
        width: 200
    },
    {
        key: 'group',
        title: 'Групповой',
        width: 200,
        render: (data, style) => <TableCell style={style}>{(data as Course).group ? 'Да' : 'Нет'}</TableCell>
    },
    {
        key: 'onlyHours',
        title: 'Только часы',
        width: 200,
        render: (data, style) => <TableCell style={style}>{(data as Course).onlyHours ? 'Да' : 'Нет'}</TableCell>
    },
    {
        key: 'excludeFromReport',
        title: 'Исключить из отчета',
        width: 200,
        render: (data, style) => (
            <TableCell style={style}>{(data as Course).excludeFromReport ? 'Да' : 'Нет'}</TableCell>
        )
    }
];

const MODAL_TYPES = {
    ADD: 'ADD',
    EDIT: 'EDIT'
};

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
    const [modalType, setModalType] = useState<ModalType | undefined>(undefined);

    const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['courses'],
        queryFn: (ctx) => getCourses({ limit: 10, offset: ctx.pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        initialPageParam: 0
    });

    const onRowClick = useCallback((row: Course) => {
        setSelectedCourse(row);
    }, []);

    const onCloseModal = useCallback(() => {
        setModalType(undefined);
        setSelectedCourse(undefined);
    }, []);

    return (
        <PageWrapper>
            <TableControls>
                <ControlButton onClick={() => setModalType(MODAL_TYPES.ADD)} text="Добавить предмет" />
                <ControlButton onClick={() => setModalType(MODAL_TYPES.EDIT)} text="Редактировать предмет" />
            </TableControls>
            <ScrollTable
                data={data?.pages.flatMap((page) => page.rows) ?? []}
                columns={columns}
                onRowClick={onRowClick}
                loading={isFetching || isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNext={hasNextPage}
                rowSize={100}
                selectedRow={selectedCourse}
                hasControls
            />
            <Modal
                opened={!!modalType}
                onClose={onCloseModal}
                title={modalType === MODAL_TYPES.ADD ? 'Добавить предмет' : 'Редактировать предмет'}
            >
                {modalType === MODAL_TYPES.ADD && <CourseEditModal onClose={onCloseModal} course={undefined} />}
                {modalType === MODAL_TYPES.EDIT && <CourseEditModal onClose={onCloseModal} course={selectedCourse} />}
            </Modal>
        </PageWrapper>
    );
};
