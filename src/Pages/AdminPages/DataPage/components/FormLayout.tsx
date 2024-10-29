import { FormEvent, PropsWithChildren, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../../ui/Button';

interface Props {
    title: string;
    onSubmit: (values: unknown) => Promise<void>;
    onClose: VoidFunction;
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`

const ModalControls = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`

export function FormLayout(props: PropsWithChildren<Props>) {
    const { title, children, onSubmit: submitCallback, onClose } = props;

    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!e.target) return;

        setLoading(true);

        const data = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(data.entries()) as unknown;

        await submitCallback(values);
        setLoading(false);
        onClose();
    }

    return (
        <Form onSubmit={onSubmit}>
            <h1>{title}</h1>
            {children}
            <ModalControls>
                <Button disabled={loading} type='submit'>Сохранить</Button>
                <Button disabled={loading} onClick={onClose}>Отмена</Button>
            </ModalControls>
        </Form>
    )

}