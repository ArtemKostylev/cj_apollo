import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { useCallback, useMemo } from 'react';
import { UPDATE_GROUP_CONSULTS_MUTATION } from '../../../graphql/mutations/updateGroupConsults';
import { UPDATE_CONSULTS_MUTATION } from '../../../graphql/mutations/updateConsults';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { TableControlType } from '../../../ui/TableControls';
import { YEARS } from '../../../constants/date';

export const useConsultControls = (
  refetch: Function,
  createGroupUpdateData: Function,
  createIndividualUpdateData: Function,
  userCourses: Course[],
  course: number,
  currentYear: number,
  onCourseChange: Function,
  onYearChange: Function
) => {
  const location = useLocation() as any;
  const auth = useAuth();

  const [update] = useMutation(
    userCourses[course].group
      ? UPDATE_GROUP_CONSULTS_MUTATION
      : UPDATE_CONSULTS_MUTATION
  );

  const saveIndividual = useCallback(() => {
    update({
      variables: {
        data: createIndividualUpdateData(),
      },
      onCompleted: () => refetch(),
    });
  }, [refetch, createIndividualUpdateData, update]);

  const saveGroup = useCallback(() => {
    update({
      variables: {
        teacher: location.state?.teacher || auth.user.versions[currentYear].id,
        course: userCourses[course].id,
        data: createGroupUpdateData(),
      },
      onCompleted: () => refetch(),
    });
  }, [
    refetch,
    createGroupUpdateData,
    userCourses,
    course,
    currentYear,
    location,
    auth,
    update,
  ]);

  const save = useCallback(() => {
    return userCourses[course].group ? saveGroup() : saveIndividual();
  }, [saveGroup, saveIndividual, userCourses, course]);

  return useMemo(() => {
    return [
      {
        type: TableControlType.SELECT,
        options: new Map(
          userCourses.map((it, index) => [
            index,
            { value: index, text: it.name },
          ])
        ),
        text: userCourses[course].name,
        onClick: onCourseChange,
      },
      {
        type: TableControlType.SELECT,
        options: YEARS,
        text: YEARS.get(currentYear)?.text,
        onClick: onYearChange,
      },
      {
        type: TableControlType.BUTTON,
        text: 'Сохранить',
        onClick: save,
      },
    ];
  }, [
    userCourses,
    currentYear,
    course,
    onYearChange,
    onCourseChange,
    save
  ]);
};
