//@flow
import React, { Component, Fragment } from 'react';
import { QueryRenderer, createRefetchContainer, graphql } from 'react-relay';
import withData from '../lib/withData';
import Link from 'next/link';
import Year from '../components/Year';
import Header from '../components/Header';

import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';

const Index = ({ variables, query, environment, currentMetaData }) => (
  <QueryRenderer
    query={query}
    environment={environment}
    variables={variables}
    render={({ error, props }: { props: pages_index_QueryResponse }) => (
      <Fragment>
        <Header />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Link prefetch href="/Page">
            <a> Fooo </a>
          </Link>
          <img src="/static/itdagene_logo.png " />
          <h1>
            <Year
              currentMetaData={
                (props && props.currentMetaData) || currentMetaData || {}
              }
            />
          </h1>
        </div>
      </Fragment>
    )}
  />
);

export default withData(Index, {
  query: graphql`
    query pages_index_Query {
      currentMetaData {
        ...Year_currentMetaData
        id
        year
      }
    }
  `,
  variables: {}
});
