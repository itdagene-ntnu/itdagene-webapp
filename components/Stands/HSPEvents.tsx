import React from 'react';
import styled from 'styled-components';
import { timeIsAfterNow } from '../../utils/time';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import { eventTime, EventTitle, standEvent, TimeSlot } from './StandCard';

interface HSPEventsProps {
  stand: StandCard_stand;
  time: number;
  currentEvent: standEvent | null;
}

const HSPEvents = ({ stand, time, currentEvent }: HSPEventsProps) => {
  const relevantEvents = stand?.events.filter(
    (event) =>
      event != null && timeIsAfterNow(time, event.timeStart, event.date)
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
        <TimeSlot current={true}>{eventTime(currentEvent).timeRange}</TimeSlot>
        <EventTitle>{eventTime(currentEvent, 200).eventTitle}</EventTitle>
      </EventGrid>
      {renderRelevantEvents()}
    </>
  ) : (
    <>{renderRelevantEvents()}</>
  );
};

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  padding-bottom: 8px;
`;

export default HSPEvents;
