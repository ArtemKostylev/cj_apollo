/*
    On this page we have 3 columns:
    - Teachers
    - Courses
    - Students
    Each column represents a list of items. 

    In teachers column all items are always clickable. 
    In courses column only items, related to the selected teacher are clickable.
    In students column only items, related to the selected course are clickable.

    Students are rendered in groups by class and program.

    Editing of each individual item will be moved to separate form.

    Then user selects item in left column, we should make items with corresponding id editable in right column.

    Then selected, we first iterate over ids, corresponding to selected item, then, over all, checking, if they are in selected item ids.

    To achieve such mechanics, relations list should have shape like: 

    All teacher list {
        id: number,
        teacherName: string,  - combined teacher name
    }[],

    All course list {
        id: number,
        name: string
    }[],

    All student list 
*/

import { getCoursesForRelations } from '~/api/course';
import { useQuery } from '@tanstack/react-query';
import { getTeachersForRelations } from '~/api/teacher';
import { getStudentsForRelations } from '~/api/student';
import { getRelations } from '~/api/relations';
import { PageWrapper } from '~/components/pageWrapper';
import { PageLoader } from '~/components/pageLoader';
import { RelationsColumn } from './RelationsColumn';
import { useMemo, useState } from 'react';

export const Relations = () => {
    const {
        data: teachers,
        isLoading: isLoadingTeachers,
        isError: isErrorTeachers
    } = useQuery({
        queryKey: ['teachers'],
        queryFn: () => getTeachersForRelations()
    });
    const {
        data: courses,
        isLoading: isLoadingCourses,
        isError: isErrorCourses
    } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCoursesForRelations()
    });
    const {
        data: students,
        isLoading: isLoadingStudents,
        isError: isErrorStudents
    } = useQuery({
        queryKey: ['students'],
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

    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    const [selectedTeacherCourses, selectedTeacherCoursesById] = useMemo(() => {
        if (!selectedTeacher) {
            return [undefined, undefined];
        }

        const courses = relations?.[selectedTeacher]?.courses;

        if (!courses) {
            return [undefined, undefined];
        }

        return [Object.values(courses), courses];
    }, [selectedTeacher, relations]);

    const [selectedCourseStudents, selectedCourseStudentsById] = useMemo(() => {
        if (!selectedCourse || !selectedTeacherCoursesById) {
            return [undefined, undefined];
        }

        const students = selectedTeacherCoursesById[selectedCourse].allStudentIds;
        const studentsById = selectedTeacherCoursesById[selectedCourse].studentsById;

        if (!students || !studentsById) {
            return [undefined, undefined];
        }

        return [students, studentsById];
    }, [selectedCourse, relations]);

    const loading = isLoadingTeachers || isLoadingCourses || isLoadingStudents || isLoadingRelations;
    const error = isErrorTeachers || isErrorCourses || isErrorStudents || isErrorRelations;

    return (
        <PageWrapper>
            <PageLoader loading={loading} error={error}>
                <RelationsColumn>
                    {teachers?.map((teacher) => (
                        <div key={teacher.id} onClick={() => setSelectedTeacher(teacher.id)}>
                            {teacher.teacherName}
                        </div>
                    ))}
                </RelationsColumn>
                <RelationsColumn>
                    {selectedTeacherCourses &&
                        selectedTeacherCourses.map((course) => (
                            <div key={course.courseId} onClick={() => setSelectedCourse(course.courseId)}>
                                {course.courseName}
                            </div>
                        ))}
                    {courses?.map((course) => {
                        if (selectedTeacherCoursesById?.[course.id]) {
                            return null;
                        }

                        return <div key={course.id}>{course.courseName}</div>;
                    })}
                </RelationsColumn>
                <RelationsColumn>
                    {selectedCourseStudents &&
                        selectedCourseStudents.map((group) => (
                            <div key={group.group}>
                                {group.students.map((student) => (
                                    <div key={student.id}>{student.studentName}</div>
                                ))}
                            </div>
                        ))}
                    {students?.map((group) => (
                        <div key={group.group}>
                            <span>{group.group}</span>
                            {group.students.map((student) => {
                                if (selectedCourseStudentsById?.[student.id]) {
                                    return null;
                                }

                                return <div key={student.id}>{student.studentName}</div>;
                            })}
                        </div>
                    ))}
                </RelationsColumn>
            </PageLoader>
        </PageWrapper>
    );
};
