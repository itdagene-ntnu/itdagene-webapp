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
import { Container } from 'semantic-ui-react';

import WelcomeScreen from '../components/Frontpage/WelcomeScreen';

import { HeaderMenu } from '../components/Header';

import { itdageneBlue } from '../utils/colors';
import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';

type RenderProps = {
  error: ?Error,
  props: ?pages_index_QueryResponse
};
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
    render={({ error, props }: RenderProps) => {
      if (error) return <div>Error</div>;

      if (!props) return <div> Laster </div>;

      return (
        <Fragment>
          <div
            style={{ height: 700, background: itdageneBlue }}
            className="ui inverted vertical segment"
          >
            <Container>
              <HeaderMenu />
            </Container>

            <WelcomeScreen currentMetaData={props.currentMetaData} />
          </div>
          <div className="ui vertical stripe segment">
            <div className="ui middle aligned stackable grid container">
              <div className="row">
                <div className="eight wide column">
                  <h3 className="ui header">
                    We Help Companies and Companions
                  </h3>
                  <p>
                    We can give your company superpowers to do things that they
                    never thought possible. Let us delight your customers and
                    empower your needs...through pure data analytics.
                  </p>
                  <h3 className="ui header">We Make Bananas That Can Dance</h3>
                  <p>
                    Yes thats right, you thought it was the stuff of dreams, but
                    even bananas can be bioengineered.
                  </p>
                </div>
                <div className="six wide right floated column">
                  <img
                    src="static/itdagene_logo.png"
                    alt="itdagenLogo"
                    className="ui large bordered rounded image"
                  />
                </div>
              </div>
              <div className="row">
                <div className="center aligned column">
                  <a className="ui huge button">Check Them Out</a>
                </div>
              </div>
            </div>
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
        ...WelcomeScreen_currentMetaData
        id
        year
      }
    }
  `,
  variables: {}
});
