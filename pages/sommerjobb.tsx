import React from 'react';
import { FragmentRef } from 'react-relay';
import SummerjobMarathonContainer, {
  SummerjobMarathon,
  query,
} from '../components/SummerjobMarathon';
import { SummerjobMarathon_root } from '../__generated__/SummerjobMarathon_root.graphql';
import withData, { WithDataProps } from '../lib/withData';

import Layout from '../components/Layout';

type RenderProps = WithDataProps<SummerjobMarathon_root>;

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
        <SummerjobMarathonContainer
          environment={environment}
          variables={variables}
        >
          {props && (
            <SummerjobMarathon
              environment={environment}
              variables={variables}
              loading={this.state.loading}
              loadingStart={this.loadingStart}
              loadingEnd={this.loadingEnd}
              /* TODO FIXME Fragment types are not properly handled by WithData */
              root={(props as unknown) as FragmentRef<typeof props>}
            />
          )}
        </SummerjobMarathonContainer>
      </Layout>
    );
  }
}

export default withData(Index, {
  query,
  variables: {
    count: 30,
  },
});
