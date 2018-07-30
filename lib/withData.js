//@flow

import * as React from 'react';
import initEnvironment, { type EnvSettings } from './createRelayEnvironment';
// $FlowFixMe
import { fetchQuery } from 'react-relay';
import {
  type Environment,
  type GraphQLTaggedNode,
  type Variables,
  type Record
} from 'react-relay';
import type { NextRouter } from '../utils/types';
import ErrorBoundary from '../components/ErrorBoundary';
import { withRouter } from 'next/router';
const dayjs = require('dayjs');
require('dayjs/locale/nb');
dayjs.locale('nb');
export type DataOptions = {
  variables?: Variables,
  query: GraphQLTaggedNode
};

export type WithDataProps = {
  variables: Variables,
  environment: Environment,
  query: GraphQLTaggedNode,
  queryProps?: any,
  router: NextRouter
};

type State = {};
type Props = {
  queryRecords: Record,
  router: NextRouter,
  envSettings: EnvSettings,
  ctx: NextRouter
};

const getOptions = (
  options: DataOptions | (NextRouter => DataOptions),
  router: NextRouter
) => {
  const { variables: localVariables, query } = options;
  const variables =
    typeof localVariables === 'function'
      ? localVariables(router)
      : localVariables;

  return { variables, query };
};
export default (
  ComposedComponent: React.ComponentType<*>,
  options: DataOptions | (NextRouter => DataOptions)
) => {
  return withRouter(
    class WithData extends React.Component<Props, State> {
      // $FlowFixMe
      static displayName = `WithData(${ComposedComponent.displayName})`;
      environment: Environment;

      static async getInitialProps(ctx: any) {
        // Evaluate the composed component's getInitialProps()
        const localOptions = getOptions(options, ctx);
        let composedInitialProps = {};
        // $FlowFixMe
        if (ComposedComponent.getInitialProps) {
          // $FlowFixMe
          composedInitialProps = await ComposedComponent.getInitialProps(ctx);
        }
        // $FlowFixMe
        if (process.browser) {
          return {};
        }

        let queryProps = {};
        let queryRecords = {};

        const envSettings: EnvSettings = {
          ravenPublicDsn: process.env.RAVEN_PUBLIC_DSN || '',
          release: process.env.RELEASE || 'dev',
          relayEndpoint:
            process.env.RELAY_ENDPOINT || 'http://localhost:8000/graphql'
        };
        const environment: Environment = initEnvironment({
          envSettings
        });

        if (localOptions.query) {
          // Provide the `url` prop data in case a graphql query uses it
          // const url = { query: ctx.query, pathname: ctx.pathname }
          // TODO: Consider RelayQueryResponseCache
          // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
          queryProps = await fetchQuery(
            environment,
            localOptions.query,
            localOptions.variables
          );
          // $FlowFixMe
          queryRecords = environment
            .getStore()
            .getSource()
            .toJSON();
        }

        return {
          ...composedInitialProps,
          queryProps,
          queryRecords,
          envSettings
        };
      }

      constructor(props: Props) {
        super(props);
        const { envSettings } = props;
        this.environment = initEnvironment({
          records: props.queryRecords,
          envSettings
        });
      }

      render() {
        const { query, variables } = getOptions(options, this.props.router);
        return (
          <ErrorBoundary resetOnChange={this.props.router}>
            <ComposedComponent
              {...this.props}
              environment={this.environment}
              query={query}
              variables={variables}
            />
          </ErrorBoundary>
        );
      }
    }
  );
};
