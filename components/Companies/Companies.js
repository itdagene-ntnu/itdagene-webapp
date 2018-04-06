//@flow
import React, { Fragment } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type Companies_query } from './__generated__/Companies_query.graphql';
import { Header } from 'semantic-ui-react';
import CompanyView from './CompanyView';
import sortBy from 'lodash/sortBy';

type Props = {
  query: Companies_query
};

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center'
};

const Companies = ({ query }: Props) => {
  const sections = [
    {
      title: 'Bedrifter dag 1',
      data: sortBy(query.companiesFirstDay, 'id')
    },
    {
      title: 'Bedrifter dag 2',
      data: sortBy(query.companiesLastDay, 'id')
    }
  ];
  return sections.map(({ title, data }) => (
    <Fragment key={title}>
      <Header as="h3" textAlign="center">
        {title}
      </Header>
      <div style={containerStyle}>
        {data.map(company => (
          <CompanyView key={company.id} company={company} />
        ))}
      </div>
    </Fragment>
  ));
};

export default createFragmentContainer(
  Companies,
  graphql`
    fragment Companies_query on Query {
      companiesFirstDay {
        id
        ...CompanyView_company
      }
      companiesLastDay {
        id
        ...CompanyView_company
      }
    }
  `
);
