import { useMutation, useQuery } from '@tanstack/react-query';
import { getConsults, updateConsults } from '../../api/consult';
import { useUserData } from '../../hooks/useUserData';
import { getCurrentAcademicYear } from '../../utils/academicDate';
import { useRef, useState } from 'react';
import { TableControls } from '~/components/tableControls';
import { PageWrapper } from '~/components/pageWrapper';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { AcademicYears, YEARS, YEARS_NAMES } from '~/constants/date';
import { ControlButton } from '~/components/tableControls/controlButton';
import { Table } from '~/components/table';
import { TableHeader } from '~/components/table/tableHeader';
import { NameCell_old } from '~/components/cells/NameCell_old';
import type { ChangedConsult } from '~/models/consult';
import { DateSelectCell } from '~/components/cells/dateSelectCell';
import { PageLoader } from '~/components/PageLoader';

export const Consult = () => {
    const { userData } = useUserData();
    const [year, setYear] = useState(getCurrentAcademicYear() as AcademicYears);

    const currentVersion = userData.versions[year];
    const { coursesById, courses } = currentVersion;

    const [course, setCourse] = useState(courses[0].id);
    const courseOptions = toSelectOptions(courses, 'id', 'name');

    const changedConsults = useRef<Record<string, ChangedConsult>>({});

    const onCellValueChange = (columnId: string, consult: ChangedConsult) => {
        changedConsults.current[columnId] = consult;
    };

    const {
        data: consults,
        isLoading: isConsultsLoading,
        isError: isConsultsError
    } = useQuery({
        queryKey: ['consults'],
        queryFn: () =>
            getConsults({
                courseId: coursesById[course].id,
                teacherId: currentVersion.teacherId,
                year: year
            })
    });

    const { isPending: isUpdatePending, mutate: save } = useMutation({
        mutationFn: () => {
            const data = Object.values(changedConsults.current).map((consult) => ({
                id: consult.id,
                date: consult.date,
                hours: consult.hours,
                relationId: consult.relationId as number,
                year: year
            }));

            return updateConsults({
                consults: data
            });
        }
    });

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={courseOptions}
                    buttonText={coursesById?.[course]?.name}
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => setYear(value as AcademicYears)}
                />
                <ControlButton text="Сохранить" onClick={save} disabled={isUpdatePending} />
            </TableControls>
            <PageLoader loading={isConsultsLoading} error={isConsultsError}>
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
                                <NameCell_old name={relation.student?.name} surname={relation.student?.surname} />
                                {Array.from({ length: 16 }, (_, index) => (
                                    <DateSelectCell
                                        columnId={`${relation.id}-${index}`}
                                        onChange={onCellValueChange}
                                        consultId={relation.consults?.[index]?.id}
                                        date={relation.consults?.[index]?.date}
                                        hours={relation.consults?.[index]?.hours}
                                        relationId={relation.id}
                                        year={year}
                                        key={index}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </PageLoader>
        </PageWrapper>
    );
};
