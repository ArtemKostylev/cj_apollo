import { useState } from 'react';
import { UpdateForm } from './UpdateForm';
import { useQuery } from '@tanstack/react-query';
import { getMidtermExamTypes } from '~/api/midtermExamType';
import { PageWrapper } from '~/components/pageWrapper';
import { PageLoader } from '~/components/pageLoader';
import { MidtermExamTable } from './MidtermExamTable';
import type { MidtermExam as IMidtermExam } from '~/models/midtermExam';
import { getCurrentAcademicYear } from '~/utils/academicDate';
import { useUserData } from '~/hooks/useUserData';
import { useFilter } from '~/hooks/useFilter';
import type { AcademicYears } from '~/constants/date';
import { Modal } from '~/components/modal';

export const MidtermExam = () => {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<IMidtermExam | undefined>(undefined);
    const [year, setYear] = useFilter<AcademicYears>(
        getCurrentAcademicYear(),
        'year',
        (val) => Number(val) as AcademicYears
    );

    const {
        userData: { versions }
    } = useUserData();
    const currentVersion = versions[year];
    const teacherId = currentVersion.teacherId;

    const {
        data: types,
        isLoading: typesLoading,
        isError: typesError
    } = useQuery({
        queryKey: ['midterm-exam-types'],
        queryFn: getMidtermExamTypes
    });

    return (
        <PageWrapper>
            <PageLoader loading={typesLoading} error={typesError}>
                <MidtermExamTable
                    year={year}
                    setYear={setYear}
                    types={types?.midtermExamTypes || []}
                    typesById={types?.midtermExamTypesById || {}}
                    openCreateForm={() => setCreateFormVisible(true)}
                    openUpdateForm={() => setUpdateFormVisible(true)}
                    selectedRecord={selectedRecord}
                    setSelectedRecord={setSelectedRecord}
                />
                <Modal
                    opened={createFormVisible}
                    title="Добавление промежуточной аттестации"
                    onClose={() => setCreateFormVisible(false)}
                >
                    <UpdateForm
                        midtermExam={undefined}
                        types={types?.midtermExamTypes || []}
                        teacherId={teacherId}
                        onClose={() => setCreateFormVisible(false)}
                    />
                </Modal>
                <Modal
                    opened={updateFormVisible}
                    title="Редактирование промежуточной аттестации"
                    onClose={() => setUpdateFormVisible(false)}
                >
                    <UpdateForm
                        midtermExam={selectedRecord}
                        types={types?.midtermExamTypes || []}
                        teacherId={teacherId}
                        onClose={() => setUpdateFormVisible(false)}
                    />
                </Modal>
            </PageLoader>
        </PageWrapper>
    );
};
