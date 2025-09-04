import { useBlocker } from '@tanstack/react-router';

export const useBlockPageLeave = (changedData: Record<any, any> | string) => {
    useBlocker({
        shouldBlockFn: () => {
            if (typeof changedData === 'string' && !!changedData) {
                return false;
            }

            if (!Object.keys(changedData).length) return false;

            const shouldLeave = confirm(
                'В журнале остались несохраненные изменения. Вы уверены, что хотите покинуть страницу?'
            );
            return !shouldLeave;
        },
        enableBeforeUnload: false
    });
};
