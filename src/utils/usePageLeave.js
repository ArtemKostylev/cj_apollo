import { useEffect, useState } from 'react';
import { t } from '../static/text';

export const usePageLeave = ({ menuRef }) => {
  const [changed, setChanged] = useState();

  useEffect(() => {
    const listener = (event) => {
      if (changed) {
        event.preventDefault();
        let confirm = window.confirm(t('unsaved_warning'));
        if (!confirm) event.stopImmediatePropagation();
      }
    };

    console.log(changed, menuRef);

    menuRef?.current?.addEventListener('click', listener);

    return () => {
      menuRef?.current?.removeEventListener('click', listener);
    };
  }, [menuRef, changed]);

  return {
    setChanged: (value) => {
      console.log(value);
      setChanged(value);
    },
  };
};
