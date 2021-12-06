import React from 'react';
import styled from 'styled-components';
import { NudgeDiv } from '../Styled';
import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { timeIsBetween, toDayjs } from '../../utils/time';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import HSPEvents from './HSPEvents';
import CompanyCardContent from './CompanyCardInfo';
import LiveIndicator from './LiveIndicator';

dayjs.extend(customParseFormat);

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType[number];
type Package = 'standard' | 'sp' | 'hsp';
export type standEvents = NonNullable<StandCard_stand['events']>;
export type standEvent = ArrayElement<standEvents>;
interface StandCardProps {
  type: Package;
  time: Dayjs;
  stand: StandCard_stand;
}

export const getCurrentEvent = (
  events: standEvents | null,
  time: Dayjs
): standEvent | null => {
  const currentEvent = events?.find(
    (event) =>
      event &&
      timeIsBetween({
        time: time,
        start: toDayjs(event.date, event.timeStart),
        end: toDayjs(event.date, event.timeEnd),
      })
  );
  return currentEvent ?? null;
};

const StandCardWrapper = ({
  stand,
  time,
  type,
}: StandCardProps): JSX.Element => {
  const router = useRouter();
  return (
    <StandCard
      stand={stand}
      time={time}
      type={type}
      onClick={(): Promise<boolean> => router.push(`/stands/${stand.slug}`)}
    />
  );
};

const StandCard = ({
  stand,
  time,
  type,
  onClick,
}: StandCardProps & { onClick: () => Promise<boolean> }): JSX.Element => {
  const currentEvent = getCurrentEvent(stand.events ?? [], time);

  switch (type) {
    case 'hsp':
      return (
        <>
          <HSPContainerDesktop scale={1.03} onClick={onClick}>
            <HSPCompanyImgContainer>
              <CompanyImg src={stand.company.logo ?? ''} />
            </HSPCompanyImgContainer>
            <FlexContainer>
              <CompanyEvents>
                <HSPEvents
                  stand={stand}
                  time={time}
                  currentEvent={currentEvent}
                />
              </CompanyEvents>
              <LiveIndicator active={stand.active} />
            </FlexContainer>
          </HSPContainerDesktop>
          <HSPContainerMobile scale={1.03}>
            <CompanyCardContent stand={stand} currentEvent={currentEvent} />
          </HSPContainerMobile>
        </>
      );
    case 'sp':
      return (
        <SPContainer scale={1.03} onClick={onClick}>
          <CompanyCardContent stand={stand} currentEvent={currentEvent} />
        </SPContainer>
      );
    case 'standard':
      return (
        <StandardContainer scale={1.03} onClick={onClick}>
          <CompanyCardContent stand={stand} currentEvent={currentEvent} />
        </StandardContainer>
      );

    default:
      return (
        <StandardContainer scale={1.03} onClick={onClick}>
          <CompanyCardContent stand={stand} currentEvent={currentEvent} />
        </StandardContainer>
      );
  }
};

export const StandardContainer = styled(NudgeDiv)`
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  height: 190px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
  cursor: pointer;
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
  display: grid;
  margin-bottom: 25px;
  grid-column: -1/1;
  grid-template-columns: 40% 60%;
`;

const HSPContainerMobile = styled(HSPContainer)`
  display: flex;
  @media only screen and (min-width: 1200px) {
    display: none;
  } ;
`;

const HSPContainerDesktop = styled(HSPContainer)`
  display: grid;
  @media only screen and (max-width: 1199px) {
    display: none;
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
export const EventTitle = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const TimeSlot = styled.span<{ current?: boolean }>`
  font-weight: ${(props): number => (props.current ? 600 : 200)};
`;

export default createFragmentContainer(StandCardWrapper, {
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
        name
      }
    }
  `,
});
