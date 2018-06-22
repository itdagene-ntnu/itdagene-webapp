//@flow
import React, { Fragment } from 'react';
import { Container, Header, Segment, Loader } from 'semantic-ui-react';
import { HeaderMenu } from '../Header';
import { itdageneBlue } from '../../utils/colors';

const LoadingIndicator = () => (
  <Fragment>
    <Segment style={{ background: itdageneBlue }} vertical>
      <Container>
        <HeaderMenu />
      </Container>
    </Segment>
    <div style={{ paddingTop: 150 }}>
      <Loader size="huge" active inline="centered">
        <Header className="teal">Laster inn</Header>
      </Loader>
    </div>
  </Fragment>
);
export default LoadingIndicator;
