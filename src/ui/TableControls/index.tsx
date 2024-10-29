import { ControlButtonProps, ControlButton } from './ControlButton';
import { ControlSelectProps, ControlSelect } from './ControlSelect';
import styled from 'styled-components';
import omit from 'lodash/omit';
import { theme } from '../../styles/theme';

export enum TableControlType {
  BUTTON,
  SELECT,
}

export type TableControlsConfig = ({ type: TableControlType } & (
  | ControlButtonProps
  | ControlSelectProps
))[];

type Props = {
  config: TableControlsConfig;
};

const ComponentMap = {
  [TableControlType.BUTTON]: ControlButton,
  [TableControlType.SELECT]: ControlSelect,
};

const ControlsContainer = styled.div`
  width: 100%;
  line-height: 40px;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-bottom: 1px solid ${theme.border};
`;

export const TableControls = ({ config }: Props) => (
  <ControlsContainer>
    {config.map((it, index) => {
      const Component = ComponentMap[it.type];
      return <Component key={index} {...omit(it, 'type')} />;
    })}
  </ControlsContainer>
);
