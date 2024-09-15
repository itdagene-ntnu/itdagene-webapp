import { ReactNode } from 'react';
import styled from 'styled-components';
import { blueNCS } from '../../../utils/colors';
import Flex from '../../Styled/Flex';

type TimelineProps = {
  children: ReactNode | ReactNode[];
};

export const Timeline = ({ children }: TimelineProps) => {
  return (
    <Flex flexDirection="column" style={{ padding: '0.5rem' }}>
      {children}
    </Flex>
  );
};

type TimelineItemProps = {
  children: ReactNode[];
  color?: string;
  prevColor?: string;
};

const TimelineSeparator = styled('div')`
  width: 2px;
  height: 40px;
  background-color: #bdbdbd;
`;

const TimelineDot = styled('div')`
  width: 12px;
  height: 12px;
  background-color: #bdbdbd;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

export const TimelineItem = ({
  children,
  color,
  prevColor,
}: TimelineItemProps) => {
  return (
    <>
      <Flex gap="1rem" alignItems="stretch">
        {children[0]}
        <Flex flexDirection="column" gap="0.5rem" alignItems="center">
          <TimelineSeparator
            style={{ backgroundColor: prevColor ?? '#BDBDBD', flexGrow: 1 }}
          />
          <TimelineDot style={{ backgroundColor: color ?? '#BDBDBD' }} />
          <TimelineSeparator
            style={{ backgroundColor: color ?? '#BDBDBD', flexGrow: 1 }}
          />
        </Flex>
        <div style={{ flexGrow: 1, padding: '0.5rem 0' }}>{children[1]}</div>
      </Flex>
    </>
  );
};
