declare type PrimitiveComponentProps = {
  children?: React.ReactNode;
  style?: Record<string, string | number>;
  className?: string;
}

declare type DropdownOptionType = { value: string | number, text: string, short?: boolean }

declare type OnSelectType = (value: string | number) => void;

declare interface PrimitiveCacheEntity extends Record<string, string | number | boolean | PrimitiveCacheEntity> {
  __typename: string;
  id: number;
}
