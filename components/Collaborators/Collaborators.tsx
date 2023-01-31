import { createFragmentContainer, graphql } from 'react-relay';

import { Collaborators_query } from '../../__generated__/Collaborators_query.graphql';
import CollaboratorView from './Collaborator';
import styled from 'styled-components';
import Flex from '../Styled/Flex';

type Props = {
  query: Collaborators_query;
  showDescription?: boolean;
  showJoblistings?: boolean;
};

const Title = styled('h1')`
  text-align: center;
`;

const Collaborators = ({
  query,
  showDescription,
  showJoblistings,
}: Props): JSX.Element | null =>
  query.collaborators ? (
    <>
      <Title>Våre samarbeidspartnere</Title>
      <Flex flexWrap="wrap" justifyContent="center">
        {query.collaborators.map((company) => (
          <CollaboratorView
            showJoblistings={showJoblistings}
            showDescription={showDescription}
            key={company.id}
            company={company}
          />
        ))}
      </Flex>
    </>
  ) : null;

export default createFragmentContainer(Collaborators, {
  query: graphql`
    fragment Collaborators_query on MetaData {
      collaborators {
        id
        ...Collaborator_company
      }
    }
  `,
});
