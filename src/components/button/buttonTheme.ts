export const BUTTON_THEMES = {
    DEFAULT: 'default',
    CONTROL: 'control'
};

export type ButtonTheme = typeof BUTTON_THEMES[keyof typeof BUTTON_THEMES];