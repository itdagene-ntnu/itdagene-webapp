//@flow
import * as React from 'react';
import initEnvironment from './createRelayEnvironment';
// $FlowFixMe
import { fetchQuery } from 'react-relay';
import {
  type Environment,
  type GraphQLTaggedNode,
  type Variables,
  type Record
} from 'react-relay';
import type { NextUrl } from '../utils/types';

export type DataOptions = {
  variables?: Variables,
  query: GraphQLTaggedNode
};

export type WithDataProps = {
  variables: Variables,
  environment: Environment,
  query: GraphQLTaggedNode,
  queryProps: ?any,
  url: NextUrl
};

type State = {};
type Props = { queryRecords: Record };

export default (
  ComposedComponent: React.ComponentType<*>,
  options: DataOptions
) => {
  return class WithData extends React.Component<Props, State> {
    // $FlowFixMe
    static displayName = `WithData(${ComposedComponent.displayName})`;
    environment: Environment;

    static async getInitialProps(ctx: any) {
      // Evaluate the composed component's getInitialProps()
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
      const environment: Environment = initEnvironment();

      if (options.query) {
        // Provide the `url` prop data in case a graphql query uses it
        // const url = { query: ctx.query, pathname: ctx.pathname }
        const variables = {};
        // TODO: Consider RelayQueryResponseCache
        // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
        queryProps = await fetchQuery(environment, options.query, variables);
        // $FlowFixMe
        queryRecords = environment
          .getStore()
          .getSource()
          .toJSON();
      }

      return {
        ...composedInitialProps,
        queryProps,
        queryRecords
      };
    }

    constructor(props: Props) {
      super(props);
      this.environment = initEnvironment({
        records: props.queryRecords
      });
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          environment={this.environment}
          {...options}
        />
      );
    }
  };
};
