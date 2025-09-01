import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { getAllGroupConsults, updateGroupConsults } from '~/api/groupConsult';
import { ClassCell } from '~/components/cells/ClassCell';
import {
    ConsultCell,
    type UpdatedConsult
} from '~/components/cells/ConsultCell';
import { LegacySpinner } from '~/components/LegacySpinner';
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

export const GroupConsult = () => {
    const { userData } = useUserData();
    const [year, setYear] = useState(getCurrentAcademicYear() as AcademicYears);

    const currentVersion = userData.versions[year];
    const { coursesById, courses } = currentVersion;

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
        queryKey: ['groupConsults'],
        queryFn: () =>
            getAllGroupConsults({
                courseId: coursesById[course].id,
                teacherId: currentVersion.teacherId,
                year: year
            })
    });

    const { isPending: isUpdatePending, mutate: save } = useMutation({
        mutationFn: () => {
            const data = Object.values(changedConsults.current).map(
                (consult) => ({
                    ...consult,
                    consultId: consult.id,
                    class: consult.class as number,
                    program: consult.program as string,
                    subgroup: consult.subgroup as number,
                    year: year
                })
            );

            return updateGroupConsults({
                teacher: currentVersion.teacherId,
                course,
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
                    buttonText={coursesById[course].name}
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => setYear(value as AcademicYears)}
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
                        <TableHeader width="30%">Группа</TableHeader>
                        <TableHeader width="70%" colSpan={16}>
                            Дата/Часы
                        </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {consults?.map((group) => (
                        <tr key={group.group}>
                            <ClassCell
                                classNum={group.class}
                                program={group.program}
                                subgroup={group.subgroup}
                            />
                            {Array.from({ length: 8 }, (_, index) => (
                                <ConsultCell
                                    clientId={`${group}-${index}`}
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
        </PageWrapper>
    );
};
