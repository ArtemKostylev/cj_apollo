export function toSelectOptions(
    options: Record<string, any>[],
    key: string,
    value: string
): DropdownOptionType[] {
    return options.map((option) => ({
        value: option[key],
        text: option[value]
    }));
}
