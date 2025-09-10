import { FormItem } from '../formItem';
import { useFormContext } from 'react-hook-form';
import { TextArea } from '~/components/textArea';

interface FormTextAreaProps {
    name: string;
    label: string;
    className?: string;
    rows?: number;
    required?: boolean;
}

export function FormTextArea(props: FormTextAreaProps) {
    const { label, name, className, rows, required } = props;
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
            <TextArea {...registerProps} rows={rows} className={className} />
        </FormItem>
    );
}
