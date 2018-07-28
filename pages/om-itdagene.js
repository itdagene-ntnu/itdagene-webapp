//@flow
import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';
import BoardMember from '../components/BoardMember';
import { type omItdagene_QueryResponse } from './__generated__/omItdagene_Query.graphql';
import PageView from '../components/PageView';
import Layout from '../components/Layout';
import Flex from 'styled-flex-component';
import { sortBy } from 'lodash';

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
      props: ?omItdagene_QueryResponse
    }) => {
      return (
        <Layout
          responsive
          {...{ error, props }}
          contentRenderer={({ props, error }) => (
            <>
              {props.omItdagene && <PageView page={props.omItdagene} />}
              <h1>
                Styret {props.currentMetaData && props.currentMetaData.year}
              </h1>
              <Flex wrap center>
                {sortBy(props.currentMetaData.boardMembers, m =>
                  ROLES.indexOf(m.role)
                ).map(user => <BoardMember key={user.id} user={user} />)}
              </Flex>
            </>
          )}
        />
      );
    }}
  />
);

export default withData(Index, {
  query: graphql`
    query omItdagene_Query {
      currentMetaData {
        year
        id
        boardMembers {
          ...BoardMember_user
          id
          role
          fullName
        }
      }

      omItdagene: page(slug: "om-itdagene") {
        ...PageView_page
      }
    }
  `,
  variables: {}
});
