import { useQuery } from '@apollo/client';
import { MidtermExamTypeView } from './MidtermExamTypeView';
import { Spinner } from '~/components/Spinner';
import { FETCH_MIDTERM_EXAM_TYPES } from '~/graphql/queries/fetchMidterExamTypes';

export const MidtermExamTypes = () => {
  let {loading, data, error} = useQuery<{ fetchMidtermExamTypes: MidtermExamType[] }>(
    FETCH_MIDTERM_EXAM_TYPES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  if (loading || !data) return <Spinner/>;
  if (error) throw new Error('503');

  return (
    <MidtermExamTypeView initialData={data.fetchMidtermExamTypes}/>
  );
};
