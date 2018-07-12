//@flow
import { Image } from 'semantic-ui-react';
import { createFragmentContainer, graphql } from 'react-relay';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { type CollaboratorView_company } from './__generated__/CollaboratorView_company.graphql';

type Props = {
  company: CollaboratorView_company,
  showDescription?: boolean
};

const CollaboratorView = ({ company, showDescription }: Props) => (
  <div style={{ padding: '0 10px' }}>
    <a href={company.url}>
      <Image
        style={{
          maxWidth: showDescription ? 270 : 330,
          height: showDescription ? 200 : 240,
          objectFit: 'contain',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 15
        }}
        className="zoom"
        src={company.logo ? `https://itdagene.no/uploads/${company.logo}` : ''}
      />
    </a>
    {showDescription && <ReactMarkdown source={company.description} />}
  </div>
);

export default createFragmentContainer(
  CollaboratorView,
  graphql`
    fragment CollaboratorView_company on Company {
      id
      name
      logo
      url
      description
    }
  `
);
