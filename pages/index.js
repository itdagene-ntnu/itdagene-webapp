//@flow
import React, { Component, Fragment } from 'react';
import { QueryRenderer, createRefetchContainer, graphql } from 'react-relay';
import withData from '../lib/withData';
import Link from 'next/link';
import Year from '../components/Year';
import Header from '../components/Header';

import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';

const Index = (props: pages_index_QueryResponse) => (
  <Fragment>
    <Header />
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <img src="/static/itdagene_logo.png " />
      <h1>
        <Year currentMetaData={props.currentMetaData} />
      </h1>
    </div>
  </Fragment>
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
