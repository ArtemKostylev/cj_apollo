import { useState } from 'react';
import { UPDATE_SPECIALIZATION_MUTATION } from '~/graphql/mutations/updateSpecialization';
import { DELETE_SPECIALIZATION_MUTATION } from '~/graphql/mutations/deleteSpecialization';
import { useMutation } from '@apollo/client';
import { FormInput } from '~/components/formItems/formInput';
import { FaCheckCircle, FaPen, FaTrashAlt } from 'react-icons/fa';
import styles from './specInput.module.css';

interface Props {
    initialData?: Specialization;
    refetch: () => void;
    enabled: boolean;
}
export const SpecInput = (props: Props) => {
    const { initialData, refetch, enabled: enabledProp } = props;
    const [updateSpec] = useMutation(UPDATE_SPECIALIZATION_MUTATION);
    const [deleteSpec] = useMutation(DELETE_SPECIALIZATION_MUTATION);

    const [enabled, setEnabled] = useState(enabledProp);
    const [inputData, setInputData] = useState(initialData);

    const handleSave = async () => {
        await updateSpec({
            variables: {
                data: {
                    id: inputData?.id,
                    name: inputData?.name
                }
            }
        });
        setEnabled(false);
        refetch();
    };

    const handleDelete = async () => {
        await deleteSpec({
            variables: {
                id: inputData?.id
            }
        });
        setEnabled(false);
        refetch();
    };

    const handleChange = (_: string, value: string | number) => {
        setInputData((prev) =>
            prev
                ? { ...prev, name: value as string }
                : { id: 0, name: value as string, students: [] }
        );
    };

    return (
        <div className={styles.specInputWrapper}>
            <FormInput
                name="name"
                onChange={handleChange}
                label="Название специальности"
                value={inputData?.name}
                disabled={!enabled}
                placeholder={'Введите название специальности'}
                size={35}
            />
            {enabled ? (
                <FaCheckCircle
                    size={28}
                    style={{ cursor: 'pointer', marginTop: '20px' }}
                    onClick={() => handleSave()}
                />
            ) : (
                <FaPen
                    size={28}
                    style={{ cursor: 'pointer', marginTop: '20px' }}
                    onClick={() => setEnabled(true)}
                />
            )}
            {initialData?.name && (
                <FaTrashAlt
                    size={28}
                    style={{ cursor: 'pointer', marginTop: '20px' }}
                    onClick={() => handleDelete()}
                />
            )}
        </div>
    );
};
