import React from 'react';
import withData, { WithDataProps } from '../../lib/withData';

import { graphql } from 'react-relay';
import {
  Slug_jobbannonse_Query,
  Slug_jobbannonse_QueryResponse,
} from '../../__generated__/Slug_jobbannonse_Query.graphql';

import Layout, { Metadata } from '../../components/Layout';
import JoblistingView from '../../components/Joblistings/JoblistingView';
import { PublicErrorContent } from '../../components/PublicErrorPage';
import { PageContext } from '../../utils/types';
import { setNotFoundWhenFieldIsNull } from '../../utils/httpStatus';

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
        <PublicErrorContent
          description="Annonsen kan være utløpt, eller lenken kan være utdatert."
          statusCode={404}
          title="Fant ikke jobbannonsen"
        />
      )
    }
  />
);

Index.getInitialProps = ({
  res,
  queryProps,
}: PageContext<Slug_jobbannonse_Query>): Record<string, never> => {
  setNotFoundWhenFieldIsNull({
    response: res,
    queryProps,
    field: 'joblisting',
  });
  return {};
};

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
