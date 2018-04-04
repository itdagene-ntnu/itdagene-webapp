//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Image } from 'semantic-ui-react';
import { type CompanyView_company } from './__generated__/CompanyView_company.graphql';

type Props = {
  company: CompanyView_company
};

const CompanyView = ({ company }: Props) => (
  <a href={company.url}>
    <Image
      style={{ width: 180, height: 180, objectFit: 'contain', padding: 15 }}
      className="zoom"
      src={company.logo ? `https://itdagene.no/uploads/${company.logo}` : ''}
    />
  </a>
);

export default createFragmentContainer(
  CompanyView,
  graphql`
    fragment CompanyView_company on Company {
      id
      name
      logo
      url
    }
  `
);
