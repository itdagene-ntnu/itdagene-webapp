import React from 'react';
import styled from 'styled-components';
import { eventTime, toDayjs } from '../../utils/time';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import LiveIndicator from './LiveIndicator';
import { CompanyImg, EventTitle, standEvent, TimeSlot } from './StandCard';

interface CompanyCardContentProps {
  stand: StandCard_stand;
  currentEvent: standEvent | null;
}

const CompanyCardContent = ({
  stand,
  currentEvent,
}: CompanyCardContentProps): JSX.Element => (
  <>
    <FirstRow>
      <CompanyImgContainer>
        <CompanyImg src={stand.company.logo ?? ''} />
      </CompanyImgContainer>
      <LiveIndicator active={stand.active} />
    </FirstRow>
    <Divider />
    <CompanyInfo>
      <SubHeader>{stand.company.name}</SubHeader>
      <CurrentEvent>
        {currentEvent && (
          <TimeSlot>
            {eventTime({
              start: toDayjs(currentEvent.date, currentEvent.timeStart),
              end: toDayjs(currentEvent.date, currentEvent.timeEnd),
            })}
          </TimeSlot>
        )}
        <EventTitle>{currentEvent ? currentEvent.title : '🤷🏼‍♀️'}</EventTitle>
      </CurrentEvent>
    </CompanyInfo>
  </>
);

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

const CurrentEvent = styled.div`
  display: flex;
  flex-direction: column;
  color: #555;
`;

export const SubHeader = styled.span`
  font-weight: 600;
`;

export const CompanyInfo = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #f1f1f1;
  flex-shrink: 0;
`;

export default CompanyCardContent;
