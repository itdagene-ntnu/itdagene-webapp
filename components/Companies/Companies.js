//@flow
import React, { Fragment } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type Companies_query } from './__generated__/Companies_query.graphql';
import { Header } from 'semantic-ui-react';
import CompanyView from './CompanyView';

type Props = {
  query: Companies_query
};

const containerStyle = { display: 'flex', flexWrap: 'wrap' };

const Companies = ({ query }: Props) => {
  const sections = [
    {
      title: 'Bedrifter dag 1',
      data: query.companiesFirstDay
    },
    {
      title: 'Bedrifter dag 2',
      data: query.companiesLastDay
    }
  ];
  return (
    <Fragment>
      {sections.map(({ title, data }) => (
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
      ))}
    </Fragment>
  );
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
