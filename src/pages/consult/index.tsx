import { useMutation, useQuery } from '@tanstack/react-query';
import { getConsults, updateConsults } from '../../api/consult';
import { useUserData } from '../../hooks/useUserData';
import { getCurrentAcademicYear } from '../../utils/academicDate';
import { useRef } from 'react';
import { TableControls } from '~/components/tableControls';
import { PageWrapper } from '~/components/pageWrapper';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { AcademicYears, YEARS, YEARS_NAMES } from '~/constants/date';
import { ControlButton } from '~/components/tableControls/controlButton';
import { Table } from '~/components/table';
import { TableHeader } from '~/components/table/tableHeader';
import type { ChangedConsult } from '~/models/consult';
import { DateSelectCell } from '~/components/cells/dateSelectCell';
import { PageLoader } from '~/components/PageLoader';
import { NameCell } from '~/components/cells/nameCell';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';
import { useFilter } from '~/hooks/useFilter';

export const Consult = () => {
    const { userData } = useUserData();
    const [year, setYear] = useFilter<AcademicYears>(
        getCurrentAcademicYear(),
        'year',
        (val) => Number(val) as AcademicYears
    );

    const currentVersion = userData.versions[year];
    const { coursesById, courses } = currentVersion;

    const [course, setCourse] = useFilter<number>(courses[0].id, 'course', (val) => Number(val) as number);
    const courseOptions = toSelectOptions(courses, 'id', 'name');

    const changedConsults = useRef<Record<string, ChangedConsult>>({});
    useBlockPageLeave(changedConsults.current);

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
        },
        onSuccess: () => {
            changedConsults.current = {};
        }
    });

    const saveButtonDisabled = isUpdatePending || isConsultsLoading;

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
                <ControlButton text="Сохранить" onClick={save} disabled={saveButtonDisabled} loading={isUpdatePending} />
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
                        {consults?.map((row) => (
                            <tr key={row.relationId}>
                                <NameCell name={row.studentName} archived={row.archived} />
                                {Array.from({ length: 16 }, (_, index) => (
                                    <DateSelectCell
                                        columnId={`${row.relationId}-${index}`}
                                        onChange={onCellValueChange}
                                        consultId={row.consults?.[index]?.id}
                                        date={row.consults?.[index]?.date}
                                        hours={row.consults?.[index]?.hours}
                                        relationId={row.relationId}
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
