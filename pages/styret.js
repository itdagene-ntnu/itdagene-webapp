//@flow
import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';
import BoardMember from '../components/BoardMember';
import { type Page_QueryResponse } from './__generated__/Page_Query.graphql';
import Layout from '../components/Layout';
import Flex from 'styled-flex-component';
import sortBy from 'lodash/sortBy';

const ROLES = [
  'Leder',
  'Nestleder',
  'Økonomi',
  'Bedrift',
  'Bankett',
  'Logistikk',
  'Markedsføring',
  'Web'
];

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: WithDataProps) => (
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
      if (!props) return <Layout {...{ error, props }} />;
      return (
        <Layout
          responsive
          {...{ error, props }}
          contentRenderer={() => (
            <Flex wrap justifyAround>
              {sortBy(props.boardMembers, m => ROLES.indexOf(m.role)).map(
                user => <BoardMember key={user.id} user={user} />
              )}
            </Flex>
          )}
        />
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
        role
        fullName
      }
    }
  `,
  variables: {}
});
