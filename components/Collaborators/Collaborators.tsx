import { createFragmentContainer, graphql } from 'react-relay';
import React from 'react';

import { Collaborators_query } from '../../__generated__/Collaborators_query.graphql';
import CollaboratorView from './Collaborator';
import Flex from 'styled-flex-component';
import styled from 'styled-components';

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
      <Flex wrap justifyCenter>
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
