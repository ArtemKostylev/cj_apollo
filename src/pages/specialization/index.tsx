import { PageWrapper } from '~/components/pageWrapper';
import { PageLoader } from '~/components/pageLoader';
import { useQuery } from '@tanstack/react-query';
import { deleteSpecialization, getSpecializationList, updateSpecialization } from '~/api/specialization';
import styles from './specialization.module.css';
import { InPlaceInput } from '~/components/inPlaceInput';

export const Specialization = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['specialization'],
        queryFn: getSpecializationList
    });

    return (
        <PageWrapper>
            <PageLoader loading={isLoading} error={isError} />
            <div className={styles.listWrapper}>
                {data?.map((specialization) => (
                    <InPlaceInput
                        isEnabled={false}
                        initialData={specialization}
                        placeholder="Введите название специальности"
                        updateMutationFn={updateSpecialization}
                        deleteMutationFn={deleteSpecialization}
                    />
                ))}
                <InPlaceInput
                    isEnabled={true}
                    initialData={undefined}
                    placeholder="Введите название специальности"
                    updateMutationFn={updateSpecialization}
                    deleteMutationFn={deleteSpecialization}
                />
            </div>
        </PageWrapper>
    );
};
