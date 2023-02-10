import { getCurrentAcademicMonth, getCurrentAcademicPeriod, getCurrentAcademicYear } from '../../utils/academicDate'
import { createButtonControl } from './controlCreators/createButtonControl'
import { createMonthControl } from './controlCreators/createMonthControl'
import { createPeriodControl } from './controlCreators/createPeriodControl'
import { createRemoteSelectControl } from './controlCreators/createRemoteSelectControl'
import { createSelectControl } from './controlCreators/createSelectControl'
import { createYearControl } from './controlCreators/createYearControl'
import { ButtonControlCreator, SelectControlCreator, TableControlType } from './types'

export const selectControlCreators: Record<string, SelectControlCreator<any>> = {
  [TableControlType.YEAR]: createYearControl,
  [TableControlType.MONTH]: createMonthControl,
  [TableControlType.PERIOD]: createPeriodControl,
  [TableControlType.REMOTE_SELECT]: createRemoteSelectControl,
  [TableControlType.SELECT]: createSelectControl
}

type NewType = ButtonControlCreator

export const buttonControlCreators: Record<string, NewType> = {
  [TableControlType.BUTTON]: createButtonControl
}

export const defaultInitialValues: Record<string, any> = {
  [TableControlType.YEAR]: getCurrentAcademicYear(),
  [TableControlType.MONTH]: getCurrentAcademicMonth(),
  [TableControlType.PERIOD]: getCurrentAcademicPeriod(),
  [TableControlType.SELECT]: undefined
}