import React from 'react';
import Loading from '../LoadingIndicator';
import { graphql, useFragment } from 'relay-hooks';
import { StandProgram_stand$key } from '../../__generated__/StandProgram_stand.graphql';
import Flex, { FlexItem } from 'styled-flex-component';

import Program from '../ProgramView';

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

  console.log(program);

  return program ? (
    program.events ? (
      <Program events={program.events} />
    ) : (
      <Flex>
        <FlexItem>
          <h1>Programmet er tomt</h1>
        </FlexItem>
      </Flex>
    )
  ) : (
    <Loading />
  );
};

export default StandProgram;
