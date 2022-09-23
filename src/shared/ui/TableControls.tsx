import React from 'react';
import {ButtonProps, Button} from './formItems/Button';
import {SelectProps, Select} from './formItems/Select';
import styled from 'styled-components';
import omit from 'lodash/omit';

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
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const TableControls = ({config}: Props) => (
  <ControlsContainer>
    {config.map(it => React.cloneElement(ComponentMap[it.type], omit(it, 'type')))}
  </ControlsContainer>
)