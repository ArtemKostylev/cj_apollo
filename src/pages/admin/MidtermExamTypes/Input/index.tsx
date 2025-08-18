import { ChangeEvent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_MIDTERM_EXAM_TYPE } from '~/graphql/mutations/updateMidtermExamType';
import { DELETE_MIDTERM_EXAM_TYPE } from '~/graphql/mutations/deleteMidtermExamType';
import { FaCheckCircle, FaPen, FaTrashAlt } from 'react-icons/fa';
import { FETCH_MIDTERM_EXAM_TYPES } from '~/graphql/queries/fetchMidterExamTypes';
import styles from './midtermExamInput.module.css';

interface Props {
    initialData?: MidtermExamType;
    isEnabled: boolean;
    placeholder?: string;
}

export const Input = ({
    initialData = { id: 0, name: '' } as MidtermExamType,
    isEnabled,
    placeholder = 'Введите название специальности'
}: Props) => {
    const [update] = useMutation(UPDATE_MIDTERM_EXAM_TYPE, {
        refetchQueries: [{ query: FETCH_MIDTERM_EXAM_TYPES }]
    });
    const [remove] = useMutation(DELETE_MIDTERM_EXAM_TYPE, {
        refetchQueries: [{ query: FETCH_MIDTERM_EXAM_TYPES }]
    });

    const [enabled, setEnabled] = useState(isEnabled);
    const [inputData, setInputData] = useState(initialData);

    const handleSave = async () => {
        await update({
            variables: {
                data: {
                    id: inputData.id || 0,
                    name: inputData.name
                }
            }
        });
        setEnabled(false);
        setInputData(initialData);
    };

    const handleDelete = async () => {
        await remove({
            variables: {
                id: inputData.id
            }
        });
        setEnabled(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData((prev) => ({ ...prev, name: e.target.value }));
    };

    return (
        <div className={styles.inputWrapper}>
            <input
                className={styles.input}
                onChange={handleChange}
                value={inputData.name}
                disabled={!enabled}
                placeholder={placeholder}
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
            {initialData.name && (
                <FaTrashAlt
                    size={28}
                    style={{ cursor: 'pointer', marginTop: '20px' }}
                    onClick={() => handleDelete()}
                />
            )}
        </div>
    );
};
