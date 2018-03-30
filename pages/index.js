//@flow
import React, { Fragment } from 'react';
import {
  QueryRenderer,
  graphql,
  type Environment,
  type GraphQLTaggedNode
} from 'react-relay';
import withData from '../lib/withData';
import Link from 'next/link';
import Year from '../components/Year';
import Header from '../components/Header';

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: {
  variables: Object,
  environment: Environment,
  query: GraphQLTaggedNode,
  queryProps: ?any
}) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({ error, props }) => {
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
            <img alt="itDAGENE logo" src="/static/itdagene_logo.png " />
            <Link href="/">
              <a> Back </a>
            </Link>
            <h1>
              <Year currentMetaData={(props: any).currentMetaData} />
            </h1>
          </div>
        </Fragment>
      );
    }}
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
