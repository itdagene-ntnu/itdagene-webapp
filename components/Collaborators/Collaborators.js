//@flow
import { createFragmentContainer, graphql } from 'react-relay';
import React, { Fragment } from 'react';

import { type Collaborators_query } from './__generated__/Collaborators_query.graphql';
import CollaboratorView from './Collaborator';
import Flex from 'styled-flex-component';
import styled from 'styled-components';

type Props = {
  query: Collaborators_query,
  showDescription?: boolean
};

const Title = styled('h1')`
  text-align: center;
`;

const Collaborators = ({ query, showDescription }: Props) => (
  <Fragment>
    <Title>Våre samarbeidspartnere</Title>
    <Flex wrap justifyCenter>
      {query.collaborators.map(company => (
        <CollaboratorView
          showDescription={showDescription}
          key={company.id}
          company={company}
        />
      ))}
    </Flex>
  </Fragment>
);

export default createFragmentContainer(
  Collaborators,
  graphql`
    fragment Collaborators_query on Query {
      collaborators {
        id
        ...CollaboratorView_company
      }
    }
  `
);
