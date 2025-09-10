export const DROPDOWN_THEMES = {
    DEFAULT: 'default',
    CONTROL: 'control'
};

export type DropdownTheme = (typeof DROPDOWN_THEMES)[keyof typeof DROPDOWN_THEMES];
