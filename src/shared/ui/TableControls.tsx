import React from 'react';
import {ButtonProps, Button} from './formItems/Button';
import {SelectProps, Select} from './formItems/Select';
import styled from 'styled-components';
import omit from 'lodash/omit';
import {theme} from '../../styles/theme';

export enum TableControlType {
  BUTTON,
  SELECT
}

export type TableControlsConfig = ({ type: TableControlType } & (ButtonProps | SelectProps))[]

type Props = {
  config: TableControlsConfig
}

const ComponentMap = {
  [TableControlType.BUTTON]: <Button/>,
  [TableControlType.SELECT]: <Select/>
}

const ControlsContainer = styled.div`
  width: 100%;
  line-height: 40px;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-bottom: 1px solid ${theme.border};
`

export const TableControls = ({config}: Props) => (
  <ControlsContainer>
    {config.map(it => React.cloneElement(ComponentMap[it.type], {...omit(it, 'type'), key: it.text}))}
  </ControlsContainer>
)