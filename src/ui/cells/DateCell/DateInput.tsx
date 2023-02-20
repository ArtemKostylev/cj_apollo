import {memo, useCallback, useMemo} from 'react';
import moment from 'moment';
import {getCurrentAcademicMonth} from '../../../utils/academicDate';
import {UpdateDatesProps} from '../../../Pages/UserPages/ConsultsPage/ConsultController';
import {DATE_FORMAT} from '../../../constants/date';
import {DateCell} from './index';

export const DateInput = memo(({value, onChange, disabled, error, options}: TableItemProps) => {
  const year = options?.year || moment().year();
  const month = useMemo(() => getCurrentAcademicMonth(), []);
  const updateDates: (props: UpdateDatesProps) => void = useCallback(({date}) => {
    onChange(date.format(DATE_FORMAT));
  }, [onChange])

  return <DateCell initialValue={value} updateDates={updateDates} month={month} year={year} unlimited disabled={disabled} error={error}/>
})