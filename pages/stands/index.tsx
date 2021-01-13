import React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { useEffect, useState } from 'react';
import StandCard, { ArrayElement } from '../../components/Stands/StandCard';
import {
  currentDayCompanies,
  timeIsAfterNow,
  timeIsBetween,
} from '../../utils/time';
import LivePlayer from '../../components/Stands/LivePlayer';
import FeaturedEvents from '../../components/Stands/FeaturedEvents';
import dayjs, { Dayjs } from 'dayjs';

// Update the currentEvent-list every 30 sec
const intervalLength = 1000 * 30;

const getFeaturedEventStands = (
  time: Dayjs,
  stands: stands_QueryResponse['stands']
): stands_QueryResponse['stands'] => {
  const featuredStands = stands?.filter(
    (stand) => stand && currentFeaturedEvent(time, stand)
  );
  return featuredStands ?? [];
};

type FeaturedEvent = ArrayElement<
  NonNullable<
    NonNullable<
      ArrayElement<NonNullable<stands_QueryResponse['stands']>>
    >['events']
  >
>;

export const currentFeaturedEvent = (
  time: Dayjs,
  stand: ArrayElement<NonNullable<stands_QueryResponse['stands']>>
): FeaturedEvent | null => {
  const featuredEvent = stand?.events?.find(
    (event) =>
      event.type === 'A_7' &&
      timeIsBetween(time, event.timeStart, event.timeEnd, event.date)
  );

  return featuredEvent ?? null;
};

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  const [time, setTime] = useState(dayjs());
  const [featuredEventStands, setFeaturedEventStands] = useState<
    stands_QueryResponse['stands'] | any[]
  >([]);

  const {
    mainCollaborator,
    collaborators,
    startDate,
    endDate,
  } = props.currentMetaData;

  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), intervalLength);
    return (): void => clearInterval(interval);
  }, [props.currentMetaData]);

  useEffect(() => {
    const updatedFeaturedStands = getFeaturedEventStands(time, props.stands);
    if (updatedFeaturedStands) {
      setFeaturedEventStands(updatedFeaturedStands);
    }
  }, [props.stands, time]);

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

      {props.stands &&
        featuredEventStands &&
        featuredEventStands.length > 0 && (
          <FeaturedEvents time={time} stands={featuredEventStands} />
        )}

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

export const StandGrid = styled('div')`
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
        events {
          title
          date
          timeStart
          timeEnd
          type
        }
        company {
          id
        }
        ...StandCard_stand
        ...FeaturedEventCard_stand
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
