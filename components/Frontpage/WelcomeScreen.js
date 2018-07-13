//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WelcomeScreen_currentMetaData } from './__generated__/WelcomeScreen_currentMetaData.graphql';
import { Container, Header, Button } from 'semantic-ui-react';
import styled from 'styled-components';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData
};

const MainContainer = styled(Container)`
  padding-top: 160px;
  padding-bottom: 170px;
  color: white;
`;

const WelcomeScreen = ({ currentMetaData }: Props) => (
  <MainContainer inverted text textAlign="center">
    <Header as="h1" size="huge" inverted>
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
