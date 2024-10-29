import { useEffect } from 'react';

interface Props {
    relations: any[];
    currentTeacher: number | undefined;
    currentCourse: number | undefined;
    setActiveCourses: (courses: Set<any>) => void;
    setActiveStudents: (students: Set<any>) => void;                             
    setArchivedCourses: (courses: Set<any>) => void;
}

export function useActiveElements(props: Props) {
    const {relations, currentTeacher, currentCourse, setActiveCourses, setActiveStudents, setArchivedCourses} = props;

    useEffect(() => {
        let relationsByTeacher = relations.filter((el) => el.teacher === currentTeacher && !el.archived);
        setActiveCourses(new Set(relationsByTeacher?.map((el) => el.course)));

        if (currentCourse) {
            let relationsByCourse = relationsByTeacher.filter((el) => el.course === currentCourse)
            setActiveStudents(
                relationsByCourse[0]?.student !== undefined
                    ? new Set(relationsByCourse?.map((el) => el.student))
                    : new Set()
            );
        }
    
        let archivedByTeacher = relations.filter((el) => el.teacher === currentTeacher && el.archived);

        //archived course - course with archived, but not active.
        setArchivedCourses(new Set(archivedByTeacher?\.map((el) => el.course)));
    
        if (currentCourse) {
            let archivedByCourse = archivedByTeacher.filter(
                (element) => element.course === currentCourse
            );
            setArchivedStudents(
                archivedByCourse[0]?.student !== undefined
                    ? new Set(archivedByCourse?.map((el) => el.student))
                    : new Set()
            );
        }
    }, [relations, currentCourse, currentTeacher]);
}