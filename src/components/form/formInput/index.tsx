import { FormItem } from '../formItem';
import { Input } from '~/components/input';
import { RegisterOptions, useFormContext } from 'react-hook-form';

interface FormInputProps {
    name: string;
    label: string;
    className?: string;
    type: string;
    required?: boolean;
    pattern?: RegisterOptions['pattern'];
    minLength?: RegisterOptions['minLength'];
    maxLength?: RegisterOptions['maxLength'];
}

export function FormInput(props: FormInputProps) {
    const { label, type, name, className, required, pattern, minLength, maxLength } = props;
    const {
        register,
        formState: { errors }
    } = useFormContext();

    const error = errors[name]?.message?.toString();

    const registerProps = register(name, {
        required: required,
        pattern,
        minLength,
        maxLength
    });

    return (
        <FormItem label={label} error={error}>
            <Input {...registerProps} type={type} className={className} />
        </FormItem>
    );
}
