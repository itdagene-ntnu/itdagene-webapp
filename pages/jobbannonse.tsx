import * as React from 'react';
import { useEffect } from 'react';
import Router, { NextRouter } from 'next/router';
import { graphql, Variables } from 'react-relay';
import { withData } from '../lib/withData';
import { PageContext } from '../utils/types';
import { jobbannonseByIdQuery } from '../__generated__/jobbannonseByIdQuery.graphql';

// In order to keep backward compatibility urls like /jobbannonse?id=zyx

// For client redirects
const Redirect = (): JSX.Element => {
  useEffect(() => {
    Router.replace('/jobb');
  }, []);
  return <div></div>;
};

// For SSR redirects
Redirect.getInitialProps = async ({
  res,
  queryProps,
}: PageContext<jobbannonseByIdQuery>): Promise<void> => {
  if (!res) {
    return;
  }
  if (queryProps)
    res.writeHead(301, {
      Location: queryProps.node ? `/jobb/${queryProps.node.slug}` : '/jobb',
    });
  res.end();
};

export default withData(Redirect, {
  query: graphql`
    query jobbannonseByIdQuery($id: ID!) {
      node(id: $id) {
        ... on Joblisting {
          slug
        }
      }
    }
  `,
  variables: ({ query: { id } }: NextRouter): Variables => ({ id: id || '' }),
});
