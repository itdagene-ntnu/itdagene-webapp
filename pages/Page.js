//@flow
import React, { Fragment } from 'react';
import {
  QueryRenderer,
  graphql,
  type Environment,
  type Variables,
  type GraphQLTaggedNode
} from 'react-relay';
import withData from '../lib/withData';
import Link from 'next/link';
import Year from '../components/Year';
import Header from '../components/Header';
import BoardMember from '../components/BoardMember';
import { type Page_QueryResponse } from './__generated__/Page_Query.graphql';

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: {
  variables: Variables,
  environment: Environment,
  query: GraphQLTaggedNode,
  queryProps: ?any
}) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({
      error,
      props: props
    }: {
      error: ?Error,
      props: ?Page_QueryResponse
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
            <img alt="itDAGENE logo" src="/static/itdagene_logo.png " />
            <Link href="/">
              <a> Back </a>
            </Link>
            <h1>
              <Year currentMetaData={props.currentMetaData} />
            </h1>
          </div>
          <div>
            {props.boardMembers.map(user => (
              <BoardMember key={user.id} user={user} />
            ))}
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
      }
      boardMembers {
        ...BoardMember_user
        id
      }
    }
  `,
  variables: {}
});
