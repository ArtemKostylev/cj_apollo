export interface BaseFormItemProps {
  name: string;
  value: string | number | undefined;
  onChange: (name: string, value: string | number) => void;
  label: string;
  required?: boolean;
}