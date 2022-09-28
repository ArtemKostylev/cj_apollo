import React, {useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import {DELETE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteGroupConsults";
import {DELETE_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteConsults";
import {FETCH_CONSULTS_QUERY} from "../../../graphql/queries/fetchConsults";
import {UPDATE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/updateGroupConsults";
import {UPDATE_CONSULTS_MUTATION} from "../../../graphql/mutations/updateConsults";
import {FETCH_GROUP_CONSULTS_QUERY} from "../../../graphql/queries/fetchGroupConsults";
import {NetworkStatus, useMutation, useQuery} from "@apollo/client";
import IndividualConsultsView from "./IndividualConsultsView";
import GroupConsultsView from "./GroupConsultsView";
import moment from "moment";
import {YEARS} from '../../../shared/ui/TableControls';
import {getYear} from '../../../utils/date';

export const ConsultController = (props) => {
    const auth = useAuth();

    const [currentYear, setCurrentYear] = useState(`${moment().year()}`);
    const [course, setCourse] = useState(0);

    const onYearChange = (e) => {
        setCurrentYear(e.target.getAttribute("data-index"));
    }

    const userCourses = props.location.state?.courses || auth.user?.versions[currentYear].courses;

    const getCourse = (e) => {
        setCourse(e.target.getAttribute("data-index"));
        refetch();
    };

    let {loading, data, error, refetch, networkStatus} = useQuery(
        userCourses[course].group
            ? FETCH_GROUP_CONSULTS_QUERY
            : FETCH_CONSULTS_QUERY,
        {
            variables: {
                teacherId: props.location.state?.versions[currentYear].id || auth.user.versions[currentYear].id,
                courseId: userCourses[course].id,
                year: getYear(moment().month(), currentYear),
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "network-only",
        }
    );

    const [update] = useMutation(
        userCourses[course].group
            ? UPDATE_GROUP_CONSULTS_MUTATION
            : UPDATE_CONSULTS_MUTATION
    );

    const [clear] = useMutation(
        userCourses[course].group
            ? DELETE_GROUP_CONSULTS_MUTATION
            : DELETE_CONSULTS_MUTATION
    );

    const updateIndividualData = ({date, hours, column, row}) => {
        const student = data.find((item) => item.student.id === row);
        const studentIndex = data.indexOf(student);
        const consult = student.consult.find((item) => {
            const itemIndex = item.id ? item.id : item.uiIndex;
            return itemIndex === column;
        });
        const dateIndex = student.consult.indexOf(consult);
        date =
            date instanceof Date ? date.toLocaleDateString("ru-RU").split(".") : date;

        if (!consult) {
            const newConsult = {
                uiIndex: column,
                id: 0,
                date: `${date[2]}-${date[1]}-${date[0]}`.concat("T00:00:00.000Z"),
                year: parseInt(currentYear),
                update_flag: true,
                delete_flag: false,
                hours: hours || 0,
            };
            data = [
                ...data.slice(0, studentIndex),
                {
                    ...data[studentIndex],
                    consult: [...(data[studentIndex].consult || []), newConsult],
                },
                ...data.slice(studentIndex + 1),
            ];
            return;
        }
        if (!date && hours) {
            date = consult.date;
        }

        let flag = date === "";
        data = [
            ...data.slice(0, studentIndex),
            {
                ...data[studentIndex],
                consult: [
                    ...data[studentIndex].consult.slice(0, dateIndex),
                    {
                        ...data[studentIndex].consult[dateIndex],
                        date: Array.isArray(date)
                            ? `${date[2]}-${date[1]}-${date[0]}`.concat("T00:00:00.000Z")
                            : date,
                        hours: hours || 0,
                        delete_flag: flag,
                        update_flag: !flag,
                    },
                    ...data[studentIndex].consult.slice(dateIndex + 1),
                ],
            },
            ...data.slice(studentIndex + 1),
        ];
        return true;
    };

    // ! here we have indexing trouble. we find mark by its column index, but we have several new items with 0 index, and they rewrite themselves
    // *
    const updateGroupData = ({date, hours, column, row}) => {
        const group = data.find(item => item.group === row);
        const groupIndex = data.indexOf(group);
        let consult = group.consults.find((item) => {
            const itemIndex = item.id ? item.id : item.uiIndex;
            return itemIndex === column;
        });
        const dateIndex = group.consults.indexOf(consult);
        date =
            date instanceof Date ? date.toLocaleDateString("ru-RU").split(".") : date;

        if (!consult) {
            const newConsult = {
                uiIndex: column,
                id: 0,
                date: `${date[2]}-${date[1]}-${date[0]}`.concat("T00:00:00.000Z"),
                year: parseInt(currentYear),
                update_flag: true,
                delete_flag: false,
                hours: hours || 0,
            };
            data = [
                ...data.slice(0, groupIndex),
                {
                    ...data[groupIndex],
                    consults: [...(data[groupIndex].consults || []), newConsult],
                },
                ...data.slice(groupIndex + 1),
            ];
            return;
        }
        if (!date && hours) {
            date = consult.date;
        }

        let flag = date === "";
        data = [
            ...data.slice(0, groupIndex),
            {
                ...data[groupIndex],
                consults: [
                    ...data[groupIndex].consults.slice(0, dateIndex),
                    {
                        ...data[groupIndex].consults[dateIndex],
                        date: Array.isArray(date)
                            ? `${date[2]}-${date[1]}-${date[0]}`.concat("T00:00:00.000Z")
                            : date,
                        hours: hours || 0,
                        delete_flag: flag,
                        update_flag: !flag,
                    },
                    ...data[groupIndex].consults.slice(dateIndex + 1),
                ],
            },
            ...data.slice(groupIndex + 1),
        ];
    };

    const createIndividualUpdateData = () => {
        let result = [];
        data.forEach((student) => {
            student.consult.forEach((date) => {
                if (date.update_flag)
                    result.push({
                        id: date.id,
                        date: date.date,
                        year: parseInt(currentYear),
                        hours: date.hours,
                        relationId: student.id,
                    });
            });
        });
        return result;
    };

    const createGroupUpdateData = () => {
        let result = [];
        data.forEach((group) => {
            let groupData = [];
            group.consults.forEach((consult) => {
                if (consult.update_flag)
                    groupData.push({
                        id: consult.id,
                        date: consult.date,
                        year: parseInt(currentYear),
                        hours: consult.hours,
                    });
            });
            result.push({
                subgroup:
                    group.group.split(" ")[2] === "..."
                        ? null
                        : parseInt(group.group.split(" ")[2]),
                program: group.group.split(" ")[1],
                class: parseInt(group.group.split(" ")[0]),
                consults: groupData,
            });
        });
        return result;
    };

    const createClearData = () => {
        let result = [];
        data.forEach((student) => {
            student.consult.forEach((date) => {
                if (date.delete_flag && date.id !== 0) result.push(date.id);
            });
        });
        return result;
    };

    const saveIndividual = async () => {
        await update({
            variables: {
                data: createIndividualUpdateData(),
            },
        });

        await clear({
            variables: {
                ids: createClearData(),
            },
        });
        refetch();
    };

    const saveGroup = async () => {
        await update({
            variables: {
                teacher: props.location.state?.teacher || auth.user.teacher,
                course: userCourses[course].id,
                data: createGroupUpdateData(),
            },
        });
        refetch();
    };

    const save = async (e) => {
        return userCourses[course].group ? saveGroup(e) : saveIndividual(e);
    };

    const items = [
        {
            type: "dropdown",
            data: userCourses.map((course) => course.name),
            label: "Предмет :",
            text: userCourses[course].name,
            onClick: getCourse,
        },
        {
            type: "dropdown",
            data: YEARS,
            label: "Год :",
            text: currentYear,
            onClick: onYearChange,
        },
        {
            type: "button",
            text: "Сохранить",
            onClick: save,
        },
    ];

    const spinner = <div>Загрузка</div>;

    if (loading) return spinner;
    if (networkStatus === NetworkStatus.refetch) return spinner;
    if (error) throw new Error('503');

    data = userCourses[course].group
        ? data.fetchGroupConsults
        : data.fetchConsults;

    return userCourses[course].group ? (
        <GroupConsultsView
            data={data}
            controlItems={items}
            updateDates={updateGroupData}
            year={currentYear}
        />
    ) : (
        <IndividualConsultsView
            data={data}
            controlItems={items}
            updateDates={updateIndividualData}
            year={currentYear}
        />
    );
};
