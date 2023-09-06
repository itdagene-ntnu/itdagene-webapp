import { useEffect, useState } from 'react';
import Countdown from 'react-countdown-now';
import { createFragmentContainer, graphql } from 'react-relay';
import { Countdown_currentMetaData } from '../../__generated__/Countdown_currentMetaData.graphql';
import dayjs from 'dayjs';
import styled from 'styled-components';
import {
  blueNCS,
  princetonOrange,
  skyBlue,
  indigoDye,
} from '../../utils/colors';
import Flex from '../Styled/Flex';

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

const CountDownComponent = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: RendererProps) => {
  const [staticDate, setStaticDate] = useState(true);
  useEffect(() => {
    setStaticDate(false);
  }, []);
  return (
    <Flex
      flexWrap="wrap"
      justifyContent="center"
      style={{ alignItems: 'center' }}
    >
      <NumberBox color={blueNCS}>
        <Number>{days}</Number> <Text> dager </Text>
      </NumberBox>
      <NumberBox color={princetonOrange}>
        <Number>{hours}</Number> <Text> timer </Text>
      </NumberBox>
      <NumberBox color={skyBlue}>
        <Number>{minutes}</Number> <Text> minutter </Text>
      </NumberBox>
      <NumberBox color={indigoDye}>
        <Number>{staticDate ? 0 : seconds}</Number> <Text> sekunder </Text>
      </NumberBox>
    </Flex>
  );
};

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: RendererProps): JSX.Element | boolean =>
  !completed && (
    <CountDownComponent
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      completed={completed}
    />
  );

const CountdownComponent = (props: {
  currentMetaData: Countdown_currentMetaData;
}): JSX.Element => (
  <Countdown
    date={dayjs(props.currentMetaData.startDate)
      .add(10, 'hour')
      .add(0, 'minute')
      .toDate()}
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
