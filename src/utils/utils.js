import { useEffect } from 'react';
import {
  ADMIN_RESOURCES,
  USER_RESOURCES,
  SUBGROUPS_RESOURCE,
} from '../constants/resources';
import { QUARTERS } from '../constants/quarters';
import moment from 'moment';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function getQuater(month) {
  let quater = null;
  QUARTERS.forEach((item, index) => {
    if (item.includes(month)) quater = index;
  });

  return !quater ? 3 : quater;
}

export function getHeaderFromRoute(pathname) {
  const compare = (item) => {
    return item.path === pathname;
  };
  const route =
    USER_RESOURCES.find((item) => compare(item)) ||
    ADMIN_RESOURCES.find((item) => compare(item)) ||
    SUBGROUPS_RESOURCE.path === pathname;
  return route.title?.toUpperCase() || 'КЛАССНЫЙ ЖУРНАЛ';
}

export function getYear(targetMonth, year = null) {
  const currentMonth = moment().month();
  const currentYear = year || moment().year();

  if (currentMonth <= 7) {
    if (targetMonth > 7) {
      return currentYear - 1;
    }
    return currentYear;
  }
  if (targetMonth > 7) {
    return currentYear;
  }
  return currentYear + 1;
}
export const compareStundents = (a, b) => {
  if (a.surname < b.surname) {
    return -1;
  }
  if (a.surname > b.surname) {
    return 1;
  }
  return 0;
};
