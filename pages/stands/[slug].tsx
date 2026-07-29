import React from 'react';
import withData, { WithDataProps } from '../../lib/withData';

import { graphql } from 'react-relay';
import {
  Slug_stand_Query,
  Slug_stand_QueryResponse,
} from '../../__generated__/Slug_stand_Query.graphql';

import Layout, { Metadata } from '../../components/Layout';
import StandView from '../../components/Stands/StandView';
import { PublicErrorContent } from '../../components/PublicErrorPage';
import { PageContext } from '../../utils/types';
import { setNotFoundWhenFieldIsNull } from '../../utils/httpStatus';

type RenderProps = WithDataProps<Slug_stand_QueryResponse>;

const Index = ({ error, props }: RenderProps): JSX.Element => (
  <Layout
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
        <PublicErrorContent
          description="Standen kan være fjernet, eller lenken kan være utdatert."
          statusCode={404}
          title="Fant ikke standen"
        />
      )
    }
  />
);

Index.getInitialProps = ({
  res,
  queryProps,
}: PageContext<Slug_stand_Query>): Record<string, never> => {
  setNotFoundWhenFieldIsNull({
    response: res,
    queryProps,
    field: 'stand',
  });
  return {};
};

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
