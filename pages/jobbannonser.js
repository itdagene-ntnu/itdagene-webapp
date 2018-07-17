//@flow

import React from 'react';
import JoblistingsContainer, {
  query
} from '../components/Joblistings/JoblistingsContainer';
import type { JoblistingsContainer_root } from '../components/Joblistings/__generated__/JoblistingsContainer_root.graphql';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import Layout from '../components/Layout';

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
      return (
        <Layout
          responsive
          {...{ error, props }}
          contentRenderer={({ props }) => <JoblistingsContainer root={props} />}
        />
      );
    }}
  />
);

export default withData(Index, router => ({
  query,
  variables: {
    type: router.query.type || '',
    fromYear: parseInt(router.query.fromYear, 10) || 1,
    toYear: parseInt(router.query.toYear, 10) || 5,
    company: router.query.company || '',
    count: 15
  }
}));
