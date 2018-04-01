//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WelcomeScreen_currentMetaData } from './__generated__/WelcomeScreen_currentMetaData.graphql';
import { Container, Header, Button } from 'semantic-ui-react';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData
};
const WelcomeScreen = ({ currentMetaData }: Props) => (
  <Container text textAlign="center">
    <Header as="h1" size="huge" inverted style={{ marginTop: 192 }}>
      itDAGENE {currentMetaData.year}
    </Header>
    <h2>
      {currentMetaData.startDate} - {currentMetaData.endDate}
    </h2>
    <Button secondary>
      Les mer <i className="right arrow icon" />
    </Button>
  </Container>
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
