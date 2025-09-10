import { FormItem } from '../formItem';
import { Input } from '~/components/input';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
    name: string;
    label: string;
    className?: string;
    type: string;
}

export function FormInput(props: FormInputProps) {
    const { label, type, name, className } = props;
    const {
        register,
        formState: { errors }
    } = useFormContext();

    const error = errors[name]?.message?.toString();

    return (
        <FormItem label={label} error={error}>
            <Input {...register(name)} type={type} className={className} />
        </FormItem>
    );
}
