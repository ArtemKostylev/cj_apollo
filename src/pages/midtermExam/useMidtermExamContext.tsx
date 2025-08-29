import React, {
    useState,
    useContext,
    createContext,
    ReactNode,
    useCallback,
    useMemo
} from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_TEACHER_STUDENTS } from '../../graphql/queries/fetchStudentsForTeacher';
import { useUserData } from '../../hooks/useUserData';
import { FETCH_MIDTERM_EXAMS } from '../../graphql/queries/fetchMidtermExams';
import {
    getBorderDatesForMidtermExam,
    getCurrentAcademicPeriod,
    getCurrentAcademicYear
} from '../../utils/academicDate';
import { Periods } from '../../constants/date';
import { FETCH_MIDTERM_EXAM_TYPES } from '../../graphql/queries/fetchMidterExamTypes';
import {
    addToQuery,
    modifyEntity,
    removeFromQuery,
    useApollo
} from '../../hooks/useApolloCache';
import { toSelectOptions } from '~/utils/toSelectOptions';

const MidtermExamContext = createContext({} as MidtermExamContext);

type Props = {
    children: ReactNode;
};

interface MidtermExamsTypeData {
    fetchMidtermExamTypes: MidtermExamType[];
}

interface StudentsData {
    fetchTeacherStudents: Student[];
}

type MidtermExamContext = {
    loading: boolean;
    data: {
        table: MidtermExam[] | undefined;
        select: DropdownOptionType[];
        types: DropdownOptionType[];
    };
    error: any;
    selectedRecord: MidtermExam | undefined;
    onRowClick: (record: MidtermExam) => void;
    onTypeChange: (value: number) => void;
    onYearChange: (value: number) => void;
    onPeriodChange: (value: Periods) => void;
    type: number;
    year: number;
    period: Periods;
    teacherId: number;
    refetch: () => void;
    modifyMidtermExam: modifyEntity<MidtermExam>;
    addMidtermExam: addToQuery<MidtermExam>;
    removeMidtermExam: removeFromQuery<MidtermExam>;
};

export function ProvideMidtermExam({ children }: Props) {
    const value = useProvideMidtermExam();
    return (
        <MidtermExamContext.Provider value={value}>
            {children}
        </MidtermExamContext.Provider>
    );
}

export const useMidtermExamContext = () => {
    return useContext(MidtermExamContext);
};

function useProvideMidtermExam() {
    const [type, setType] = useState<number>(0);
    const [year, setYear] = useState<number>(getCurrentAcademicYear());
    const [period, setPeriod] = useState<Periods>(getCurrentAcademicPeriod());
    const [selectedRecord, setSelectedRecord] = useState<
        MidtermExam | undefined
    >(undefined);
    const {
        user: { versions }
    } = useUserData();

    const onTypeChange = useCallback((value: number) => setType(value), []);
    const onYearChange = useCallback((value: number) => setYear(value), []);
    const onPeriodChange = useCallback(
        (value: Periods) => setPeriod(value),
        []
    );
    const onRowClick = useCallback(
        (record: MidtermExam) => setSelectedRecord(record),
        []
    );

    const {
        loading: studentsLoading,
        data: studentsData,
        error: studentsError
    } = useQuery<StudentsData>(FETCH_TEACHER_STUDENTS, {
        variables: { teacherId: versions[year].id, year }
    });

    const {
        loading: midtermExamTypesLoading,
        data: midtermExamTypes,
        error: midtermExamTypesError
    } = useQuery<MidtermExamsTypeData>(FETCH_MIDTERM_EXAM_TYPES, {
        onCompleted: (data) => setType(data.fetchMidtermExamTypes[0].id)
    }); //? is this needed here????

    const { dateGte, dateLte } = useMemo(
        () => getBorderDatesForMidtermExam(period, year),
        [period, year]
    );

    const [
        { loading, error, data, refetch },
        modifyMidtermExam,
        addMidtermExam,
        removeMidtermExam
    ] = useApollo<MidtermExam>(
        FETCH_MIDTERM_EXAMS,
        {
            teacherId: versions[year].id,
            year,
            typeId: type,
            dateGte: dateGte.format(),
            dateLte: dateLte.format()
        },
        'fetchMidtermExams'
    );

    return {
        data: {
            table: data,
            select: toSelectOptions(
                studentsData?.fetchTeacherStudents || [],
                'id',
                'surname'
            ),
            types: toSelectOptions(
                midtermExamTypes?.fetchMidtermExamTypes || [],
                'id',
                'name'
            )
        },
        loading: loading || studentsLoading || midtermExamTypesLoading,
        error: studentsError || error || midtermExamTypesError,
        selectedRecord,
        onRowClick,
        onTypeChange,
        onYearChange,
        onPeriodChange,
        type,
        year,
        period,
        refetch,
        teacherId: versions[year].id,
        modifyMidtermExam,
        addMidtermExam,
        removeMidtermExam
    };
}
