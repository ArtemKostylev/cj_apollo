import { useState } from 'react';

export function useFilter<T>(
    initialState: T,
    key: string,
    transformSearchValue: (searchValue: string) => T
): [T, (filter: T) => void] {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);

    const searchValue = transformSearchValue(searchParams.get(key) || '');
    const [filter, setFilter] = useState(searchValue || initialState);

    const handleFilterChange = (filter: T) => {
        setFilter(filter);

        const search = window.location.search;
        const searchParams = new URLSearchParams(search);
        searchParams.set(key, String(filter));
        window.history.pushState({}, '', `?${searchParams.toString()}`);
    };

    return [filter, handleFilterChange];
}
