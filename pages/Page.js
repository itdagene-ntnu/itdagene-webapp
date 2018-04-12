//@flow
import React, { Fragment } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { Container } from 'semantic-ui-react';
import withData, { type WithDataProps } from '../lib/withData';
import { HeaderMenu } from '../components/Header';
import BoardMember from '../components/BoardMember';
import LoadingIndicator from '../components/LoadingIndicator';
import { type Page_QueryResponse } from './__generated__/Page_Query.graphql';
import { itdageneBlue } from '../utils/colors';

const Index = ({
  variables,
  query,
  environment,
  queryProps,
  url
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
      if (error) return <div>Error</div>;

      if (!props) return <LoadingIndicator url={url} />;

      return (
        <Fragment>
          <div
            style={{ background: itdageneBlue }}
            className="ui inverted vertical segment"
          >
            <Container middle>
              <HeaderMenu url={url} />
            </Container>
          </div>
          <Container
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            {props.boardMembers.map(user => (
              <BoardMember abc="asd" key={user.id} user={user} />
            ))}
          </Container>
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
