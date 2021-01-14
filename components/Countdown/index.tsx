import React from 'react';
import Countdown from 'react-countdown-now';
import { createFragmentContainer, graphql } from 'react-relay';
import { Countdown_currentMetaData } from '../../__generated__/Countdown_currentMetaData.graphql';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import {
  itdageneLightBlue,
  itdageneGreen,
  itdageneRed,
  itdageneYellow,
} from '../../utils/colors';

const NumberBox = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  letter-spacing: 2px;
  flex: 1;
  vertical-align: middle;
  width: 135px;
  height: 125px;
  text-transform: uppercase;
  font-size: 12px;
  background: ${(props): any => props.color};
  margin: 5px;
  flex-basis: 135px;
  color: white;
`;

const Number = styled('div')`
  margin-top: 25px;
  font-size: 52px;
  font-weight: bold;
`;

const Text = styled('span')`
  font-weight: bold;
  line-height: 2;
`;

type RendererProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: RendererProps): JSX.Element | boolean =>
  !completed && (
    <Flex center wrap>
      <NumberBox color={itdageneGreen}>
        <Number>{days}</Number> <Text> dager </Text>
      </NumberBox>
      <NumberBox color={itdageneRed}>
        <Number>{hours}</Number> <Text> timer </Text>
      </NumberBox>
      <NumberBox color={itdageneLightBlue}>
        <Number>{minutes}</Number> <Text> minutter </Text>
      </NumberBox>
      <NumberBox color={itdageneYellow}>
        <Number>{seconds}</Number> <Text> sekunder </Text>
      </NumberBox>
    </Flex>
  );

const CountdownComponent = (props: {
  currentMetaData: Countdown_currentMetaData;
}): JSX.Element => (
  <Countdown
    date={dayjs(props.currentMetaData.startDate).add(10, 'hour').toDate()}
    renderer={renderer}
  />
);

export default createFragmentContainer(CountdownComponent, {
  currentMetaData: graphql`
    fragment Countdown_currentMetaData on MetaData {
      startDate
    }
  `,
});
