//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WelcomeScreen_currentMetaData } from './__generated__/WelcomeScreen_currentMetaData.graphql';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { CenterIt } from '../Styled';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData
};

const MainContainer = styled(CenterIt)`
  padding-top: 160px;
  padding-bottom: 170px;
  color: white;
`;

const Header = styled('h1')`
  font-size: 4em !important;
  font-weight: normal;
`;

const WelcomeScreen = ({ currentMetaData }: Props) => (
  <MainContainer text>
    <Header>
      <b>it</b>DAGENE {currentMetaData.year}
    </Header>
    <h2>10. & 11. september 2018</h2>
    <h3>NTNU//Glassgården</h3>
    <Button secondary>
      Les mer <i className="right arrow icon" />
    </Button>
  </MainContainer>
);

export default createFragmentContainer(
  WelcomeScreen,
  graphql`
    fragment WelcomeScreen_currentMetaData on MetaData {
      year
      startDate
      endDate
    }
  `
);
