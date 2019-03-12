import React from 'react';
import Countdown from 'react-countdown-now';
import { createFragmentContainer, graphql } from 'react-relay';
import type { Countdown_currentMetaData } from './__generated__/Countdown_currentMetaData.graphql';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Flex from 'styled-flex-component';

const NumberBox = styled('div')`
  position: relative;
  border-radius: 100%;
  line-height: 1;
  letter-spacing: 2px;
  flex: 1;
  vertical-align: middle;
  width: 135px;
  height: 125px;
  text-transform: uppercase;
  font-size: 12px;
  background: #037bb4;
  margin: 5px;
  flex-basis: 135px;
`;

const Number = styled('div')`
  margin-top: 25px;
  font-size: 52px;
`;

const Text = styled('span')`
  line-height: 2;
`;

const renderer = ({ days, hours, minutes, seconds, completed }) =>
  !completed && (
    <Flex center wrap>
      <NumberBox>
        <Number>{days}</Number> <Text> dager </Text>
      </NumberBox>
      <NumberBox>
        <Number>{hours}</Number> <Text> timer </Text>
      </NumberBox>
      <NumberBox>
        <Number>{minutes}</Number> <Text> minutter </Text>
      </NumberBox>
      <NumberBox>
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
