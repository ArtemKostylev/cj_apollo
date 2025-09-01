import { createContext, useContext, useState, type PropsWithChildren } from 'react';

const ActualDatesContext = createContext<{
    actualDates: Record<string, string[]>;
    setActualDates: (actualDates: Record<string, string[]>) => void;
}>({ actualDates: {}, setActualDates: () => {} });

export const ActualDatesProvider = ({ children }: PropsWithChildren) => {
    const [actualDates, setActualDates] = useState<Record<string, string[]>>({});
    return (
        <ActualDatesContext.Provider value={{ actualDates, setActualDates }}>{children}</ActualDatesContext.Provider>
    );
};

export const useActualDatesContext = () => {
    return useContext(ActualDatesContext);
};
