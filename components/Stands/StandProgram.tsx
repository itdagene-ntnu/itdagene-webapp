import React from 'react';
import styled from 'styled-components';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

const StyledH1 = styled.h1`
  font-style: italic;
  font-weight: 100;
`;

// type Props = {
//   stand: StandProgram_stand$key;
// };

/*
 * Stands pages are not used anymore, this component lead to errors with
 * the new program page and is therefore removed for simplicity of development.
 */
const StandProgram = (): JSX.Element => {
  // const program = useFragment(
  //   graphql`
  //     fragment StandProgram_stand on Stand {
  //       events {
  //         ...ProgramView_events
  //       }
  //       currentMetaData {
  //         ...ProgramView_currentMetaData
  //       }
  //     }
  //   `,
  //   props.stand
  // );

  // return program ? (
  //   program.events && program.events.length > 0 ? (
  //     <ProgramView
  //       events={program.events}
  //       currentMetaData={program.currentMetaData}
  //     />
  //   ) : (
  //     <Flex justifyContent="center" style={{ alignItems: 'center' }}>
  //       <FlexItem>
  //         <StyledH1>Programmet er tomt</StyledH1>
  //       </FlexItem>
  //     </Flex>
  //   )
  // ) : (
  //   <Loading />
  // );
  return (
    <Flex justifyContent="center" style={{ alignItems: 'center' }}>
      <FlexItem>
        <StyledH1>Programmet er ikke støttet.</StyledH1>
      </FlexItem>
    </Flex>
  );
};

export default StandProgram;
