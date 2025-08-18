import { PageWrapper } from '~/components/PageWrapper';
import { Input } from './Input';
import styles from './midtermExam.module.css';

interface Props {
    initialData: MidtermExamType[];
}

export const MidtermExamTypeView = ({ initialData }: Props) => {
    return (
        <PageWrapper>
            <div className={styles.formWrapper}>
                {initialData.map((type) => (
                    <Input
                        isEnabled={false}
                        initialData={type}
                        key={type.name}
                        placeholder="Введите название типа аттестации"
                    />
                ))}
                <Input
                    isEnabled={true}
                    placeholder="Введите название типа аттестации"
                />
            </div>
        </PageWrapper>
    );
};
