//@flow

import cowsay from 'cowsay-browser';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import ReactMarkdown from 'react-markdown';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import React from 'react';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import LoadingIndicator from '../components/LoadingIndicator';
import { type joblistingPage_QueryResponse } from './__generated__/joblistingPage_Query.graphql';

import { Container } from 'semantic-ui-react';
import { HeaderMenu } from '../components/Header';
import { itdageneBlue } from '../utils/colors';

type RenderProps = {
  error: ?Error,
  props: ?joblistingPage_QueryResponse
};

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
    render={({ error, props: props }: RenderProps) => {
      if (error) return <div>Error</div>;

      if (!props) return <LoadingIndicator />;

      return (
        <>
          <div
            style={{ background: itdageneBlue }}
            className="ui inverted vertical segment"
          >
            <Container>
              <HeaderMenu />
            </Container>
          </div>
          <Container
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            <h1>{props.node.company.name}</h1>
            <pre>{cowsay.say({ text: props.node.title })}</pre>
            <ReactMarkdown source={props.node.description} />
          </Container>
        </>
      );
    }}
  />
);
export default withData(Index, ({ query: { id } }) => ({
  query: graphql`
    query joblistingPage_Query($id: ID!) {
      node(id: $id) {
        ... on Joblisting {
          title
          description
          company {
            name
            logo
          }
        }
      }
    }
  `,
  variables: { id }
}));
