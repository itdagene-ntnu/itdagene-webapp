//@flow
import React from 'react';
import { Header, Loader } from 'semantic-ui-react';

const LoadingIndicator = () => (
  <div style={{ paddingTop: 150 }}>
    <Loader size="huge" active inline="centered">
      <Header className="teal">Laster inn</Header>
    </Loader>
  </div>
);
export default LoadingIndicator;
