import { useEffect } from 'react';
import Router from 'next/router';
import { graphql, Variables } from 'react-relay';
import { NextRouter } from '../utils/types';
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
  res.writeHead(301, {
    Location: queryProps.node ? `/jobb/${queryProps.node.slug}` : '/jobb',
  }),
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
