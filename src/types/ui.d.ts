declare type PrimitiveComponentProps = {
    children?: React.ReactNode;
    style?: Record<string, string | number>;
    className?: string;
};

declare type DropdownOptionType = {
    value: string;
    text: string;
    short?: boolean;
};

declare type OnSelectType = (value: string) => void;

declare type PrimitiveCacheEntity = { __typename: string; id: number };

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
