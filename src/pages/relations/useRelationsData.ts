import { useQuery } from '@tanstack/react-query';
import { getCoursesForRelations } from '~/api/course';
import { getRelations } from '~/api/relations';
import { getStudentsForRelations } from '~/api/student';
import { getTeachersForRelations } from '~/api/teacher';
import type { ResponseWithIds } from '~/models/responseWithIds';

const EMPTY_RESPONSE_WITH_IDS: ResponseWithIds<any> = {
    data: {},
    ids: []
};

export const useRelationsData = () => {
    const {
        data: courses,
        isLoading: isLoadingCourses,
        isError: isErrorCourses
    } = useQuery({
        queryKey: ['coursesRelations'],
        queryFn: () => getCoursesForRelations()
    });

    const {
        data: teachers,
        isLoading: isLoadingTeachers,
        isError: isErrorTeachers
    } = useQuery({
        queryKey: ['teachersRelations'],
        queryFn: () => getTeachersForRelations()
    });

    const {
        data: students,
        isLoading: isLoadingStudents,
        isError: isErrorStudents
    } = useQuery({
        queryKey: ['studentsRelations'],
        queryFn: () => getStudentsForRelations()
    });

    const {
        data: relations,
        isLoading: isLoadingRelations,
        isError: isErrorRelations
    } = useQuery({
        queryKey: ['relations'],
        queryFn: () => getRelations()
    });

    const loading = isLoadingCourses || isLoadingTeachers || isLoadingStudents || isLoadingRelations;
    const error = isErrorCourses || isErrorTeachers || isErrorStudents || isErrorRelations;

    return {
        courses: courses ?? EMPTY_RESPONSE_WITH_IDS,
        teachers: teachers ?? [],
        students: students ?? [],
        relations: relations ?? {},
        loading,
        error
    };
};
