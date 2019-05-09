import React from 'react';
import Countdown from 'react-countdown-now';
import { createFragmentContainer, graphql } from 'react-relay';
import type { Countdown_currentMetaData } from './__generated__/Countdown_currentMetaData.graphql';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import {
  itdageneLightBlue,
  itdageneGreen,
  itdageneRed,
  itdageneYellow
} from '../../utils/colors.js';

const NumberBox = styled('div')`
  position: relative;
  line-height: 1;
  letter-spacing: 2px;
  flex: 1;
  vertical-align: middle;
  width: 135px;
  height: 125px;
  text-transform: uppercase;
  font-size: 12px;
  background: ${props => props.color};
  margin: 5px;
  flex-basis: 135px;
`;

const Number = styled('div')`
  margin-top: 25px;
  font-size: 52px;
  font-weight: bold;
  3px 2px 3px rgba(255,255,255,.2)
`;

const Text = styled('span')`
  font-weight: bold;
  line-height: 2;
`;

const renderer = ({ days, hours, minutes, seconds, completed }) =>
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

const CountdownComponent = (props: Countdown_currentMetaData) => (
  <Countdown
    date={dayjs(props.currentMetaData.startDate)
      .add(10, 'hours')
      .toDate()}
    renderer={renderer}
  />
);

export default createFragmentContainer(
  CountdownComponent,
  graphql`
    fragment Countdown_currentMetaData on MetaData {
      startDate
    }
  `
);
