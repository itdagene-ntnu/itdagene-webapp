import React from 'react';
import withData, { WithDataProps } from '../../lib/withData';

import { graphql } from 'react-relay';
import { Slug_jobbannonse_QueryResponse } from '../../__generated__/Slug_jobbannonse_Query.graphql';

import Layout, { Metadata } from '../../components/Layout';
import ServerError from '../../lib/ServerError';
import JoblistingView from '../../components/Joblistings/JoblistingView';

type RenderProps = WithDataProps<Slug_jobbannonse_QueryResponse>;

const Index = ({ error, props }: RenderProps): JSX.Element => (
  <Layout
    responsive
    {...{ error, props }}
    customOpengraphMetadata={({ props }): Metadata =>
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
              `${props.joblisting.company.description || ''}`,
          }
        : null
    }
    contentRenderer={({ props }): JSX.Element =>
      props.joblisting ? (
        <JoblistingView joblisting={props.joblisting} />
      ) : (
        <ServerError
          errorCode="ENOENT"
          statusCode={404}
          title="Fant ikke jobbannonsen"
        />
      )
    }
  />
);

export default withData(Index, {
  query: graphql`
    query Slug_jobbannonse_Query($slug: String!) {
      joblisting: joblisting(slug: $slug) {
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
  `,
  variables: ({ query: { slug } }) => ({
    slug,
  }),
});
