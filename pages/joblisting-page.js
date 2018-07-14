//@flow

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import React from 'react';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import { type joblistingPage_QueryResponse } from './__generated__/joblistingPage_Query.graphql';

import Layout from '../components/Layout';
import JoblistingView from '../components/Joblistings/JoblistingView';

type RenderProps = {
  error: ?Error,
  props: ?joblistingPage_QueryResponse
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
          contentRenderer={() =>
            props &&
            props.joblisting && <JoblistingView joblisting={props.joblisting} />
          }
        />
      );
    }}
  />
);
export default withData(Index, ({ query: { id } }) => ({
  query: graphql`
    query joblistingPage_Query($id: ID!) {
      joblisting: node(id: $id) {
        ... on Joblisting {
          ...JoblistingView_joblisting
        }
      }
    }
  `,
  variables: { id }
}));
