import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import { StandsDefault_currentMetaData } from '../../__generated__/StandsDefault_currentMetaData.graphql';
import Countdown from '../Countdown';
import { CenterIt, PaddedDivider, SubHeader } from '../Styled';
import { Header } from './FeaturedEvents';
import ProgramButton from './ProgramButton';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: stretch;
`;

const Div2 = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;
`;

const Div3 = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: space-between;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

interface StandsDefaultProps {
  currentMetaData: StandsDefault_currentMetaData;
}

const StandsDefault = ({
  currentMetaData,
}: StandsDefaultProps): JSX.Element => {
  return (
    <CountDownContainer>
      <Div>
        <InfoContainer>
          <Div2>
            <Header>itDAGENE-stands åpner snart</Header>
          </Div2>
          <SubHeader>
            Ta en titt på programmet mens du venter i spenning!
          </SubHeader>
        </InfoContainer>
        <ProgramButton />
      </Div>
      <PaddedDivider />
      <Div3>
        <DivItem>
          <Countdown currentMetaData={currentMetaData} />
        </DivItem>
      </Div3>
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
