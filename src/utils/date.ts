import {QUARTERS} from '../constants/quarters';
import moment from "moment";

export function getQuarter(month: number) {
  let quarter = null;
  QUARTERS.forEach((item, index) => {
    if (item.includes(month)) quarter = index;
  });

  return quarter === null ? 3 : quarter;
}