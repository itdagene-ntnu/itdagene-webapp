import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import stands from '../../testing/companyMock';
import StandCard from '../../components/Stands/StandCard';
import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { useEffect, useState } from 'react';

// Update the currentEvent-list every 30 sec
const intervalLength = 1000 * 30;

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), intervalLength);
    return () => clearInterval(interval);
  }, []);

  const collaboratorsId = props.currentMetaData.collaborators
    ? props.currentMetaData.collaborators.map((c) => c.id)
    : [];

  return (
    <>
      {props.stands && (
        <PageView hideContent hideDate hideTitle page={props.stands} />
      )}
      <SPGrid>
        {props.currentMetaData.collaborators?.map((comp) => {
          return (
            <StandCard
              key={comp.id}
              id={comp.id}
              company={comp}
              time={time}
              active={comp.stand?.active ?? false}
              events={comp.stand?.events ?? []}
              type={collaboratorsId.includes(comp.id) ? 'sp' : 'standard'}
            />
          );
        })}
      </SPGrid>


      <StandGrid>
        {props.currentMetaData.companiesFirstDay?.filter((comp) => !collaboratorsId.includes(comp.id)).map((comp) => {
          return (
            <StandCard
              key={comp.id}
              id={comp.id}
              company={comp}
              time={time}
              active={comp.stand?.active ?? false}
              events={comp.stand?.events ?? []}
              type={collaboratorsId.includes(comp.id) ? 'sp' : 'standard'}
            />
          );
        })}
      </StandGrid>
    </>
  );
};

const StandGrid = styled('div')`
  display: grid;
  margin: 25px 0;
  width: 100%;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
`;

const SPGrid = styled(StandGrid)`
  grid-template-columns: repeat(auto-fit, minmax(239px, 1fr));

`

// TODO: Implement a fragment
export default withDataAndLayout(Index, {
  query: graphql`
    query stands_Query {
      currentMetaData {
        collaborators {
          name
          id
          description
          url
          logo
          stand {
            active
            description
            events {
              id
            }
          }
        }
        companiesFirstDay {
          name
          id
          description
          url
          logo
          stand {
            active
            description
            events {
              id
              title
              date
              timeStart
              timeEnd
              description
              type
              location
            }
          }
        }
      }
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
