import React from 'react';
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
  width: 135px;
  height: 125px;
  background: ${(props): any => props.color};
  margin: 5px;
  flex-basis: 135px;
  opacity: 0.6;
`;

const CountdownSkeleton = (): JSX.Element => (
  <Flex
    flexWrap="wrap"
    justifyContent="center"
    style={{ alignItems: 'center', minHeight: '135px' }}
  >
    <NumberBox color={blueNCS} />
    <NumberBox color={princetonOrange} />
    <NumberBox color={skyBlue} />
    <NumberBox color={indigoDye} />
  </Flex>
);

export default CountdownSkeleton;
