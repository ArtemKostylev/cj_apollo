import { FETCH_FULL_INFO } from '../../../graphql/queries/fetchFullInfo';
import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import DataPageView from './DataPageView';

import { DELETE_COURSE_MUTATION } from "../../../graphql/mutations/deleteCourse";
import { DELETE_STUDENT_MUTATION } from "../../../graphql/mutations/deleteStudent";
import { DELETE_TEACHER_MUTATION } from "../../../graphql/mutations/deleteTeacher";
import { UPDATE_COURSE_RELATIONS_MUTATION } from "../../../graphql/mutations/updateCourseRelation";
import { UPDATE_STUDENT_RELATIONS_MUTATION } from "../../../graphql/mutations/updateStudentRelation";
import type { ClassProgramPair, Relation, StudentType, TeacherType } from './types';
import { classProgramPairSorter } from './dataPageHelpers';

export default function DataPageController() {
    let { loading, data, error, refetch, networkStatus } = useQuery(
        FETCH_FULL_INFO,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        }
    );

    const [deleteTeacher] = useMutation(DELETE_TEACHER_MUTATION);
    const [deleteCourse] = useMutation(DELETE_COURSE_MUTATION);
    const [deleteStudent] = useMutation(DELETE_STUDENT_MUTATION);

    const [updateCourseRelations] = useMutation(UPDATE_COURSE_RELATIONS_MUTATION);
    const [updateStudentRelations] = useMutation(UPDATE_STUDENT_RELATIONS_MUTATION);

    const spinner = (<div>Загрузка</div>);

    if (loading) return spinner;
    if (networkStatus === NetworkStatus.refetch) return spinner;
    if (error) throw new Error('503');

    let { teachers: serverTeachers, courses, students: serverStudents, relations: serverRelations, specializations } = data.fetchFullInfo;

    const relations: Relation[] = serverRelations.map((el: any) => ({
        teacher: el.teacher.id,
        course: el.course.id,
        student: el.student?.id || undefined,
        archived: el.archived,
    }));

    const teachers: TeacherType[] = serverTeachers.map((el: any) => ({
        ...el,
        empty: !!relations.find((item) => item.teacher === el.id),
    }));

    const classProgramPairs = [] as ClassProgramPair[];

    const classes = new Set<string>();
    const programs = new Set<string>();

    const serverStudentsTyped = serverStudents as StudentType[];

    serverStudentsTyped.forEach((item) => {
        classes.add(item.class);
        programs.add(item.program);
    });

    classes.forEach((num) => {
        programs.forEach((program) => {
            classProgramPairs.push({
                class: num,
                program: program,
                students: [],
            });
        });
    });

    serverStudentsTyped.forEach((item) => {
        const pair = classProgramPairs.find((pair) => item.class === pair.class && item.program === pair.program);
        pair?.students.push(item);
    });

    const students = classProgramPairs
        .filter((pair) => pair.students.length)
        .sort(classProgramPairSorter);

    const updateCourseRelationsMutation = async (teacher, courses) => {
        await updateCourseRelations({
            variables: {
                teacher: teacher,
                courses: courses,
            },
        });
        refetch();
    };

    const updateStudentRelationsMutation = async (teacher, course, students) => {
        await updateStudentRelations({
            variables: {
                teacher: teacher,
                course: course,
                students: students,
            },
        });
        refetch();
    };

    return (
        <DataPageView
            teachers={teachers}
            courses={courses}
            students={students}
            relations={relations}
            specializations={specializations}
            update={update}
            clear={clear}
            refetch={refetch}
            createTeacher={createTeacher}
            createCourse={createCourse}
            createStudent={createStudent}
            updateCourseRelations={updateCourseRelationsMutation}
            updateStudentRelations={updateStudentRelationsMutation}
        />
    );
}

