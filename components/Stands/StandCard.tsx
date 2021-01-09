import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { NudgeDiv } from '../Styled';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { timeIsBetween, timeIsAfter } from '../../utils/time';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandCard_company } from '../../__generated__/StandCard_company.graphql';

dayjs.extend(customParseFormat);

type Package = 'standard' | 'sp' | 'hsp';
interface StandCardProps {
  type: Package;
  time: number;
  company: StandCard_company;
}

interface LiveProps {
  active: boolean;
}

const getCurrentEvent = (events: any, time: number) => {
  const currentEvent = events.find((event: any) =>
    timeIsBetween(time, event.timeStart, event.timeEnd, event.date)
  );
  return currentEvent ?? null;
};

const eventTime = (event: any, truncLength = 50) => {
  const timeRange = event
    ? `${event.timeStart.slice(0, 5)} - ${event.timeEnd.slice(0, 5)}`
    : '';
  const eventTitle = _.truncate(event ? event.title : '💁🏼‍♀️', {
    length: truncLength,
  });
  return {
    timeRange,
    eventTitle,
  };
};

const StandCard = ({ company, time, type }: StandCardProps) => {
  const [currentEvent, setCurrentEvent] = useState();
  const router = useRouter();
  const [shouldBreak, setShouldBreak] = React.useState(false);

  useEffect(() => {
    function onWidthChange(e) {
      if (!shouldBreak && e.target.innerWidth <= 1199) {
        setShouldBreak(true);
      } else if (shouldBreak && e.target.innerWidth > 1199) {
        setShouldBreak(false);
      }
    }

    window.innerWidth > 1199 ? setShouldBreak(false) : setShouldBreak(true);

    window.addEventListener('resize', onWidthChange);
    return () => {
      window.removeEventListener('resize', onWidthChange);
    };
  });

  useEffect(() => {
    setCurrentEvent(() => getCurrentEvent(company.stand?.events ?? [], time));
  }, [time]);

  const handleRedirect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    router.push(`/stands/[id]`, `/stands/${company.stand?.slug}`);
  };

  const renderHSPEvents = () => {
    const relevantEvents = company.stand?.events.filter(
      (event) => event != null && timeIsAfter(time, event.timeStart, event.date)
    );

    const renderRelevantEvents = () =>
      relevantEvents
        ?.slice(Math.max(relevantEvents.length - 3, 0))
        .map((event) => (
          <EventGrid>
            <TimeSlot>{eventTime(event).timeRange}</TimeSlot>
            <EventTitle>{eventTime(event, 200).eventTitle}</EventTitle>
          </EventGrid>
        ));

    return currentEvent ? (
      <>
        <EventGrid>
          <TimeSlot current={true}>
            {eventTime(currentEvent).timeRange}
          </TimeSlot>
          <EventTitle>{eventTime(currentEvent, 200).eventTitle}</EventTitle>
        </EventGrid>
        {renderRelevantEvents()}
      </>
    ) : (
      renderRelevantEvents()
    );
  };

  const CompanyCardContent = (
    <>
      <FirstRow>
        <CompanyImgContainer>
          <CompanyImg src={company.logo ?? ''} />
        </CompanyImgContainer>
        <Live active={company.stand?.active ?? false} />
      </FirstRow>
      <Divider />
      <CompanyInfo>
        <SubHeader>{company.name}</SubHeader>
        <CurrentEvent>
          <TimeSlot>{eventTime(currentEvent).timeRange}</TimeSlot>
          <EventTitle>{eventTime(currentEvent).eventTitle}</EventTitle>
        </CurrentEvent>
      </CompanyInfo>
    </>
  );

  return type === 'hsp' ? (
    !shouldBreak ? (
      <HSPContainer scale={1.03} onClick={handleRedirect}>
        <HSPCompanyImgContainer>
          <HSPCompanyImg src={company.logo ?? ''} />
        </HSPCompanyImgContainer>
        <FlexContainer>
          <CompanyEvents>{renderHSPEvents()}</CompanyEvents>
          <Live active={company.stand?.active ?? false} />
        </FlexContainer>
      </HSPContainer>
    ) : (
      <HSPContainer scale={1.03} onClick={handleRedirect}>
        {CompanyCardContent}
      </HSPContainer>
    )
  ) : type === 'sp' ? (
    <SPContainer scale={1.03} onClick={handleRedirect}>
      {CompanyCardContent}
    </SPContainer>
  ) : (
    <StandardContainer scale={1.03} onClick={handleRedirect}>
      {CompanyCardContent}
    </StandardContainer>
  );
};

const Live: React.FC<LiveProps> = ({ active }) => (
  <LiveContainer active={active}>LIVE</LiveContainer>
);

const Divider = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #f1f1f1;
  flex-shrink: 0;
`;

const EventTitle = styled.span``;

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
  }  ;
`;

const CompanyEvents = styled.div`
  align-self: center;
  padding: 0 20px 0 20px;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CompanyImgContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 60px;
  width: 70%;
`;

const HSPCompanyImgContainer = styled.div`
  display: flex;
  padding: 20px;
  border-right: 1.5px solid #f1f1f1;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  padding-bottom: 8px;
`;

const CompanyImg = styled.img`
  object-fit: contain;
  width: auto;
  height: 100%;
`;

const HSPCompanyImg = styled(CompanyImg)``;

const CompanyInfo = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const CurrentEvent = styled.div`
  display: flex;
  flex-direction: column;
  color: #555;
`;

const SubHeader = styled.span`
  font-weight: 600;
`;

const TimeSlot = styled.span<{ current?: boolean }>`
  font-weight: ${(props) => (props.current ? 600 : 200)};
`;

const LiveContainer = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  flex: 0 0 50px;
  height: 25px;
  padding: 4px;
  border-radius: 3px;
  text-align: center;
  stroke: 2px;
  border: 1px solid ${(props) => (props.active ? 'red' : 'grey')};
  color: ${(props) => (props.active ? 'red' : 'grey')};
  text-decoration: ${(props) => (props.active ? 'none' : 'line-through')};
`;

export default createFragmentContainer(StandCard, {
  company: graphql`
    fragment StandCard_company on Company {
      name
      id
      description
      url
      logo
      stand {
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
          location
        }
      }
    }
  `,
});
