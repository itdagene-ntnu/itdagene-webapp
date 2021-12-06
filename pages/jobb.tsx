import React from 'react';
import { NextRouter } from 'next/router';
import { FragmentRef } from 'react-relay';
import JoblistingsContainer, {
  query,
  JoblistingsList,
} from '../components/Joblistings/JoblistingsContainer';
import { JoblistingsContainer_root } from '../__generated__/JoblistingsContainer_root.graphql';
import withData, { WithDataProps } from '../lib/withData';

import Layout from '../components/Layout';

type RenderProps = WithDataProps<JoblistingsContainer_root>;

type State = { loading: boolean };
class Index extends React.Component<RenderProps, State> {
  state = { loading: false };
  loadingStart = (): void => this.setState((prevState) => ({ loading: true }));
  loadingEnd = (): void => this.setState((prevState) => ({ loading: false }));
  render(): JSX.Element {
    const { props, environment, variables } = this.props;
    return (
      <Layout
        customOpengraphMetadata={(): { title: string } => ({
          title: 'Jobbannonser',
        })}
        props
        noLoading
        responsive
      >
        <JoblistingsContainer environment={environment} variables={variables}>
          {props && (
            <JoblistingsList
              environment={environment}
              variables={{}}
              loading={this.state.loading}
              loadingStart={this.loadingStart}
              loadingEnd={this.loadingEnd}
              /* TODO FIXME Fragment types are not properly handled by WithData */
              root={props as unknown as FragmentRef<typeof props>}
            />
          )}
        </JoblistingsContainer>
      </Layout>
    );
  }
}

const parseTowns = (
  query: NextRouter['query']
): { value: string; label: string }[] => {
  try {
    return JSON.parse(query.towns as string);
  } catch (e) {
    return [];
  }
};

const parseYear = (query: string | string[]): number | null =>
  parseInt(query as string, 10);

export default withData(Index, {
  query,
  variables: (router: NextRouter) => ({
    type: router.query.type || '',
    fromYear: parseYear(router.query.fromYear) || 1,
    toYear: parseYear(router.query.toYear) || 5,
    company: router.query.company || '',
    towns:
      parseTowns(router.query) &&
      parseTowns(router.query).map((el) => el.value),
    orderBy: router.query.orderBy ? [router.query.orderBy, 'ID'] : [],
    count: 30,
  }),
});
