import { useEffect, useState } from 'react';
import { t } from '../static/text';

export const usePageLeave = () => {
  const [changed, setChanged] = useState();
  const [ref, setRef] = useState();

  useEffect(() => {

    const listener = (event) => {
      if (changed) {
        event.preventDefault();
        let confirm = window.confirm(t('unsaved_warning'));
        if (!confirm) event.stopImmediatePropagation();
      }
    };

    ref?.current?.addEventListener('click', listener);

    return () => {
      ref?.current?.removeEventListener('click', listener);
    };
  }, [ref, changed]);

  return [setChanged, setRef];
};
