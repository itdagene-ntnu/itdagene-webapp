//@flow
import { useEffect } from 'react';
import Router from 'next/router';
import { graphql, type Variables } from 'react-relay';
import type { NextRouter } from '../utils/types';
import { withData } from '../lib/withData';

// In order to keep backward compatibility urls like /jobbannonse?id=zyx

// For client redirects
const Redirect = () => {
  useEffect(() => {
    Router.replace('/jobb');
  }, []);
  return null;
};

// For SSR redirects
Redirect.getInitialProps = async ({ res, queryProps }) => {
  if (!res) {
    return;
  }
  res.writeHead(301, { Location: `/jobb/${queryProps.node.slug}` }), res.end();
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
  variables: ({ query: { id } }: NextRouter): Variables => ({ id })
});
