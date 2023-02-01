declare enum AttrType {
  STRING = "string",
  NUMBER = "number",
  SELECT = "select",
  DATE = "date",
  NAME = "name",
  ID = "id",
  CLASS = "class"
}

declare interface FieldInfo {
  type: AttrType;
  options: Options;
  disabled?: boolean;
  rowSpan?: number;
  label: string;
  width?: number;
}

declare type RowInfo<T extends PrimitiveCacheEntity> = Record<keyof T, FieldInfo>

declare type Errors<T> = Record<keyof T, boolean>;

declare type Options = {
  rows?: number;
  selectOptions?: Map<string | number, DropdownOptionType>;
  isWeekend?: boolean;
  year?: number;
};

declare interface TableItemProps {
  value: any;
  onChange: (value: any) => void;
  error?: boolean;
  disabled?: boolean;
  options?: Options;
}

declare interface HeaderProps {
  children?: string;
  hoverable?: boolean;
  width?: number;
  rowSpan: number;
}