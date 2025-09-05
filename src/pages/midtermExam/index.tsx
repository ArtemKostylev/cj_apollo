import { useState } from 'react';
import ReactModal from 'react-modal';
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
                <ReactModal isOpen={createFormVisible}>
                    <UpdateForm
                        midtermExam={undefined}
                        teacherId={teacherId}
                        onClose={() => setCreateFormVisible(false)}
                    />
                </ReactModal>
                <ReactModal isOpen={updateFormVisible}>
                    <UpdateForm
                        midtermExam={selectedRecord}
                        teacherId={teacherId}
                        onClose={() => setUpdateFormVisible(false)}
                    />
                </ReactModal>
            </PageLoader>
        </PageWrapper>
    );
};
