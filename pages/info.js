//@flow
import React from 'react';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import { type page_QueryResponse } from './__generated__/jobbannonse_Query.graphql';

import Layout from '../components/Layout';
import PageView from '../components/PageView';

type RenderProps = {
  error: ?Error,
  props: ?page_QueryResponse
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
          shouldCenter={!!props && !props.page}
          {...{ error, props }}
          metadata={props && props.page}
          contentRenderer={({ props }) =>
            props.page ? (
              <PageView page={props.page} />
            ) : (
              <>
                <h1>Finner ikke siden :( </h1>
                <h2>404 Errr</h2>
              </>
            )
          }
        />
      );
    }}
  />
);
export default withData(Index, {
  query: graphql`
    query info_Query($side: String!) {
      page(slug: $side) {
        ... on Page {
          ...PageView_page
          ...metadata_metadata
        }
      }
    }
  `,
  variables: ({ query: { side = '' } }) => ({ side })
});
