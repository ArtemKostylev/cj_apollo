declare type PrimitiveComponentProps = {
  children?: React.ReactNode;
  style?: Record<string, string | number>;
  className?: string;
}

declare type DropdownOptionType = { value: string | number, text: string, short?: boolean }

declare type OnSelectType = (value: string | number) => void;

declare type PrimitiveCacheEntity = { __typename: string, id: number };

declare module "*.module.css" {
  const classes: {[key: string]: string};
  export default classes;
}