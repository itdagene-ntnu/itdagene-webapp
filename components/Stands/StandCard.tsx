import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { NudgeDiv } from '../Styled';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { timeIsBetween } from '../../utils/time';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import HSPEvents from './HSPEvents';
import CompanyCardContent from './CompanyCardInfo';
import LiveIndicator from './LiveIndicator';

dayjs.extend(customParseFormat);

type Package = 'standard' | 'sp' | 'hsp';
export type standEvents = StandCard_stand['events'];
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
export type standEvent = ArrayElement<standEvents>;
interface StandCardProps {
  type: Package;
  time: number;
  stand: StandCard_stand;
}

const getCurrentEvent = (
  events: standEvents,
  time: number
): standEvent | null => {
  const currentEvent = events.find(
    (event) =>
      event && timeIsBetween(time, event.timeStart, event.timeEnd, event.date)
  );
  return currentEvent ?? null;
};

interface EventInfo {
  timeRange: string;
  eventTitle: string;
}

export const eventTime = (event: standEvent, truncLength = 50): EventInfo => {
  const dayTimeStart = dayjs(event?.timeStart, 'HH:mm:ss').format('HH:mm');
  const dayTimeEnd = dayjs(event?.timeEnd, 'HH:mm:ss').format('HH:mm');

  const timeRange = event ? `${dayTimeStart} - ${dayTimeEnd}` : '';

  const eventTitle = _.truncate(event ? event.title : '💁🏼‍♀️', {
    length: truncLength,
  });
  return {
    timeRange,
    eventTitle,
  };
};

const StandCard = ({ stand, time, type }: StandCardProps): JSX.Element => {
  const [currentEvent, setCurrentEvent] = useState<standEvent | null>();
  const router = useRouter();
  const [shouldBreak, setShouldBreak] = React.useState(false);

  useEffect(() => {
    function onWidthChange(e: any): void {
      if (!shouldBreak && e.target.innerWidth <= 1199) {
        setShouldBreak(true);
      } else if (shouldBreak && e.target.innerWidth > 1199) {
        setShouldBreak(false);
      }
    }
    window.innerWidth > 1199 ? setShouldBreak(false) : setShouldBreak(true);
    window.addEventListener('resize', onWidthChange);
    return (): void => {
      window.removeEventListener('resize', onWidthChange);
    };
  }, [shouldBreak]);

  useEffect(() => {
    const newCurrentEvent = getCurrentEvent(stand?.events ?? [], time);
    setCurrentEvent(newCurrentEvent);
  }, [time, stand]);

  const handleRedirect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    router.push(`/stands/[id]`, `/stands/${stand?.slug}`);
  };

  switch (type) {
    case 'hsp':
      return !shouldBreak ? (
        <HSPContainer scale={1.03} onClick={handleRedirect}>
          <HSPCompanyImgContainer>
            <HSPCompanyImg src={stand?.company.logo ?? ''} />
          </HSPCompanyImgContainer>
          <FlexContainer>
            <CompanyEvents>
              <HSPEvents
                stand={stand}
                time={time}
                currentEvent={currentEvent ?? null}
              />
            </CompanyEvents>
            <LiveIndicator active={stand?.active ?? false} />
          </FlexContainer>
        </HSPContainer>
      ) : (
        <HSPContainer scale={1.03} onClick={handleRedirect}>
          <CompanyCardContent
            stand={stand}
            currentEvent={currentEvent ?? null}
          />
        </HSPContainer>
      );
    case 'sp':
      return (
        <SPContainer scale={1.03} onClick={handleRedirect}>
          <CompanyCardContent
            stand={stand}
            currentEvent={currentEvent ?? null}
          />
        </SPContainer>
      );
    case 'standard':
      return (
        <StandardContainer scale={1.03} onClick={handleRedirect}>
          <CompanyCardContent
            stand={stand}
            currentEvent={currentEvent ?? null}
          />
        </StandardContainer>
      );

    default:
      return (
        <StandardContainer scale={1.03} onClick={handleRedirect}>
          <CompanyCardContent
            stand={stand}
            currentEvent={currentEvent ?? null}
          />
        </StandardContainer>
      );
  }
};

const StandardContainer = styled(NudgeDiv)`
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  height: 180px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
`;

const SPContainer = styled(StandardContainer)`
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  flex: 1 1 300px;
  height: 180px;
  margin: var(--gap) 0 0 var(--gap);
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
`;

const HSPContainer = styled(SPContainer)`
  margin-bottom: 25px;
  grid-column: -1/1;
  display: grid;
  grid-template-columns: 40% 60%;
  @media only screen and (max-width: 1199px) {
    display: flex;
  } ;
`;

const CompanyEvents = styled.div`
  align-self: center;
  width: 100%;
  padding: 0 20px 0 20px;
`;

const HSPCompanyImgContainer = styled.div`
  display: flex;
  padding: 20px;
  border-right: 1.5px solid #f1f1f1;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CompanyImg = styled.img`
  object-fit: contain;
  width: auto;
  height: 100%;
`;

const HSPCompanyImg = styled(CompanyImg)``;

export const EventTitle = styled.span``;

export const TimeSlot = styled.span<{ current?: boolean }>`
  font-weight: ${(props): number => (props.current ? 600 : 200)};
`;

export default createFragmentContainer(StandCard, {
  stand: graphql`
    fragment StandCard_stand on Stand {
      id
      slug
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
      }
      company {
        id
        logo
      }
    }
  `,
});
