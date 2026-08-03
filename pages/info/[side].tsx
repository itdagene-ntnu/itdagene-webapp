import React from 'react';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import Navbar from '../../components/Navbar';
import styled from 'styled-components';

import { graphql } from 'react-relay';
import {
  Side_info_Query,
  Side_info_QueryResponse,
} from '../../__generated__/Side_info_Query.graphql';

import PageView from '../../components/PageView';
import { PublicErrorContent } from '../../components/PublicErrorPage';
import { PageContext } from '../../utils/types';
import { setNotFoundWhenFieldIsNull } from '../../utils/httpStatus';

type RenderProps = WithDataAndLayoutProps<Side_info_QueryResponse>;

type Page = NonNullable<
  NonNullable<NonNullable<Side_info_QueryResponse>['pages']>[0]
>;

const StyledPageView = styled('div')`
  margin-left: 0;
`;

const Index = ({ props }: RenderProps): JSX.Element => {
  const { page, pages } = props;
  const navitems = pages
    ? pages
        // GraphQL says page can be `null` so we have to manually filter out null
        // and inform TS that `page` is not null.
        .filter((page): page is Page => page !== null)
        .map((page) => ({
          text: page.title || '',
          href: '/info/[side]',
          as: `/info/${page.slug}`,
          key: page.id,
        }))
    : [];
  return (
    <>
      <Navbar items={navitems} />
      {page ? (
        <StyledPageView>
          <PageView page={page} />
        </StyledPageView>
      ) : (
        <PublicErrorContent
          description="Lenken kan være utdatert, eller siden kan ha fått en ny adresse."
          statusCode={404}
          title="Vi finner ikke siden."
        />
      )}
    </>
  );
};

Index.getInitialProps = ({
  res,
  queryProps,
}: PageContext<Side_info_Query>): Record<string, never> => {
  setNotFoundWhenFieldIsNull({
    response: res,
    queryProps,
    field: 'page',
  });
  return {};
};

export default withDataAndLayout(Index, {
  query: graphql`
    query Side_info_Query($side: String!) {
      pages(infopage: true) {
        title
        slug
        id
      }
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
    metadata: props && props.page,
  }),
});
