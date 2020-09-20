import React from 'react';
import { FragmentRef } from 'react-relay';
import { Player } from 'video-react';
import Modal from 'react-modal';
import SummerjobMarathonContainer, {
  SummerjobMarathon,
  query,
  JoblistingNode,
} from '../components/SummerjobMarathon';
import { SummerjobMarathon_root } from '../__generated__/SummerjobMarathon_root.graphql';
import withData, { WithDataProps } from '../lib/withData';
import Layout from '../components/Layout';

type RenderProps = WithDataProps<SummerjobMarathon_root>;

type State = {
  loading: boolean;
  currentNode: JoblistingNode | null;
};

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    border: '0',
    borderRadius: '4px',
    bottom: 'auto',
    minHeight: '10rem',
    left: '50%',
    padding: '0',
    position: 'fixed',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    minWidth: '20rem',
    width: '80%',
    maxWidth: '60rem',
    overflow: 'hidden',
  },
};

class Index extends React.Component<RenderProps, State> {
  state = { loading: false, currentNode: null };

  loadingStart = (): void =>
    this.setState((prevState) => ({ ...prevState, loading: true }));
  loadingEnd = (): void =>
    this.setState((prevState) => ({ ...prevState, loading: false }));
  setCurrentNode = (open: JoblistingNode | null): void =>
    this.setState((prevState) => ({ ...prevState, currentNode: open }));

  componentDidMount() {
    Modal.setAppElement('body');
  }

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
          <Modal
            isOpen={this.state.currentNode !== null}
            onRequestClose={() => this.setCurrentNode(null)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {this.state.currentNode !== null && (
              <Player
                autoplay={true}
                playsInline
                src={this.state.currentNode.videoUrl}
              />
            )}
          </Modal>
          {props && (
            <SummerjobMarathon
              environment={environment}
              variables={variables}
              loading={this.state.loading}
              loadingStart={this.loadingStart}
              loadingEnd={this.loadingEnd}
              setCurrentNode={this.setCurrentNode}
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
