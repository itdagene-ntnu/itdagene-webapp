import React from 'react';
import Countdown from 'react-countdown-now';
import { createFragmentContainer, graphql } from 'react-relay';
import type { Countdown_currentMetaData } from './__generated__/Countdown_currentMetaData.graphql';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Flex from 'styled-flex-component';

const NumberBox = styled('div')`
  position: relative;
  border-radius: 3px;
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

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return 'RIP';
  } else {
    // Render a countdown

    return (
      <Flex center wrap>
        <NumberBox>
          <Number>{days}</Number> dager
        </NumberBox>{' '}
        <NumberBox>
          <Number>{hours}</Number> timer
        </NumberBox>{' '}
        <NumberBox>
          <Number>{minutes}</Number> minutter
        </NumberBox>{' '}
        <NumberBox>
          <Number>{seconds}</Number> sekunder
        </NumberBox>{' '}
      </Flex>
    );
  }
};

const CountdownComponent = (props: Countdown_currentMetaData) => (
  <>
    <Countdown
      date={dayjs(props.currentMetaData.startDate)
        .add(9, 'hours')
        .toDate()}
      renderer={renderer}
    />
  </>
);

export default createFragmentContainer(
  CountdownComponent,
  graphql`
    fragment Countdown_currentMetaData on MetaData {
      startDate
    }
  `
);
