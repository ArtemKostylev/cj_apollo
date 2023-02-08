import { ReactNode, memo } from 'react';
import { CalendarContainer } from 'react-datepicker';
import styled from 'styled-components';

interface ContainerProps {
  className: string;
  children: ReactNode;
};

const ContainerWrapper = styled.div`
  line-height: 1em;
`;

export const Container = memo(({ className, children }: ContainerProps) => (
  <ContainerWrapper>
    <CalendarContainer className={className}>{children}</CalendarContainer>
  </ContainerWrapper>
));
