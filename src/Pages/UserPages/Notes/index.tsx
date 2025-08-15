import { useUserData } from "../../../hooks/useUserData";
import "../../styles/Notes.css";
import {
    TableControls,
    TableControlsConfig,
    TableControlType,
} from "../../../ui/TableControls";
import { PageWrapper } from "../../../ui/PageWrapper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { YEARS } from "../../../constants/date";
import { getCurrentAcademicYear } from "../../../utils/academicDate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getNote, updateNote } from "../../../api/note";
import { LegacySpinner } from "../../../ui/LegacySpinner";

import styles from "./notes.module.css";

export const Notes = () => {
    const auth = useUserData();
    const location = useLocation() as any;

    const [year, setYear] = useState(getCurrentAcademicYear());
    const [course, setCourse] = useState(0);

    const [value, setValue] = useState("");

    const onYearChange = useCallback((year: number) => {
        setYear(year);
    }, []);

    const onCourseChange = useCallback((course: number) => {
        setCourse(course);
    }, []);

    const onTextAreaValueChange = useCallback((e: any) => {
        setValue(e.target.value);
    }, []);

    const teacherId = useMemo(
        () => location.state?.versions[year].id || auth.user.versions[year].id,
        [year, auth]
    );
    const courses: Course[] = useMemo(
        () => location.state?.courses || auth.user?.versions[year].courses,
        [location, auth, year]
    );
    const { courseId, courseName } = courses[course];

    const update = useMutation({ mutationFn: updateNote });

    const onSave = useCallback(() => {
        update.mutate({
            noteId: data?.id || 0,
            text: value,
            teacherId,
            courseId,
            year,
        });
    }, []);

    const { data, isPending, isError } = useQuery({
        queryKey: ["note"],
        queryFn: () =>
            getNote({
                courseId,
                teacherId,
                year,
            }),
    });

    const controlsConfig: TableControlsConfig = useMemo(
        () => [
            {
                type: TableControlType.SELECT,
                options: new Map(
                    courses.map((it, index) => [
                        index,
                        { value: index, text: it.name },
                    ])
                ),
                text: courseName,
                onClick: onCourseChange,
            },
            {
                type: TableControlType.SELECT,
                options: YEARS,
                text: YEARS.get(year)?.text,
                onClick: onYearChange,
            },
            {
                type: TableControlType.BUTTON,
                text: "Сохранить",
                onClick: onSave,
            },
        ],
        [year, course, value, data, courseName]
    );

    useEffect(() => {
        data?.text && setValue(data?.text);
    }, [data?.text]);

    if (isPending) return <LegacySpinner />;
    if (isError) throw new Error("503");

    return (
        <PageWrapper>
            <TableControls config={controlsConfig} />
            <textarea
                className={styles.notesTextarea}
                placeholder="Это - место для заметок..."
                value={value}
                onChange={onTextAreaValueChange}
            />
        </PageWrapper>
    );
};
