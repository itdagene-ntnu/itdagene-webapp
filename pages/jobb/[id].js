//@flow

import React from 'react';
import withData, { type WithDataProps } from '../../lib/withData';

import { graphql } from 'react-relay';
import { type Id_jobbannonse_QueryResponse } from './__generated__/Id_jobbannonse_Query.graphql';

import Layout from '../../components/Layout';
import JoblistingView from '../../components/Joblistings/JoblistingView';

type RenderProps = WithDataProps<Id_jobbannonse_QueryResponse>;

const Index = ({ error, props }: RenderProps) => (
  <Layout
    responsive
    {...{ error, props }}
    customOpengraphMetadata={({ props }) =>
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

export default withData(Index, {
  query: graphql`
    query Id_jobbannonse_Query($id: ID!) {
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
