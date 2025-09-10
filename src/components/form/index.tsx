import classNames from 'classnames';
import { PropsWithChildren, useCallback } from 'react';
import styles from './form.module.css';
import { DefaultValues, FieldValues, useForm, FormProvider } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
    defaultValues: DefaultValues<T>;
    className?: string;
    onSubmit: (values: T) => void;
    submitError?: string | false | undefined;
}

export function Form<T extends FieldValues>(props: PropsWithChildren<FormProps<T>>) {
    const { className: externalClassName, onSubmit, children, defaultValues, submitError } = props;

    const formMethods = useForm({
        defaultValues: defaultValues
    });
    const { handleSubmit } = formMethods;

    const internalOnSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit((value) => onSubmit(value))();
        },
        [handleSubmit, onSubmit]
    );

    const className = classNames(styles.form, externalClassName);

    return (
        <form className={className} onSubmit={internalOnSubmit}>
            <FormProvider {...formMethods}>{children}</FormProvider>
            {submitError && <span className={styles.submitError}>{submitError}</span>}
        </form>
    );
}

export { FormInput } from './formInput';
