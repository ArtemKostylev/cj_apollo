import { useMutation, useQuery } from '@tanstack/react-query';
import { getConsults, updateConsults } from '../../../api/consult';
import { useUserData } from '../../../hooks/useUserData';
import { getCurrentAcademicYear } from '../../../utils/academicDate';
import { useRef, useState } from 'react';
import { LegacySpinner } from '../../../ui/LegacySpinner';
import { TableControls } from '../../../ui/TableControls';
import { PageWrapper } from '~/ui/PageWrapper';
import { ControlSelect } from '~/ui/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { AvailableYears, YEARS, YEARS_NAMES } from '~/constants/date';
import { ControlButton } from '~/ui/tableControls/controlButton';
import { Table } from '~/ui/Table';
import { TableHeader } from '~/ui/Table/tableHeader';
import { NameView } from '~/ui/cells/NameView';
import { times } from 'lodash';
import HourDateCell from '../ConsultsPage/HourDateCell';

interface UpdatedConsult {
    clientId: string;
    id: number | undefined;
    date: string;
    hours: number | undefined;
    relationId: number;
    year: number;
}

export const Consults = () => {
    const { user } = useUserData();
    const [year, setYear] = useState(
        getCurrentAcademicYear() as AvailableYears
    );

    const currentVersion = user.versions[year];
    const courses = currentVersion.courses;

    const [course, setCourse] = useState(courses[0].id);
    const courseOptions = toSelectOptions(courses, 'id', 'name');

    const changedConsults = useRef<Record<string, UpdatedConsult>>({});

    const onCellValueChange = (consult: UpdatedConsult) => {
        changedConsults.current[consult.clientId] = consult;
    };

    const {
        data: consults,
        isLoading: isConsultsLoading,
        isError: isConsultsError
    } = useQuery({
        queryKey: ['consults'],
        queryFn: () =>
            getConsults({
                courseId: currentVersion.id,
                teacherId: courses[course].id,
                year: year
            })
    });

    const { isPending: isUpdatePending, mutate: save } = useMutation({
        mutationFn: () => {
            const data = Object.values(changedConsults.current).map(
                (consult) => ({
                    id: consult.id,
                    date: consult.date,
                    hours: consult.hours,
                    relationId: consult.relationId,
                    year: year
                })
            );

            return updateConsults({
                consults: data
            });
        }
    });

    if (isConsultsLoading) return <LegacySpinner />;
    if (isConsultsError) throw new Error('503');

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={courseOptions}
                    buttonText={courses[course].name}
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => setYear(value as AvailableYears)}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={save}
                    disabled={isUpdatePending}
                />
            </TableControls>
            <Table>
                <thead>
                    <tr>
                        <TableHeader width="30%">Имя ученика</TableHeader>
                        <TableHeader width="70%" colSpan={32}>
                            Дата/Часы
                        </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {consults?.map((relation) => (
                        <tr key={relation.id}>
                            <NameView
                                name={relation.student?.name}
                                surname={relation.student?.surname}
                            />
                            {times(16, (index) => (
                                <HourDateCell
                                    updateDates={updateDates}
                                    column={
                                        item.consult[index]?.id || `ui_${index}`
                                    }
                                    row={item.student.id}
                                    date={
                                        item.consult[index] &&
                                        moment(item.consult[index].date)
                                    }
                                    hours={item.consult[index]?.hours}
                                    key={index}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </PageWrapper>
    );
};
