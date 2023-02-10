import {DocumentNode} from 'graphql';
import {ReactiveVar} from '@apollo/client';


export enum TableControlType {
  BUTTON = 'BUTTON',
  SELECT = 'SELECT',
  REMOTE_SELECT = 'REMOTE_SELECT',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  PERIOD = 'PERIOD',
  REMOTE_SELECT = "REMOTE_SELECT"
}

export interface SelectConfig {
  optionsQuery?: DocumentNode;
  optionsVariables?: Record<string, any>;
  options?: Map<string | number, DropdownOptionType>;
  initialValue?: string | number;
  customVar?: ReactiveVar<any>;
  name: string;
}

export interface ButtonConfig {
  onClick: () => void;
  label: string;
}

export type TableControlsConfig = ({ type: TableControlType } & (ButtonConfig | SelectConfig))[]
export type SelectControlCreator<T> = (reactiveVar: ReactiveVar<T>, optionsQuery?: DocumentNode, optionsVariables?: Record<string, any>, options?: Map<string | number, DropdownOptionType>) => () => JSX.Element;
export type ButtonControlCreator = (onClick: () => void, label: string) => () => JSX.Element;
