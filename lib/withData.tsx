import * as React from 'react';
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
import { resolveRelayEndpoint } from '../utils/relayEndpoint';
import { selectHydrationQueryProps } from '../utils/hydrationSnapshot';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import {
  fetchOptionalEventConfiguration,
  OptionalEventConfiguration,
} from '../utils/optionalEventConfiguration';
dayjs.locale('nb');

export type DataOptions = {
  includeEventConfiguration?: boolean;
  variables: Variables | ((arg0: NextRouter) => Variables);
  query: GraphQLTaggedNode;
};

export type DataOptionsFinal = {
  includeEventConfiguration: boolean;
  variables: Variables;
  query: GraphQLTaggedNode;
};

export type QueryProps<T extends OperationType> = T['response'];

export type WithDataBaseProps = {
  variables: Variables;
  environment: Environment;
  initialRenderTimestamp: string;
  optionalEventConfiguration: OptionalEventConfiguration;
  query: GraphQLTaggedNode;
  queryProps?: any;
  router: NextRouter;
};
export type WithDataDataProps<T> = {
  props?: T | null;
  error: Error | null;
};

export type WithDataProps<T> = WithDataDataProps<T> & WithDataBaseProps;

type State = {
  hasHydrated: boolean;
};
type Props = {
  queryRecords: ConstructorParameters<typeof RecordSource>[0];
  queryProps?: any;
  router: NextRouter;
  envSettings: EnvSettings;
  initialRenderTimestamp: string;
  optionalEventConfiguration: OptionalEventConfiguration;
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
  const {
    includeEventConfiguration = false,
    variables: localVariables,
    query,
  } = options;
  const variables =
    typeof localVariables === 'function'
      ? localVariables(router)
      : localVariables;

  return { includeEventConfiguration, variables, query };
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
          const optionalEventConfiguration =
            localOptions.includeEventConfiguration
              ? await fetchOptionalEventConfiguration('/api/graphql')
              : {};
          if (!ComposedComponent.getInitialProps) {
            return {
              initialRenderTimestamp: new Date().toISOString(),
              optionalEventConfiguration,
            };
          }
          return {
            ...(await ComposedComponent.getInitialProps(ctx)),
            initialRenderTimestamp: new Date().toISOString(),
            optionalEventConfiguration,
          };
        }

        let queryProps: QueryProps<T1> = {};
        let queryRecords = {};

        const envSettings: EnvSettings = {
          sentryDsn: process.env.SENTRY_DSN || '',
          release: process.env.RELEASE || 'dev',
          relayEndpoint: resolveRelayEndpoint({
            configuredEndpoint: process.env.RELAY_ENDPOINT,
            nodeEnv: process.env.NODE_ENV,
          }),
          browserRelayEndpoint: '/api/graphql',
        };
        // We're casting between RelayModernEnvironment and the Environment interface
        // because fetchQuery takes an environment of the interface type, which
        // RelayModernEnvironment implements, but fetchQuery still does not like.
        const environment = initEnvironment({
          envSettings,
        }) as Environment;
        const optionalEventConfigurationPromise =
          localOptions.includeEventConfiguration
            ? fetchOptionalEventConfiguration(envSettings.relayEndpoint)
            : Promise.resolve({});

        if (localOptions.query) {
          // Provide the `url` prop data in case a graphql query uses it
          // const url = { query: ctx.query, pathname: ctx.pathname }
          // TODO: Consider RelayQueryResponseCache
          // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
          try {
            queryProps = await fetchQuery(
              environment,
              localOptions.query,
              localOptions.variables || {}
            );
          } catch {
            // The QueryRenderer retries in the browser and presents the
            // route-level error state if the endpoint remains unavailable.
            // A temporary API outage should not turn every route into a Next
            // error document.
            queryProps = {};
          }
        }

        let composedProps;
        if (ComposedComponent.getInitialProps)
          composedProps = await ComposedComponent.getInitialProps({
            ...ctx,
            environment,
            queryProps,
          });

        queryRecords = environment.getStore().getSource().toJSON();
        const initialRenderTimestamp = new Date().toISOString();
        const optionalEventConfiguration =
          await optionalEventConfigurationPromise;

        return {
          ...composedProps,
          queryProps,
          queryRecords,
          envSettings,
          initialRenderTimestamp,
          optionalEventConfiguration,
        };
      }

      constructor(props: Props) {
        super(props);
        this.state = { hasHydrated: false };
        const { envSettings } = props;
        // The same type casting here.
        this.environment = initEnvironment({
          records: props.queryRecords,
          envSettings,
        }) as Environment;
      }

      componentDidMount(): void {
        this.setState({ hasHydrated: true });
      }

      render(): JSX.Element {
        const { query, variables } = getOptions(options, this.props.router);
        return (
          <ErrorBoundary resetOnChange={this.props.router}>
            <QueryRenderer<T1>
              query={query}
              environment={this.environment}
              fetchPolicy={'store-or-network'}
              variables={variables}
              render={({ props, error }): JSX.Element => {
                // Relay may finish a browser refetch while React is still
                // hydrating. Keep the serialized SSR snapshot for the first
                // client render, then adopt the live store after mount.
                const renderedProps = selectHydrationQueryProps<T>({
                  hasHydrated: this.state.hasHydrated,
                  initialQueryProps: this.props.queryProps as T | undefined,
                  liveQueryProps: props as T | null,
                });

                return (
                  <ComposedComponent
                    router={this.props.router}
                    props={renderedProps}
                    error={error}
                    environment={this.environment}
                    initialRenderTimestamp={this.props.initialRenderTimestamp}
                    optionalEventConfiguration={
                      this.props.optionalEventConfiguration || {}
                    }
                    query={query}
                    variables={variables}
                  />
                );
              }}
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

type WithDataAndLayoutComponent<T> = React.ComponentType<
  WithDataAndLayoutProps<T>
> & {
  getInitialProps?: (
    context: PageContext<any>
  ) => Promise<Record<string, any>> | Record<string, any>;
};

export const withDataAndLayout = <T extends {}>(
  ComposedComponent: WithDataAndLayoutComponent<T>,
  { layout = {}, ...withDataRest }: DataLayoutOptions<T>
): WithDataComponentType => {
  const LayoutComponent = ({
    props,
    error,
    ...rest
  }: WithDataProps<T>): JSX.Element => {
    const layoutSettings =
      typeof layout === 'object' ? layout : layout({ props, error });

    return (
      <Layout {...layoutSettings} props={props} error={error}>
        {props ? (
          <ComposedComponent {...rest} props={props} error={error} />
        ) : null}
      </Layout>
    );
  };

  LayoutComponent.getInitialProps = ComposedComponent.getInitialProps;

  return withData(LayoutComponent, withDataRest);
};
export default withData;
