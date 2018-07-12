//@flow

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import React from 'react';
import JoblistingsContainer, {
  query
} from '../components/Joblistings/JoblistingsContainer';
import type { JoblistingsContainer_root } from '../components/Joblistings/__generated__/JoblistingsContainer_root.graphql';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import LoadingIndicator from '../components/LoadingIndicator';

import { Container } from 'semantic-ui-react';
import { HeaderMenu } from '../components/Header';
import { itdageneBlue } from '../utils/colors';

type RenderProps = {
  error: ?Error,
  props: ?JoblistingsContainer_root
};
const Index = ({
  variables,
  query,
  environment,
  queryProps
}: WithDataProps) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({ error, props }: RenderProps) => {
      if (error) return <div>Error</div>;

      if (!props) return <LoadingIndicator />;

      return (
        <>
          <div
            style={{ background: itdageneBlue }}
            className="ui inverted vertical segment"
          >
            <Container>
              <HeaderMenu />
            </Container>
          </div>
          <Container
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            <JoblistingsContainer root={props} />
          </Container>
        </>
      );
    }}
  />
);

export default withData(Index, router => ({
  query,
  variables: {
    type: router.query.type || '',
    company: router.query.company || '',
    count: 5
  }
}));
