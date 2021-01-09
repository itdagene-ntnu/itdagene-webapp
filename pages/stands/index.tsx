import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { useEffect, useState } from 'react';
import StandCard from '../../components/Stands/StandCard';
import { currentDayCompanies } from '../../utils/time';
import LivePlayer from '../../components/Stands/LivePlayer';

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

  const { mainCollaborator } = props.currentMetaData;
  const collaboratorsId = props.currentMetaData.collaborators
    ? props.currentMetaData.collaborators.map((c) => c.id)
    : [];

  return (
    <>
      {props.stands && (
        <PageView hideContent hideDate hideTitle page={props.stands} />
      )}
      {/* TODO: Complete technical implementation of the LivePlayer */}
      <LivePlayer stand={{}} />
      {mainCollaborator ? (
        <HSPGrid>
          <StandCard
            company={mainCollaborator}
            key={mainCollaborator.id}
            time={time}
            type={'hsp'}
          />
        </HSPGrid>
      ) : (
        <></>
      )}

      <SPGrid>
        {props.currentMetaData.collaborators
          ?.filter((comp) => collaboratorsId.includes(comp.id))
          .map((comp) => (
            <StandCard key={comp.id} company={comp} time={time} type={'sp'} />
          ))}
      </SPGrid>

      <StandGrid>
        {props.currentMetaData[currentDayCompanies()]
          ?.filter((comp) => !collaboratorsId.includes(comp.id))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((comp) => (
            <StandCard
              key={comp.id}
              company={comp}
              time={time}
              type={'standard'}
            />
          ))}
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

// Safari doesn't support gap with flexbox. The given solution is a workaround
const SPGrid = styled(StandGrid)`
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  --gap: 25px;
  display: inline-flex;
  flex-wrap: wrap;
  margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
  width: calc(100% + var(--gap));
`;

const HSPGrid = styled(SPGrid)`
  grid-column: 1 / -1;
`;

export default withDataAndLayout(Index, {
  query: graphql`
    query stands_Query {
      currentMetaData {
        mainCollaborator {
          id
          ...StandCard_company
        }
        collaborators {
          id
          ...StandCard_company
        }
        companiesFirstDay {
          id
          name
          ...StandCard_company
        }
        companiesLastDay {
          id
          name
          ...StandCard_company
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
