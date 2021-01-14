import React from 'react';
import styled from 'styled-components';
import Loading from '../LoadingIndicator';
import { graphql, useFragment } from 'relay-hooks';
import { StandProgram_stand$key } from '../../__generated__/StandProgram_stand.graphql';
import Flex, { FlexItem } from 'styled-flex-component';
import Program from '../Program/ProgramView';

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
      <Program events={program.events} />
    ) : (
      <Flex center>
        <FlexItem>
          <StyledH1>Programmet er tomt</StyledH1>
        </FlexItem>
      </Flex>
    )
  ) : (
    <Loading />
  );
};

export default StandProgram;
