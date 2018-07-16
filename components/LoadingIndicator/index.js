//@flow
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { itdageneBlue } from '../../utils/colors';

const Spinner = styled('div')`
  width: 60px;
  height: 60px;
  position: relative;
  margin: 35px auto;
`;

const bouncer = keyframes`

  {
    0%,
    100% {
      transform: scale(0);
    }

    50% {
      transform: scale(1);
    }
  }
 `;

const Bounce1 = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${itdageneBlue};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bouncer} 2s infinite ease-in-out;
`;

const Bounce2 = styled(Bounce1)`
  animation-delay: -1s;
`;

const LoadingIndicator = () => (
  <div style={{ paddingTop: 150 }}>
    <Spinner>
      <Bounce1 />
      <Bounce2 />
    </Spinner>
    <h2>Laster inn</h2>
  </div>
);
export default LoadingIndicator;
