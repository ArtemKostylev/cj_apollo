import type { DropdownOptionType } from '~/models/dropdownOption';
import { FormItem } from '../formItem';
import { useFormContext } from 'react-hook-form';
import { Select } from '~/components/select';

interface FormSelectProps {
    name: string;
    label: string;
    className?: string;
    options: DropdownOptionType[];
    required?: boolean;
}

export const FormSelect = (props: FormSelectProps) => {
    const { name, label, options, required, className } = props;

    const {
        register,
        formState: { errors }
    } = useFormContext();

    const error = errors[name]?.message?.toString();

    const registerProps = register(name, {
        required: required
    });

    return (
        <FormItem label={label} error={error}>
            <Select {...registerProps} options={options} className={className} />
        </FormItem>
    );
};
