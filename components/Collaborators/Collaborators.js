//@flow
import { Header } from 'semantic-ui-react';
import { createFragmentContainer, graphql } from 'react-relay';
import React, { Fragment } from 'react';

import { type Collaborators_query } from './__generated__/Collaborators_query.graphql';
import CollaboratorView from './Collaborator';

type Props = {
  query: Collaborators_query,
  showDescription?: boolean
};

const containerStyle = {
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(350px, 1fr))`
};

const Collaborators = ({ query, showDescription }: Props) => (
  <Fragment>
    <Header as="h3" textAlign="center">
      Våre samarbeidspartnere
    </Header>
    <div style={containerStyle}>
      {query.collaborators.map(company => (
        <CollaboratorView
          showDescription={showDescription}
          key={company.id}
          company={company}
        />
      ))}
    </div>
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
