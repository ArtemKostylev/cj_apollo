import { useQuery } from '@tanstack/react-query';
import { deleteMidtermExamType, getMidtermExamTypes, updateMidtermExamType } from '~/api/midtermExamType';
import { PageWrapper } from '~/components/pageWrapper';
import { InPlaceInput } from '../../components/inPlaceInput';
import { PageLoader } from '~/components/pageLoader';
import styles from './midtermExam.module.css';

export const MidtermExamType = () => {
    let { data, isLoading, isError } = useQuery({
        queryKey: ['midtermExamType'],
        queryFn: () => getMidtermExamTypes()
    });

    return (
        <PageWrapper>
            <PageLoader loading={isLoading} error={isError}>
                <div className={styles.formWrapper}>
                    {data?.midtermExamTypes.map((type) => (
                        <InPlaceInput
                            isEnabled={false}
                            initialData={type}
                            key={type.name}
                            updateMutationFn={updateMidtermExamType}
                            deleteMutationFn={deleteMidtermExamType}
                            placeholder="Введите название типа аттестации"
                        />
                    ))}
                    <InPlaceInput
                        isEnabled={true}
                        initialData={undefined}
                        updateMutationFn={updateMidtermExamType}
                        deleteMutationFn={deleteMidtermExamType}
                        placeholder="Введите название типа аттестации"
                    />
                </div>
            </PageLoader>
        </PageWrapper>
    );
};
