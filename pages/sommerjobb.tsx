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
import { SummerjobMarathon_other } from '../__generated__/SummerjobMarathon_other.graphql';
import withData, { WithDataProps } from '../lib/withData';
import Layout from '../components/Layout';

type RenderProps = WithDataProps<
  SummerjobMarathon_root & SummerjobMarathon_other
>;

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
  state: State = { loading: false, currentNode: null };
  player: React.Ref<any> = null;

  loadingStart = (): void =>
    this.setState((prevState) => ({ ...prevState, loading: true }));
  loadingEnd = (): void =>
    this.setState((prevState) => ({ ...prevState, loading: false }));
  setCurrentNode = (open: JoblistingNode | null): void => {
    this.setState((prevState) => ({ ...prevState, currentNode: open }));
    setTimeout(() => this.player?.play(), 500);
  };

  componentDidMount(): void {
    Modal.setAppElement('body');
  }

  render(): JSX.Element {
    const { props, environment, variables } = this.props;
    return (
      <Layout
        customOpengraphMetadata={(): { title: string } => ({
          title: 'Sommerjob maraton',
        })}
        props
        noLoading
        responsive
      >
        <div>
          <h1>
            Velkommen til sommerjobb-maraton 2020
            <span aria-label="Running woman" role="img">
              🏃‍♀️
            </span>
            <span aria-label="Running man" role="img">
              🏃‍♂️
            </span>
          </h1>
          <p>
            Ta deg tid til å se gjennom videoene de ulike bedriftene har sendt
            inn. Bedriftene har selv valgt hva de ønsker å legge vekt på, men de
            fleste har stort fokus på tidligere -og neste års sommerjobber.
          </p>
          <p>
            Fant du en interessant video? Trykk deg videre på linken under for å
            se hvilke jobbutlysninger bedriften har!
          </p>
        </div>
        <SummerjobMarathonContainer
          environment={environment}
          variables={variables}
        >
          <Modal
            isOpen={this.state.currentNode !== null}
            onRequestClose={(): void => this.setCurrentNode(null)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {this.state.currentNode && (
              <Player
                autoplay
                src={this.state.currentNode.videoUrl}
                ref={(player): void => {
                  this.player = player;
                }}
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
              other={props as FragmentRef<typeof props>}
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
