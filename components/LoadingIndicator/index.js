//@flow
import React, { Fragment } from 'react';
import type { NextUrl } from '../../utils/types';
import { Container, Header, Segment, Loader } from 'semantic-ui-react';
import { HeaderMenu } from '../Header';
import { itdageneBlue } from '../../utils/colors';

type Props = {
  url: NextUrl
};

const LoadingIndicator = ({ url }: Props) => (
  <Fragment>
    <Segment style={{ background: itdageneBlue }} vertical>
      <Container>
        <HeaderMenu url={url} />
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
