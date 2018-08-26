//@flow

import React from 'react';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import { type jobbannonse_QueryResponse } from './__generated__/jobbannonse_Query.graphql';

import Layout from '../components/Layout';
import JoblistingView from '../components/Joblistings/JoblistingView';

type RenderProps = {
  error: ?Error,
  props: ?jobbannonse_QueryResponse
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
          opengraphMetadata={({ props }) =>
            props.joblisting
              ? {
                  ...props.joblisting,
                  title: props.joblisting.company
                    ? `${props.joblisting.title || ''} - ${
                        props.joblisting.company.name
                      }`
                    : props.joblisting.title,
                  description:
                    props.joblisting.company &&
                    `${props.joblisting.company.description || ''}`
                }
              : null
          }
          contentRenderer={({ props }) =>
            props.joblisting ? (
              <JoblistingView joblisting={props.joblisting} />
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
    query jobbannonse_Query($id: ID!) {
      joblisting: node(id: $id) {
        ... on Joblisting {
          ...JoblistingView_joblisting
          title
          description
          sharingImage
          company {
            description
            name
          }
        }
      }
    }
  `,
  variables: ({ query: { id } }) => ({
    id
  })
});
