//@flow
import React, { Component, Fragment } from 'react';
import { QueryRenderer, createRefetchContainer, graphql } from 'react-relay';
import withData from '../lib/withData';
import Link from 'next/link';
import Year from '../components/Year';
import Header from '../components/Header';

import { type Page_QueryResponse } from './__generated__/Page_Query.graphql';

const Index = ({ variables, query, environment, queryProps }) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({
      error,
      props
    }: {
      props: ?Page_QueryResponse,
      error: ?Error
    }) => {
      if (error) return <div>Error</div>;

      if (!props) return <div> Laster </div>;

      return (
        <Fragment>
          <Header />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <img src="/static/itdagene_logo.png " />
            <Link href="/">
              <a> Back </a>
            </Link>
            Stand count {props.currentMetaData.nrOfStands}
            <h1>
              <Year currentMetaData={props.currentMetaData} />
            </h1>
          </div>
        </Fragment>
      );
    }}
  />
);

export default withData(Index, {
  query: graphql`
    query Page_Query {
      currentMetaData {
        ...Year_currentMetaData
        id
        nrOfStands
        year
      }
    }
  `,
  variables: {}
});
