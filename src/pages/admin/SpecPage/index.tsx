import { Spinner } from '~/components/spinner';
import { FETCH_SPECIALIZATION } from '~/graphql/queries/fetchSpecialization';
import { NetworkStatus, useQuery } from '@apollo/client';
import { PageWrapper } from '~/components/pageWrapper';
import { SpecInput } from './SpecInput';

export const Specialization = () => {
    let { loading, data, error, refetch, networkStatus } = useQuery(
        FETCH_SPECIALIZATION,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        }
    );

    if (loading || networkStatus === NetworkStatus.refetch) return <Spinner />;
    if (error) throw new Error('503');

    // TODO: reuse pages from ui-v2
    return (
        <PageWrapper>
            <div>
                {data.fetchSpecialization.map((spec: Specialization) => (
                    <SpecInput
                        enabled={false}
                        initialData={spec}
                        refetch={refetch}
                    />
                ))}
                <SpecInput enabled={true} refetch={refetch} />
            </div>
        </PageWrapper>
    );
};
