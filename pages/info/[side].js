//@flow
import React from 'react';
import {
  withDataAndLayout,
  type WithDataAndLayoutProps
} from '../../lib/withData';
import Navbar from '../../components/Navbar';
import ServerError from '../../lib/ServerError';
import styled from 'styled-components';

import { graphql } from 'react-relay';
import { type Side_info_QueryResponse } from './__generated__/Side_info_Query.graphql';

import PageView from '../../components/PageView';

type RenderProps = WithDataAndLayoutProps<Side_info_QueryResponse>;

const StyledHeading = styled('h1')`
  font-weight: 200;
  font-size: 4em;
  margin: 0;
`;

const StyledPageView = styled('div')`
  margin-left: 0;
`;

const Index = ({ props }: RenderProps) => {
  const { page, pages } = props;
  const navitems = pages
    ? pages.map(
        page =>
          page && {
            text: page.title || '',
            href: '/info/[side]',
            as: `/info/${page.slug}`,
            key: page.id
          }
      )
    : [];
  return (
    <>
      <StyledHeading>INFO</StyledHeading>
      <Navbar items={navitems} />
      {page ? (
        <StyledPageView>
          <PageView page={page} />
        </StyledPageView>
      ) : (
        <ServerError statusCode={404} errorCode="ENOENT" />
      )}
    </>
  );
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
    metadata: props && props.page
  })
});
