import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Company } from '../../testing/companyMock';
import * as _ from 'lodash';
import { NudgeDiv } from '../Styled';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type Package = "standard" | "sp" | "hsp";
interface IStandCard {
  active: boolean;
  company: any;
  id: string;
  // TODO: Import the Event-type
  events: any;
  time: number;
  type: Package;
}

interface ILive {
  active: boolean;
}

const timeIsBetween = (
  time: number,
  start: string,
  end: string,
  date: string
) => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const e = dayjs(`${end} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isBefore(now) && e.isAfter(now);
};

const getCurrentEvent = (events: any[], time: number) => {
  const currentEvent = events.find((event) =>
    timeIsBetween(time, event.timeStart, event.timeEnd, event.date)
  );
  return currentEvent ?? null;
};

const eventTime = (event: any) => {
  const timeRange = event
    ? `${event.timeStart.slice(0, 5)} - ${event.timeEnd.slice(0, 5)}`
    : '';
  const eventTitle = _.truncate(event ? event.title : '💁🏼‍♀️', {
    length: 50,
  });
  return {
    timeRange,
    eventTitle,
  };
};

const StandCard = ({ active, company, id, events, time, type }: IStandCard) => {
  const [currentEvent, setCurrentEvent] = useState();
  const router = useRouter();

  const handleRedirect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    router.push(`/stands/[id]`, `/stands/${id}`);
  };

  useEffect(() => {
    setCurrentEvent(() => getCurrentEvent(events, time));
  }, [time]);

  return (
    type === "standard" ?
    <StandardContainer scale={1.03} onClick={handleRedirect}>
      <FirstRow>
        <CompanyImgContainer>
          <CompanyImg src={company.logo} />
        </CompanyImgContainer>
        <Live active={active} />
      </FirstRow>
      <Divider />
      <CompanyInfo>
        <SubHeader>{company.name}</SubHeader>
        <CurrentEvent>
          <TimeSlot>{eventTime(currentEvent).timeRange}</TimeSlot>
          <EventTitle>{eventTime(currentEvent).eventTitle}</EventTitle>
        </CurrentEvent>
      </CompanyInfo>
    </StandardContainer> :
    <SPContainer scale={1.03} onClick={handleRedirect}>
      <FirstRow>
        <CompanyImgContainer>
          <CompanyImg src={company.logo} />
        </CompanyImgContainer>
        <Live active={active} />
      </FirstRow>
      <Divider />
      <CompanyInfo>
        <SubHeader>{company.name}</SubHeader>
        <CurrentEvent>
          <TimeSlot>{eventTime(currentEvent).timeRange}</TimeSlot>
          <EventTitle>{eventTime(currentEvent).eventTitle}</EventTitle>
        </CurrentEvent>
      </CompanyInfo>
    </SPContainer>
  );
};

const Live: React.FC<ILive> = ({ active }) => (
  <LiveContainer active={active}>LIVE</LiveContainer>
);

const Divider = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #f1f1f1;
  flex-shrink: 0;
`;

const EventTitle = styled.span`
`;

const StandardContainer = styled(NudgeDiv)`
  display: flex;
  flex-direction: column;
  max-width: 293px;
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
  height: 180px;

  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CompanyImgContainer = styled.div`
  display: flex;
  height: 60px;
  width: 70%;
`;

const CompanyImg = styled.img`
  object-fit: contain;
`;

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

const TimeSlot = styled.span`
  font-weight: 200;
`;

const LiveContainer = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;

  height: 40%;

  padding: 4px;
  border: 1px solid ${(props) => (props.active ? 'red' : 'grey')};
  border-radius: 3px;
  color: ${(props) => (props.active ? 'red' : 'grey')};
  text-align: center;

  stroke: 2px;
  text-decoration: ${(props) => (props.active ? 'none' : 'line-through')};
`;

export default StandCard;