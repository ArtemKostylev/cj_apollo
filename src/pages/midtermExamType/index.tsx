import { useQuery } from '@tanstack/react-query';
import { getMidtermExamTypes } from '~/api/midtermExamType';
import { PageWrapper } from '~/components/pageWrapper';
import { Input } from './Input';
import { PageLoader } from '~/components/PageLoader';
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
                        <Input
                            isEnabled={false}
                            initialData={type}
                            key={type.name}
                            placeholder="Введите название типа аттестации"
                        />
                    ))}
                    <Input isEnabled={true} initialData={undefined} placeholder="Введите название типа аттестации" />
                </div>
            </PageLoader>
        </PageWrapper>
    );
};
