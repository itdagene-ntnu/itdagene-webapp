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

type Company = NonNullable<
  stands_QueryResponse['currentMetaData']['companiesFirstDay']
>[number];

type Stands = NonNullable<stands_QueryResponse['stands']>;

const getFeaturedEventStands = (
  time: Dayjs,
  stands: stands_QueryResponse['stands'],
  currentDayCompaniesIds: string[]
): NonNullable<stands_QueryResponse['stands']> => {
  const featuredStands = stands?.filter(
    (stand) =>
      currentDayCompaniesIds.includes(stand.company.id) &&
      currentFeaturedEvent(time, stand)
  );
  return featuredStands ?? [];
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

const seed = dayjs().format('YYYYMMDDHHmm');

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<stands_QueryResponse>): JSX.Element => {
  const [time, setTime] = useState(dayjs());

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

  let companies: Companies = [];
  if (isRespectiveDate(toDayjs(startDate)) && companiesFirstDay) {
    companies = companiesFirstDay;
  } else if (isRespectiveDate(toDayjs(endDate)) && companiesLastDay) {
    companies = companiesLastDay;
  }

  const isCollaborator = (company: Company): boolean =>
    !!collaborators?.some((c) => c.id === company.id);

  const companyIds = companies.map((c) => c.id);

  const featuredEventStands = getFeaturedEventStands(
    time,
    props.stands,
    companyIds
  );

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
        <BorderlessSection noPadding>
          <PageView hideDate hideTitle page={props.stands_page} />
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
        {stands && featuredEventStands.length > 0 && (
          <FeaturedEvents time={time} stands={featuredEventStands} />
        )}

        {mainCollaborator && (
          <HSPGrid>
            {stands
              ?.filter(
                (stand) =>
                  stand &&
                  companyIds.includes(stand.company.id) &&
                  stand.company.id === mainCollaborator.id
              )
              .map((stand) => (
                <StandCard
                  key={stand.id}
                  stand={stand}
                  time={time}
                  type="hsp"
                />
              ))}
          </HSPGrid>
        )}

        <SPGrid>
          {stands
            ?.filter(
              (stand) =>
                stand &&
                companyIds.includes(stand.company.id) &&
                isCollaborator(stand.company)
            )
            .map((stand) => (
              <StandCard key={stand.id} stand={stand} time={time} type="sp" />
            ))}
        </SPGrid>

        <StandGrid>
          {stands
            ?.filter(
              (stand) =>
                stand &&
                companyIds.includes(stand.company.id) &&
                !isCollaborator(stand.company) &&
                stand.company.id !== mainCollaborator?.id
            )
            .map((stand) => (
              <StandCard
                key={stand.id}
                stand={stand}
                time={time}
                type="standard"
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
