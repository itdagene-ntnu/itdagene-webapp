import React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import styled from 'styled-components';

import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { useEffect, useState } from 'react';
import StandCard, { ArrayElement } from '../../components/Stands/StandCard';
import {
  isRespectiveDate,
  timeIsAfter,
  timeIsBetween,
  toDayjs,
} from '../../utils/time';
import LivePlayer from '../../components/Stands/LivePlayer';
import FeaturedEvents from '../../components/Stands/FeaturedEvents';
import dayjs, { Dayjs } from 'dayjs';
import StandsDefault from '../../components/Stands/StandsDefault';
import { BorderlessSection } from '../../components/Styled';
import { seedShuffle } from '../../utils/random';

// Update the currentEvent-list every 30 sec
const intervalLength = 1000 * 30;

type FeaturedEvent = ArrayElement<
  NonNullable<
    NonNullable<
      ArrayElement<NonNullable<stands_QueryResponse['stands']>>
    >['events']
  >
>;

type Companies =
  | stands_QueryResponse['currentMetaData']['companiesFirstDay']
  | stands_QueryResponse['currentMetaData']['companiesLastDay']
  | stands_QueryResponse['currentMetaData']['collaborators'];

type Stands = NonNullable<stands_QueryResponse['stands']>;

const getFeaturedEventStands = (
  time: Dayjs,
  stands: stands_QueryResponse['stands'],
  currentDayCompaniesIds: string[]
): stands_QueryResponse['stands'] => {
  const featuredStands = stands?.filter(
    (stand) =>
      stand &&
      currentDayCompaniesIds.includes(stand.company.id) &&
      currentFeaturedEvent(time, stand)
  );
  return featuredStands ?? [];
};

const getCurrentDayCompaniesIds = (
  startDate: string,
  endDate: string,
  companiesFirstDay: Companies,
  companiesLastDay: Companies
): string[] => {
  if (isRespectiveDate(toDayjs(startDate))) {
    return companyIds(companiesFirstDay);
  } else if (isRespectiveDate(toDayjs(endDate))) {
    return companyIds(companiesLastDay);
  }
  return [];
};

export const currentFeaturedEvent = (
  time: Dayjs,
  stand: ArrayElement<NonNullable<stands_QueryResponse['stands']>>
): FeaturedEvent | null => {
  const featuredEvent = stand.events?.find(
    (event) =>
      event.type === 'A_7' &&
      timeIsBetween({
        time: time,
        start: toDayjs(event.date, event.timeStart),
        end: toDayjs(event.date, event.timeEnd),
      })
  );

  return featuredEvent ?? null;
};

const companyIds = (companies: Companies): string[] =>
  companies ? companies.map((company) => company.id) : [];

const seed = dayjs().format('YYYYMMDDHHmm');

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  const [time, setTime] = useState(dayjs());
  const [featuredEventStands, setFeaturedEventStands] = useState<
    stands_QueryResponse['stands']
  >([]);
  const [currentDayCompaniesIds, setCurrentDayCompaniesIds] = useState<
    string[]
  >([]);

  const {
    mainCollaborator,
    collaborators,
    companiesFirstDay,
    companiesLastDay,
    startDate,
    endDate,
  } = props.currentMetaData;

  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), intervalLength);
    return (): void => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatedCurrentDayCompaniesIds = getCurrentDayCompaniesIds(
      startDate,
      endDate,
      companiesFirstDay,
      companiesLastDay
    );

    const updatedFeaturedStands = getFeaturedEventStands(
      time,
      props.stands,
      updatedCurrentDayCompaniesIds
    );

    if (updatedCurrentDayCompaniesIds)
      setCurrentDayCompaniesIds(updatedCurrentDayCompaniesIds);
    if (updatedFeaturedStands) setFeaturedEventStands(updatedFeaturedStands);
  }, [
    time,
    props.stands,
    startDate,
    endDate,
    companiesFirstDay,
    companiesLastDay,
  ]);

  const stands =
    props.stands && seedShuffle<Stands[number]>(props.stands, seed);

  return timeIsAfter({
    time: time,
    start: toDayjs(props.currentMetaData.startDate, '09:30:00'),
  }) ? (
    <BorderlessSection>
      <StandsDefault currentMetaData={props.currentMetaData} />
    </BorderlessSection>
  ) : (
    <>
      {props.stands_page && (
        <BorderlessSection>
          <PageView hideContent hideDate hideTitle page={props.stands_page} />
        </BorderlessSection>
      )}

      {props.itdagene_stand && (
        <LiveContentSection>
          <LivePlayer
            livestreamUrl={props.itdagene_stand.livestreamUrl}
            qaUrl={props.itdagene_stand.qaUrl}
          />
        </LiveContentSection>
      )}
      <BorderlessSection>
        {stands && featuredEventStands && featuredEventStands.length > 0 && (
          <FeaturedEvents time={time} stands={featuredEventStands} />
        )}

        {mainCollaborator && (
          <HSPGrid>
            {stands
              ?.filter(
                (stand) =>
                  stand &&
                  currentDayCompaniesIds.includes(stand.company.id) &&
                  stand.company.id === mainCollaborator.id
              )
              .map((stand) => (
                <StandCard
                  key={stand.id}
                  stand={stand}
                  time={time}
                  type={'standard'}
                />
              ))}
          </HSPGrid>
        )}

        <SPGrid>
          {stands
            ?.filter(
              (stand) =>
                stand &&
                currentDayCompaniesIds.includes(stand.company.id) &&
                companyIds(collaborators).includes(stand.company.id)
            )
            .map((stand) => (
              <StandCard key={stand.id} stand={stand} time={time} type={'sp'} />
            ))}
        </SPGrid>

        <StandGrid>
          {stands
            ?.filter(
              (stand) =>
                stand &&
                currentDayCompaniesIds.includes(stand.company.id) &&
                !companyIds(collaborators).includes(stand.company.id) &&
                stand.company.id !== mainCollaborator?.id
            )
            .map((stand) => (
              <StandCard
                key={stand.id}
                stand={stand}
                time={time}
                type={'standard'}
              />
            ))}
        </StandGrid>
      </BorderlessSection>
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

const LiveContentSection = styled.div`
  margin: 0 2em 30px 2em;

  @media only screen and (max-width: 767px) {
    margin: 0 1em 30px 1em;
  }
`;

export default withDataAndLayout(Index, {
  query: graphql`
    query stands_Query {
      stands {
        id
        events {
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
        ...StandsDefault_currentMetaData
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
        }
        companiesLastDay {
          id
        }
      }

      stands_page: page(slug: "stands") {
        ...PageView_page
        ...metadata_metadata
      }

      itdagene_stand: stand(slug: "itdagene") {
        livestreamUrl
        qaUrl
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: false,
    metadata: props && props.stands_page,
  }),
});
