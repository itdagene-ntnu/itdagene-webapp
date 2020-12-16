import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import Flex, { FlexItem } from 'styled-flex-component';
import { groupBy, sortBy } from 'lodash';
import { program_QueryResponse } from '../../__generated__/program_Query.graphql';
import styled from 'styled-components';

import stands from '../../testing/companyMock';
import StandCard from '../../components/Stands/StandCard';

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => {
  return (
    <>
      {props.programPage && <PageView hideContent page={props.programPage} />}

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
  /* justify-content: flex-start; */
  margin: 50px 0;
  width: 100%;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
`;

export default withDataAndLayout(Index, {
  query: graphql`
    query program_Query {
      events {
        title
        id
        timeStart
        timeEnd
        description
        location
        date
        type
        company {
          id
          name
        }
        usesTickets
        maxParticipants
      }
      programPage: page(slug: "program") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props && props.programPage,
  }),
});
