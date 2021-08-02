import { useEffect } from "react";
import { adminItems, userItems, subRoute } from "./constants";
import { QUATERS } from "./constants";
import moment from "moment";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function getQuater(month) {
  let quater = null;
  QUATERS.forEach((item, index) => {
    if (item.includes(month)) quater = index;
  });

  return !quater ? 3 : quater;
}

export function getHeaderFromRoute(pathname) {
  const compare = (item) => {
    return item.path === pathname;
  };
  const route =
    userItems.find((item) => compare(item)) ||
    adminItems.find((item) => compare(item)) ||
    subRoute.path === pathname;
  return route.title?.toUpperCase() || "КЛАССНЫЙ ЖУРНАЛ";
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
