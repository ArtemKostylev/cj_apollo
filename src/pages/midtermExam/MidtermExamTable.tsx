import { Table } from '~/components/table';
import { useCallback, useMemo, useState } from 'react';
import { PageLoader } from '~/components/PageLoader';
import { useUserData } from '~/hooks/useUserData';
import type { MidtermExamType } from '~/models/midtermExamType';
import { getCurrentAcademicPeriod, getCurrentAcademicYear } from '~/utils/academicDate';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { TableControls } from '~/components/tableControls';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { PERIODS_NAMES, PERIODS_RU, YEARS, YEARS_NAMES, type AcademicYears, type Periods } from '~/constants/date';
import { ControlButton } from '~/components/tableControls/controlButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TableHeader } from '~/components/table/tableHeader';
import { NameHeader } from '~/components/table/nameHeader';
import type { MidtermExam } from '~/models/midtermExam';
import { deleteMidtermExam, getMidtermExams } from '~/api/midtermExam';
import { MidtermExamRow } from './MidtermExamRow';

interface Props {
    types: MidtermExamType[];
    typesById: Record<number, MidtermExamType>;
    selectedRecord: MidtermExam | undefined;
    year: AcademicYears;
    setYear: (year: AcademicYears) => void;
    setSelectedRecord: (record: MidtermExam | undefined) => void;
    openCreateForm: () => void;
    openUpdateForm: () => void;
}

export const MidtermExamTable = (props: Props) => {
    const { types, typesById, selectedRecord, year, setYear, setSelectedRecord, openCreateForm, openUpdateForm } = props;
    const [period, setPeriod] = useState(getCurrentAcademicPeriod());
    const [type, setType] = useState(types[0].id);

    const {
        userData: { versions }
    } = useUserData();
    const currentVersion = versions[year];
    const teacherId = currentVersion.teacherId;

    const typesOptions = useMemo(() => toSelectOptions(types, 'id', 'name'), [types]);

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['midterm-exams', year, period, type],
        queryFn: () => getMidtermExams({ teacherId, year, period, type })
    });

    const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => deleteMidtermExam(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['midterm-exams'] });
        }
    });

    const onDeleteClick = useCallback(() => {
        if (selectedRecord?.id) {
            deleteMutation(selectedRecord.id);
        }
    }, [selectedRecord]);

    return (
        <>
            <TableControls>
                <ControlSelect
                    options={typesOptions}
                    buttonText={typesById[type].name}
                    onSelect={(value) => setType(value as number)}
                />
                <ControlSelect
                    options={PERIODS_RU}
                    buttonText={PERIODS_NAMES[period]}
                    onSelect={(value) => setPeriod(value as Periods)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => setYear(value as AcademicYears)}
                />
                <ControlButton text="Добавить" onClick={openCreateForm} />
                <ControlButton text="Изменить" onClick={openUpdateForm} disabled={!selectedRecord} />
                <ControlButton text="Удалить" onClick={onDeleteClick} disabled={!selectedRecord || isDeleting} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader width="60px">Номер</TableHeader>
                            <NameHeader />
                            <TableHeader width="80px">Класс</TableHeader>
                            <TableHeader width="100px">Дата</TableHeader>
                            <TableHeader width="200px">Тип</TableHeader>
                            <TableHeader>Программа</TableHeader>
                            <TableHeader>Результат</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <MidtermExamRow
                                key={item.id}
                                item={item}
                                selectedRecord={selectedRecord}
                                onRowClick={setSelectedRecord}
                            />
                        ))}
                    </tbody>
                </Table>
            </PageLoader>
        </>
    );
};
