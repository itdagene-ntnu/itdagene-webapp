import React, * as React from 'react';
import initEnvironment, { EnvSettings } from './createRelayEnvironment';
import {
  GraphQLTaggedNode,
  Variables,
  fetchQuery,
  Environment,
} from 'react-relay';
import { RecordSource, OperationType } from 'relay-runtime';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  Layout,
  LayoutSettings,
  ContentRendererProps,
} from '../components/Layout';
import { QueryRenderer } from 'react-relay';
import { withRouter, NextRouter } from 'next/router';
import { PageContext } from '../utils/types';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
dayjs.locale('nb');

export type DataOptions = {
  variables: Variables | ((arg0: NextRouter) => Variables);
  query: GraphQLTaggedNode;
};

export type DataOptionsFinal = {
  variables: Variables;
  query: GraphQLTaggedNode;
};

export type QueryProps<T extends OperationType> = T['response'];

export type WithDataBaseProps = {
  variables: Variables;
  environment: Environment;
  query: GraphQLTaggedNode;
  queryProps?: any;
  router: NextRouter;
};
export type WithDataDataProps<T> = {
  props?: T | null;
  error: Error | null;
};

export type WithDataProps<T> = WithDataDataProps<T> & WithDataBaseProps;

type State = {};
type Props = {
  queryRecords: ConstructorParameters<typeof RecordSource>[0];
  router: NextRouter;
  envSettings: EnvSettings;
  ctx: NextRouter;
};

type ComposedComponentType<T, T1 extends OperationType> = React.ComponentType<
  WithDataProps<T>
> & {
  getInitialProps?: (
    arg0: PageContext<T1>
  ) => Promise<Record<string, any>> | Record<string, any>;
};

type WithDataComponentType = React.ComponentType<Omit<Props, 'router'>>;

const getOptions = (
  options: DataOptions,
  router: NextRouter
): DataOptionsFinal => {
  const { variables: localVariables, query } = options;
  const variables =
    typeof localVariables === 'function'
      ? localVariables(router)
      : localVariables;

  return { variables, query };
};

/**
 * HOC that wraps a component in a QueryRenderer in order to provide data.
 */
export const withData = <T extends {}, T1 extends OperationType>(
  ComposedComponent: ComposedComponentType<T, T1>,
  options: DataOptions
): WithDataComponentType => {
  return withRouter(
    class WithData extends React.Component<Props, State> {
      static displayName = `WithData(${ComposedComponent.displayName})`;
      environment: Environment;

      static async getInitialProps(ctx: any): Promise<WithDataProps<T> | {}> {
        const localOptions = getOptions(options, ctx);
        if (process.browser) {
          if (!ComposedComponent.getInitialProps) {
            return {};
          }
          return await ComposedComponent.getInitialProps(ctx);
        }

        let queryProps: QueryProps<T1> = {};
        let queryRecords = {};

        const envSettings: EnvSettings = {
          sentryDsn: process.env.SENTRY_DSN || '',
          release: process.env.RELEASE || 'dev',
          relayEndpoint:
            process.env.RELAY_ENDPOINT || 'http://localhost:8000/graphql',
        };
        // We're casting between RelayModernEnvironment and the Environment interface
        // because fetchQuery takes an environment of the interface type, which
        // RelayModernEnvironment implements, but fetchQuery still does not like.
        const environment = initEnvironment({
          envSettings,
        }) as Environment;

        if (localOptions.query) {
          // Provide the `url` prop data in case a graphql query uses it
          // const url = { query: ctx.query, pathname: ctx.pathname }
          // TODO: Consider RelayQueryResponseCache
          // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
          queryProps = await fetchQuery(
            environment,
            localOptions.query,
            localOptions.variables || {}
          );
        }

        let composedProps;
        if (ComposedComponent.getInitialProps)
          composedProps = await ComposedComponent.getInitialProps({
            ...ctx,
            environment,
            queryProps,
          });

        queryRecords = environment.getStore().getSource().toJSON();

        return {
          ...composedProps,
          queryProps,
          queryRecords,
          envSettings,
        };
      }

      constructor(props: Props) {
        super(props);
        const { envSettings } = props;
        // The same type casting here.
        this.environment = initEnvironment({
          records: props.queryRecords,
          envSettings,
        }) as Environment;
      }

      render(): JSX.Element {
        const { query, variables } = getOptions(options, this.props.router);
        return (
          <ErrorBoundary resetOnChange={this.props.router}>
            <QueryRenderer<T1>
              query={query}
              environment={this.environment}
              fetchPolicy={'store-and-network'}
              variables={variables}
              render={({ props, error }): JSX.Element => (
                <ComposedComponent
                  router={this.props.router}
                  props={props as T | null}
                  error={error}
                  environment={this.environment}
                  query={query}
                  variables={variables}
                />
              )}
            />
          </ErrorBoundary>
        );
      }
    }
  );
};

export type DataLayoutOptions<T> = DataOptions & {
  layout?:
    | LayoutSettings<T>
    | ((props: WithDataDataProps<T>) => LayoutSettings<T>);
};
export type WithDataAndLayoutProps<T> = WithDataBaseProps &
  ContentRendererProps<T>;

export const withDataAndLayout = <T extends {}>(
  ComposedComponent: React.ComponentType<WithDataAndLayoutProps<T>>,
  { layout = {}, ...withDataRest }: DataLayoutOptions<T>
): WithDataComponentType =>
  withData(
    ({ props, error, ...rest }: WithDataProps<T>) => (
      <Layout
        {...(typeof layout === 'object' ? layout : layout({ props, error }))}
        contentRenderer={({ props, error }): JSX.Element => (
          <ComposedComponent {...rest} props={props} error={error} />
        )}
        props={props}
        error={error}
      />
    ),
    withDataRest
  );
export default withData;
