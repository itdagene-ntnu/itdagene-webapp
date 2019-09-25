//@flow

import React from 'react';
import { withRouter } from 'next/router';
import JoblistingsContainer, {
  query,
  JoblistingsList
} from '../components/Joblistings/JoblistingsContainer';
import './test.css';
import type { JoblistingsContainer_root } from '../components/Joblistings/__generated__/JoblistingsContainer_root.graphql';
import withData, { type WithDataProps } from '../lib/withData';

import Layout from '../components/Layout';

type RenderProps = WithDataProps<JoblistingsContainer_root>;

type State = { loading: boolean };
class Index extends React.Component<RenderProps, State> {
  state = { loading: false };
  loadingStart = () => this.setState(prevState => ({ loading: true }));
  loadingEnd = () => this.setState(prevState => ({ loading: false }));
  render() {
    const { props, environment, variables } = this.props;
    return (
      <Layout
        customOpengraphMetadata={() => ({
          title: 'Jobbannonser'
        })}
        props
        noLoading
        responsive
      >
        <JoblistingsContainer environment={environment} variables={variables}>
          <JoblistingsList
            environment={environment}
            loading={this.state.loading}
            loadingStart={this.loadingStart}
            loadingEnd={this.loadingEnd}
            root={props}
          />
        </JoblistingsContainer>
      </Layout>
    );
  }
}

const parseTowns = query => {
  try {
    return JSON.parse(query.towns);
  } catch (e) {
    return [];
  }
};

export default withData(withRouter(Index), {
  query,
  variables: router => ({
    type: router.query.type || '',
    fromYear: parseInt(router.query.fromYear, 10) || 1,
    toYear: parseInt(router.query.toYear, 10) || 5,
    company: router.query.company || '',
    towns: parseTowns(router.query).map(el => el.value),
    orderBy: router.query.orderBy ? [router.query.orderBy, 'ID'] : [],
    count: 30
  })
});
