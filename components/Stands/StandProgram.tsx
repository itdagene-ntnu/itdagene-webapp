import React from 'react';
import styled from 'styled-components';
import Loading from '../LoadingIndicator';
import { graphql, useFragment } from 'relay-hooks';
import { StandProgram_stand$key } from '../../__generated__/StandProgram_stand.graphql';
import ProgramView from '../Program/ProgramView';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: center;
  justify-content: center;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

const StyledH1 = styled.h1`
  font-style: italic;
  font-weight: 100;
`;

type Props = {
  stand: StandProgram_stand$key;
};

const StandProgram = (props: Props): JSX.Element => {
  const program = useFragment(
    graphql`
      fragment StandProgram_stand on Stand {
        events {
          ...ProgramView_events
        }
      }
    `,
    props.stand
  );

  return program ? (
    program.events && program.events.length > 0 ? (
      <ProgramView events={program.events} stands={null} />
    ) : (
      <Div>
        <DivItem>
          <StyledH1>Programmet er tomt</StyledH1>
        </DivItem>
      </Div>
    )
  ) : (
    <Loading />
  );
};

export default StandProgram;
