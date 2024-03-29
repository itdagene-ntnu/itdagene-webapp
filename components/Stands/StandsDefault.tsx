import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import { StandsDefault_currentMetaData } from '../../__generated__/StandsDefault_currentMetaData.graphql';
import Countdown from '../Countdown';
import { CenterIt, PaddedDivider, SubHeader } from '../Styled';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';
import { Header } from './FeaturedEvents';
import ProgramButton from './ProgramButton';

interface StandsDefaultProps {
  currentMetaData: StandsDefault_currentMetaData;
}

const StandsDefault = ({
  currentMetaData,
}: StandsDefaultProps): JSX.Element => {
  return (
    <CountDownContainer>
      <Flex flexWrap="wrap" justifyContent="space-between">
        <InfoContainer>
          <Flex flexWrap="wrap">
            <Header>itDAGENE-stands åpner snart</Header>
          </Flex>
          <SubHeader>
            Ta en titt på programmet mens du venter i spenning!
          </SubHeader>
        </InfoContainer>
        <ProgramButton />
      </Flex>
      <PaddedDivider />
      <Flex flexDirection="column" alignContent="space-between">
        <FlexItem>
          <Countdown currentMetaData={currentMetaData} />
        </FlexItem>
      </Flex>
    </CountDownContainer>
  );
};

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;

  @media only screen and (max-width: 992px) {
    margin-bottom: 20px;
  }
`;

const CountDownContainer = styled(CenterIt)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  width: 100%;
  padding-bottom: 170px;
`;

export default createFragmentContainer(StandsDefault, {
  currentMetaData: graphql`
    fragment StandsDefault_currentMetaData on MetaData {
      ...Countdown_currentMetaData
    }
  `,
});
