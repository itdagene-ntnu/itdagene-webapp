import React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { useEffect, useState } from 'react';
import StandCard from '../../components/Stands/StandCard';
import { currentDayCompanies, timeIsAfterNow } from '../../utils/time';
import LivePlayer from '../../components/Stands/LivePlayer';

// Update the currentEvent-list every 30 sec
const intervalLength = 1000 * 30;

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  const [time, setTime] = useState(Date.now());
  const {
    mainCollaborator,
    collaborators,
    startDate,
    endDate,
  } = props.currentMetaData;

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), intervalLength);
    return (): void => clearInterval(interval);
  }, [props.currentMetaData]);

  const currentDayCompaniesIds = (): string[] => {
    return props.currentMetaData[currentDayCompanies(endDate)]
      ? props.currentMetaData[currentDayCompanies(endDate)]!.map((c) => c.id)
      : [];
  };

  const collaboratorsIds = (): string[] => {
    return collaborators ? collaborators.map((c) => c.id) : [];
  };

  return timeIsAfterNow(time, '00:00:00', startDate) ? (
    <h1>Stands blir tilgjengelige ved arrangementsstart</h1>
  ) : (
    <>
      {props.stands_page && (
        <PageView hideContent hideDate hideTitle page={props.stands_page} />
      )}

      {/* TODO: Complete technical implementation of the LivePlayer */}
      <LivePlayer stand={{}} />
      {mainCollaborator && (
        <HSPGrid>
          {props.stands
            ?.filter(
              (stand) => stand && stand.company.id === mainCollaborator.id
            )
            .map((stand) => (
              <StandCard
                stand={stand!}
                key={mainCollaborator.id}
                time={time}
                type={'hsp'}
              />
            ))}
        </HSPGrid>
      )}
      <SPGrid>
        {props.stands
          ?.filter(
            (stand) => stand && collaboratorsIds().includes(stand.company.id)
          )
          .map((stand) => (
            <StandCard key={stand?.id} stand={stand!} time={time} type={'sp'} />
          ))}
      </SPGrid>

      <StandGrid>
        {props.stands
          ?.filter(
            (stand) =>
              stand &&
              currentDayCompaniesIds().includes(stand.company.id) &&
              !collaboratorsIds().includes(stand.company.id) &&
              stand.company.id !== mainCollaborator?.id
          )
          .map((stand) => (
            <StandCard
              key={stand?.id}
              stand={stand!}
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
      stands {
        id
        company {
          id
        }
        ...StandCard_stand
      }
      currentMetaData {
        startDate
        endDate
        mainCollaborator {
          id
        }
        collaborators {
          id
        }
        companiesFirstDay {
          id
          name
        }
        companiesLastDay {
          id
          name
        }
      }

      stands_page: page(slug: "stands") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props && props.stands_page,
  }),
});
