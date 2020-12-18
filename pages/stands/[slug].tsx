import React from 'react';
import withData, { WithDataProps } from '../../lib/withData';

import { graphql } from 'react-relay';
import { Slug_stand_QueryResponse } from '../../__generated__/Slug_stand_Query.graphql';

import Layout, { Metadata } from '../../components/Layout';
import ServerError from '../../lib/ServerError';
import StandView from '../../components/Stands/StandView';

type RenderProps = WithDataProps<Slug_stand_QueryResponse>;

const Index = ({ error, props }: RenderProps): JSX.Element => (
  <Layout
    responsive
    {...{ error, props }}
    customOpengraphMetadata={({ props }): Metadata =>
      props.stand
        ? {
            ...props.stand,
            title: props.stand.company
              ? `itDAGENE stand  - ${props.stand.company.name}`
              : props.stand.slug,
            description:
              props.stand.company && `${props.stand.company.description || ''}`,
          }
        : null
    }
    contentRenderer={({ props }): JSX.Element =>
      props.stand ? (
        <StandView stand={props.stand} />
      ) : (
        <ServerError
          errorCode="ENOENT"
          statusCode={404}
          title="Fant ikke standen"
        />
      )
    }
  />
);

export default withData(Index, {
  query: graphql`
    query Slug_stand_Query($slug: String!) {
      stand: stand(slug: $slug) {
        ...StandView_stand
        slug
        description
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
