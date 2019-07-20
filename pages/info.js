//@flow
import React from 'react';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import { type page_QueryResponse } from './__generated__/jobbannonse_Query.graphql';

import Layout from '../components/Layout';
import PageView from '../components/PageView';

type RenderProps = WithDataProps<page_QueryResponse>;

const Index = ({ props, error }: RenderProps) => (
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
