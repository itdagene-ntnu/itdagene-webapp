import React from 'react';
import styled from 'styled-components';

interface LiveProps {
  active: boolean;
}
const LiveIndicator: React.FC<LiveProps> = ({ active }): JSX.Element => (
  <LiveContainer active={active}>LIVE</LiveContainer>
);

const LiveContainer = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  flex: 0 0 50px;
  height: 25px;
  padding: 4px;
  border-radius: 3px;
  text-align: center;
  stroke: 2px;
  border: 1px solid
    ${(props): 'red' | 'grey' => (props.active ? 'red' : 'grey')};
  color: ${(props): 'red' | 'grey' => (props.active ? 'red' : 'grey')};
  text-decoration: ${(props): 'none' | 'line-through' =>
    props.active ? 'none' : 'line-through'};
`;

export default LiveIndicator;
