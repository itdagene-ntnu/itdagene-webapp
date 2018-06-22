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

export type DataOptions = {
  variables?: Variables,
  query: GraphQLTaggedNode
};

export type WithDataProps = {
  variables: Variables,
  environment: Environment,
  query: GraphQLTaggedNode,
  queryProps?: any,
  url: NextRouter
};

type State = {};
type Props = {
  queryRecords: Record,
  url: NextRouter,
  envSettings: EnvSettings
};

export default (
  ComposedComponent: React.ComponentType<*>,
  options: DataOptions | (NextUrl => DataOptions)
) => {
  return class WithData extends React.Component<Props, State> {
    // $FlowFixMe
    static displayName = `WithData(${ComposedComponent.displayName})`;
    environment: Environment;

    static async getInitialProps(ctx: any) {
      // Evaluate the composed component's getInitialProps()
      const localOptions =
        typeof options === 'function' ? options(ctx) : options;
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
      const localOptions =
        typeof options === 'function' ? options(this.props.url) : options;
      return (
        <ErrorBoundary resetOnChange={this.props.url}>
          <ComposedComponent
            {...this.props}
            environment={this.environment}
            {...localOptions}
          />
        </ErrorBoundary>
      );
    }
  };
};
