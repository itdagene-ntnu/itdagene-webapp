//@flow
import { createFragmentContainer, graphql } from 'react-relay';
import React, { Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import styled from 'styled-components';

import Link from 'next/link';
import Flex from 'styled-flex-component';
import { type Companies_query } from './__generated__/Companies_query.graphql';
import CompanyView from './CompanyView';

type Props = {
  query: Companies_query
};

const Title = styled('h1')`
  text-align: center;
`;

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
      <Title>{title}</Title>
      <Flex wrap justifyAround>
        {data.map(company => (
          <CompanyView key={company.id} company={company} />
        ))}
      </Flex>
      <h4 style={{ textAlign: 'center' }}>
        <Link>
          <a href="/info/[side]" as="/info/stands">
            {' '}
            Kart over stands{' '}
          </a>
        </Link>
      </h4>
    </Fragment>
  ));
};

export default createFragmentContainer(Companies, {
  query: graphql`
    fragment Companies_query on MetaData {
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
});
