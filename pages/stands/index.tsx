import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import stands from '../../testing/companyMock';
import StandCard from '../../components/Stands/StandCard';
import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  return (
    <>
      {props.stands && (
        <PageView hideContent hideDate hideTitle page={props.stands} />
      )}

      <StandGrid>
        {stands.map((stand) => (
          <StandCard
            key={stand.id}
            active={stand.active}
            company={stand.company}
            id={stand.id}
          />
        ))}
      </StandGrid>
    </>
  );
};

const StandGrid = styled('div')`
  display: grid;
  margin: 50px 0;
  width: 100%;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
`;

// TODO: This query will need to be changed to reflect the new stands-query
export default withDataAndLayout(Index, {
  query: graphql`
    query stands_Query {
      stands: page(slug: "stands") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props && props.stands,
  }),
});
