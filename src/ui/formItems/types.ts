export interface FormItemProps<T> {
  name: string;
  label: string;
  defaultValue?: T | undefined;
  required?: boolean;
}