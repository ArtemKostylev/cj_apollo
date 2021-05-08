import React, { useEffect } from "react";
import { QUATERS } from "./constants";

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
