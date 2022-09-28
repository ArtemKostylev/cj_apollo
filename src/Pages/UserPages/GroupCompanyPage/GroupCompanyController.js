import React, {useEffect, useState} from 'react'
import {useAuth} from '../../../hooks/useAuth'
import {DELETE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteGroupConsults";
import {DELETE_CONSULTS_MUTATION} from "../../../graphql/mutations/deleteConsults";
import {FETCH_CONSULTS_QUERY} from "../../../graphql/queries/fetchConsults";
import {UPDATE_GROUP_CONSULTS_MUTATION} from "../../../graphql/mutations/updateGroupConsults";
import {UPDATE_CONSULTS_MUTATION} from "../../../graphql/mutations/updateConsults";
import {FETCH_GROUP_CONSULTS_QUERY} from "../../../graphql/queries/fetchGroupConsults";
import {NetworkStatus, useMutation, useQuery} from '@apollo/client'
import GroupCompanyView from './GroupCompanyView'
import moment from 'moment'

export const ConsultController = (props) => {
    const auth = useAuth()

    const year = moment().month() > 7 ? moment().year() : moment().year() - 1
    const [course, setCourse] = useState(0)

    const userCourses = props.location.state?.courses || auth.user?.courses

    var changed = false

    const listener = (event) => {
        if (changed) {
            event.preventDefault()
            let confirm = window.confirm(
                'Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.',
            )
            if (!confirm) event.stopImmediatePropagation()
        }
    }

    useEffect(() => {
        props.menuRef?.current.addEventListener('click', listener)

        return () => {
            props.menuRef?.current?.removeEventListener('click', listener)
        }
    })

    const getCourse = (e) => {
        setCourse(e.target.getAttribute('data-index'))
        refetch()
    }

    let {loading, data, error, refetch, networkStatus} = useQuery(
        userCourses[course].group
            ? FETCH_GROUP_CONSULTS_QUERY
            : FETCH_CONSULTS_QUERY,
        {
            variables: {
                teacherId: props.location.state?.teacher || auth.user.teacher,
                courseId: userCourses[course].id,
                year: parseInt(year),
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        },
    )

    const [update] = useMutation(
        userCourses[course].group
            ? UPDATE_GROUP_CONSULTS_MUTATION
            : UPDATE_CONSULTS_MUTATION,
    )

    const updateGroupData = ({date, hours, column, row}) => {
        const group = data.find((item, index) => item.group === row)
        const groupIndex = data.indexOf(group)
        let consult = group.consults.find((item) => item.id === column)
        const dateIndex = group.consults.indexOf(consult)
        changed = true
        date =
            date instanceof Date ? date.toLocaleDateString('ru-RU').split('.') : date

        if (!consult) {
            const newConsult = {
                id: 0,
                date: `${date[2]}-${date[1]}-${date[0]}`.concat('T00:00:00.000Z'),
                year: parseInt(year),
                update_flag: true,
                delete_flag: false,
                hours: hours || 0,
            }
            data = [
                ...data.slice(0, groupIndex),
                {
                    ...data[groupIndex],
                    consults: [...(data[groupIndex].consults || []), newConsult],
                },
                ...data.slice(groupIndex + 1),
            ]
            return
        }
        if (!date && hours) {
            date = consult.date
        }

        let flag = date === ''
        data = [
            ...data.slice(0, groupIndex),
            {
                ...data[groupIndex],
                consults: [
                    ...data[groupIndex].consults.slice(0, dateIndex),
                    {
                        ...data[groupIndex].consults[dateIndex],
                        date: Array.isArray(date)
                            ? `${date[2]}-${date[1]}-${date[0]}`.concat('T00:00:00.000Z')
                            : date,
                        hours: hours || 0,
                        delete_flag: flag,
                        update_flag: !flag,
                    },
                    ...data[groupIndex].consults.slice(dateIndex + 1),
                ],
            },
            ...data.slice(groupIndex + 1),
        ]
    }

    const createGroupUpdateData = () => {
        let result = []
        data.forEach((group) => {
            let groupData = []
            group.consults.forEach((consult) => {
                if (consult.update_flag)
                    groupData.push({
                        id: consult.id,
                        date: consult.date,
                        year: year,
                        hours: consult.hours,
                    })
            })
            result.push({
                subgroup:
                    group.group.split(' ')[2] === '...'
                        ? null
                        : parseInt(group.group.split(' ')[2]),
                program: group.group.split(' ')[1],
                class: parseInt(group.group.split(' ')[0]),
                hours: groupData,
            })
        })
        return result
    }

    const save = async (e) => {
        await update({
            variables: {
                teacherId: props.location.state?.teacher || auth.user.teacher,
                courseId: userCourses[course].id,
                data: createGroupUpdateData(),
            },
        })
        refetch()
    }

    const items = [
        {
            type: 'button',
            text: 'Сохранить',
            onClick: save,
        },
        {
            type: 'button',
            text: 'Отменить изменения',
            onClick: () => refetch(),
        },
    ]

    const spinner = <div>Загрузка</div>

    if (loading) return spinner
    if (networkStatus === NetworkStatus.refetch) return spinner
    if (error) throw new Error(503)

    data = data.fetchGroupCompany

    return (
        <GroupCompanyView
            data={data}
            controlItems={items}
            updateDates={updateGroupData}
        />
    )
}
