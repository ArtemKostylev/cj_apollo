import {ButtonControlCreator} from '../types';
import {Button} from '../../Button';

export const createButtonControl: ButtonControlCreator = (onClick, label) => {
  return () => <Button onClick={onClick}>{label}</Button>;
}