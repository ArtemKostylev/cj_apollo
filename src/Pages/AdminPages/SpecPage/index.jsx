import React from 'react';
import {SpecPageView} from './SpecPageView';
import {Spinner} from '../../../ui/Spinner';
import {FETCH_SPECIALIZATION} from '../../../graphql/queries/fetchSpecialization';
import {NetworkStatus, useQuery} from '@apollo/client';

export const Specialization = () => {
    let {loading, data, error, refetch, networkStatus} = useQuery(
        FETCH_SPECIALIZATION,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        }
    );

    if (loading || networkStatus === NetworkStatus.refetch) return <Spinner/>;
    if (error) throw new Error(503);

    return (
        <SpecPageView initialData={data.fetchSpecialization} refetch={refetch}/>
    );
};
