import {SelectCell} from '../../cells/SelectCell';
import {DateInput} from '../../cells/DateCell';
import {InputCell} from '../../cells/InputCell';
import {MemoExoticComponent} from 'react';
import {ClassView} from '../../cells/ClassView';
import {NameHeader} from '../NameHeader';

export const componentMap: Record<AttrType, MemoExoticComponent<(props: TableItemProps) => JSX.Element>> = {
  [AttrType.NAME]: SelectCell,
  [AttrType.CLASS]: ClassView,
  [AttrType.ID]: ClassView,
  [AttrType.STRING]: InputCell,
  [AttrType.NUMBER]: InputCell,
  [AttrType.SELECT]: SelectCell,
  [AttrType.DATE]: DateInput
}

export const headerMap: Record<string, (props: HeaderProps) => JSX.Element> = {
  [AttrType.NAME]: NameHeader,
}