import {FETCH_FULL_INFO} from '../../../graphql/queries/fetchFullInfo';
import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import DataPageView from './DataPageView.js';
import {UPDATE_TEACHER_MUTATION} from "../../../graphql/mutations/updateTeacher";
import {UPDATE_COURSE_MUTATION} from "../../../graphql/mutations/updateCourse";
import {UPDATE_STUDENT_MUTATION} from "../../../graphql/mutations/updateStudent";
import {CREATE_TEACHER_MUTATION} from "../../../graphql/mutations/createTeacher";
import {CREATE_STUDENT_MUTATION} from "../../../graphql/mutations/createStudent";
import {CREATE_COURSE_MUTATION} from "../../../graphql/mutations/createCourse";
import {DELETE_COURSE_MUTATION} from "../../../graphql/mutations/deleteCourse";
import {DELETE_STUDENT_MUTATION} from "../../../graphql/mutations/deleteStudent";
import {DELETE_TEACHER_MUTATION} from "../../../graphql/mutations/deleteTeacher";
import {UPDATE_COURSE_RELATIONS_MUTATION} from "../../../graphql/mutations/updateCourseRelation";
import {UPDATE_STUDENT_RELATIONS_MUTATION} from "../../../graphql/mutations/updateStudentRelation";

export default function DataPageController() {
    let {loading, data, error, refetch, networkStatus} = useQuery(
        FETCH_FULL_INFO,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        }
    );

    const [updateTeacher] = useMutation(UPDATE_TEACHER_MUTATION);
    const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION);
    const [updateStudent] = useMutation(UPDATE_STUDENT_MUTATION);

    const [createTeacher] = useMutation(CREATE_TEACHER_MUTATION);
    const [createCourse] = useMutation(CREATE_COURSE_MUTATION);
    const [createStudent] = useMutation(CREATE_STUDENT_MUTATION);

    const [deleteTeacher] = useMutation(DELETE_TEACHER_MUTATION);
    const [deleteCourse] = useMutation(DELETE_COURSE_MUTATION);
    const [deleteStudent] = useMutation(DELETE_STUDENT_MUTATION);

    const [updateCourseRelations] = useMutation(UPDATE_COURSE_RELATIONS_MUTATION);
    const [updateStudentRelations] = useMutation(UPDATE_STUDENT_RELATIONS_MUTATION);

    const spinner = <div>Загрузка</div>;

    if (loading) return spinner;
    if (networkStatus === NetworkStatus.refetch) return spinner;
    if (error) throw new Error(503);

    let {teachers, courses, students, relations, specializations} = data.fetchFullInfo;

    relations = relations.map((el) => ({
        teacher: el.teacher.id,
        course: el.course.id,
        student: el.student?.id || undefined,
        archived: el.archived,
    }));

    teachers = teachers.map((el) => ({
        ...el,
        empty: !!relations.find((item) => item.teacher === el.id),
    }));

    let pairs = [];
    let classes = [];
    let programs = [];
    let groupedData = [];
    students.forEach((item) => {
        classes.push(item.class);
        programs.push(item.program);
    });

    classes = [...new Set(classes)];
    programs = [...new Set(programs)];

    classes.forEach((num) => {
        programs.forEach((program) => {
            pairs.push({
                class: num,
                program: program,
                students: [],
            });
        });
    });

    students.forEach((item) => {
        let pairIndex = pairs.findIndex(
            (pair) => item.class === pair.class && item.program === pair.program
        );
        pairs[pairIndex].students.push(item);
    });

    pairs.forEach((pair) => {
        if (pair.students.length > 0) groupedData.push(pair);
    });

    students = groupedData.sort(function compare(a, b) {
        if (a.class < b.class) {
            return -1;
        }
        if (a.class > b.class) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });

    const update = async (type, values) => {
        switch (type) {
            case 'teacher':
                await updateTeacher({
                    variables: {
                        data: {
                            id: values.id,
                            name: values.name,
                            surname: values.surname,
                            parent: values.parent,
                        },
                    },
                });
                break;
            case 'course':
                await updateCourse({
                    variables: {
                        data: {
                            id: values.id,
                            name: values.name,
                            group: values.group,
                            excludeFromReport: values.exclude,
                            onlyHours: values.hours,
                        },
                    },
                });

                break;

            case 'student':
                await updateStudent({
                    variables: {
                        data: {
                            id: values.id,
                            name: values.name,
                            surname: values.surname,
                            class: parseInt(values.class),
                            program: values.program,
                            specializationId: parseInt(values.spec),
                        },
                    },
                });
                break;

            default:
                return false;
        }
        refetch();
    };

    const clear = async (type, id) => {
        switch (type) {
            case 'teacher':
                await deleteTeacher({
                    variables: {
                        id: id,
                    },
                });
                break;

            case 'course':
                await deleteCourse({
                    variables: {
                        id: id,
                    },
                });
                break;

            case 'student':
                await deleteStudent({
                    variables: {
                        id: id,
                    },
                });
                break;
            default:
                return false;
        }
        refetch();
    };

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
