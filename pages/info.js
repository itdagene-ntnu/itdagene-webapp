//@flow
import React from 'react';
import {
  withDataAndLayout,
  type WithDataAndLayoutProps
} from '../lib/withData';

import { graphql } from 'react-relay';
import { type page_QueryResponse } from './__generated__/jobbannonse_Query.graphql';

import PageView from '../components/PageView';

type RenderProps = WithDataAndLayoutProps<page_QueryResponse>;

const Index = ({ props }: RenderProps) => (
  <>
    {props.page ? (
      <PageView page={props.page} />
    ) : (
      <>
        <h1>Finner ikke siden :( </h1>
        <h2>404 Errr</h2>
      </>
    )}
  </>
);

export default withDataAndLayout(Index, {
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
  variables: ({ query: { side = '' } }) => ({ side }),
  layout: ({ props, error }) => ({
    responsive: true,
    shouldCenter: !!props && !props.page,
    metadata: props && props.page
  })
});
