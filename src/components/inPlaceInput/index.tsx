import { ChangeEvent, useState } from 'react';
import { FaCheckCircle, FaPen, FaTrashAlt } from 'react-icons/fa';
import styles from './inPlaceInput.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InPlaceInputInitialData {
    id: number;
    name: string;
}

interface Props {
    initialData: InPlaceInputInitialData | undefined;
    updateMutationFn: (data: InPlaceInputInitialData) => Promise<void>;
    deleteMutationFn: (id: number) => Promise<void>;
    isEnabled: boolean;
    placeholder: string;
}

export const InPlaceInput = (props: Props) => {
    const { initialData, isEnabled, placeholder, updateMutationFn, deleteMutationFn } = props;

    const queryClient = useQueryClient();

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: updateMutationFn,
        onSuccess: () => {
            setEnabled(false);
            queryClient.invalidateQueries({ queryKey: ['midtermExamType'] });
        }
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteMutationFn,
        onSuccess: () => {
            setEnabled(false);
            queryClient.invalidateQueries({ queryKey: ['midtermExamType'] });
        }
    });

    const [enabled, setEnabled] = useState(isEnabled);
    const [inputData, setInputData] = useState(initialData?.name);

    const handleSave = () => {
        update({
            id: initialData?.id || 0,
            name: inputData || ''
        });
    };

    const handleDelete = () => {
        remove(initialData?.id || 0);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    const isPending = isUpdating || isDeleting;

    return (
        <div className={styles.inputWrapper}>
            <input
                className={styles.input}
                onChange={handleChange}
                value={inputData || ''}
                disabled={!enabled}
                placeholder={placeholder}
                size={35}
            />
            {enabled ? (
                <button onClick={handleSave} disabled={isPending} className={styles.button}>
                    <FaCheckCircle size={28} />
                </button>
            ) : (
                <button onClick={() => setEnabled(true)} disabled={isPending} className={styles.button}>
                    <FaPen size={28} />
                </button>
            )}
            {initialData?.name && (
                <button onClick={() => handleDelete()} disabled={isPending} className={styles.button}>
                    <FaTrashAlt size={28} />
                </button>
            )}
        </div>
    );
};
