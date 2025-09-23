import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { getAllGroupConsults, updateGroupConsults } from '~/api/groupConsult';
import { ClassCell } from '~/components/cells/classCell';
import { DateSelectCell } from '~/components/cells/dateSelectCell1';
import { PageWrapper } from '~/components/pageWrapper';
import { Table } from '~/components/table';
import { TableHeader } from '~/components/table/tableHeader';
import { TableControls } from '~/components/tableControls';
import { ControlButton } from '~/components/tableControls/controlButton';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { YEARS, YEARS_NAMES, type AcademicYears } from '~/constants/date';
import { useUserData } from '~/hooks/useUserData';
import { getCurrentAcademicYear } from '~/utils/academicDate';
import { toSelectOptions } from '~/utils/toSelectOptions';
import type { ChangedConsult } from '~/models/consult';
import { PageLoader } from '~/components/pageLoader';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';
import { useFilter } from '~/hooks/useFilter';

export const GroupConsult = () => {
    const { userData } = useUserData();
    const [year, setYear] = useFilter<AcademicYears>(
        getCurrentAcademicYear(),
        'year',
        (val) => Number(val) as AcademicYears
    );

    const currentVersion = userData.versions[year];
    const { coursesById, groupCourses } = currentVersion;

    const [course, setCourse] = useFilter<number>(groupCourses[0].id, 'course', (val) => Number(val) as number);
    const courseOptions = toSelectOptions(groupCourses, 'id', 'name');

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
        queryKey: ['groupConsults', year, course],
        queryFn: () =>
            getAllGroupConsults({
                courseId: coursesById[course].id,
                teacherId: currentVersion.teacherId,
                year: year
            })
    });

    const { isPending: isUpdatePending, mutate: save } = useMutation({
        mutationFn: () => {
            const data = Object.values(changedConsults.current).map((consult) => ({
                ...consult,
                consultId: consult.id ?? undefined,
                class: consult.class as number,
                program: consult.program as string,
                subgroup: consult.subgroup as number,
                year: year
            }));

            return updateGroupConsults({
                teacher: currentVersion.teacherId,
                course,
                consults: data
            });
        },
        onSuccess: () => {
            changedConsults.current = {};
        }
    });

    const saveButtonDisabled = isUpdatePending || isConsultsLoading;
    const readonly = year !== getCurrentAcademicYear();

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={courseOptions}
                    buttonText={coursesById[course].name}
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => {
                        setYear(value as AcademicYears);
                        setCourse(userData.versions[value as AcademicYears].groupCourses[0].id);
                    }}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={save}
                    disabled={saveButtonDisabled}
                    loading={isUpdatePending}
                />
            </TableControls>
            <PageLoader loading={isConsultsLoading} error={isConsultsError}>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader width="30%">Группа</TableHeader>
                            <TableHeader width="70%" colSpan={16}>
                                Дата/Часы
                            </TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {consults?.map((group) => (
                            <tr key={group.group}>
                                <ClassCell classNum={group.class} program={group.program} subgroup={group.subgroup} />
                                {Array.from({ length: 8 }, (_, index) => (
                                    <DateSelectCell
                                        readonly={readonly}
                                        columnId={`${group}-${index}`}
                                        onChange={onCellValueChange}
                                        consultId={group.consults?.[index]?.id}
                                        date={group.consults?.[index]?.date}
                                        hours={group.consults?.[index]?.hours}
                                        class={group.class}
                                        program={group.program}
                                        subgroup={group.subgroup}
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
