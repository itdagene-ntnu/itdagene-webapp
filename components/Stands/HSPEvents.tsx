import { Dayjs } from 'dayjs';
import React from 'react';
import styled from 'styled-components';
import { timeIsAfter, toDayjs } from '../../utils/time';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import {
  eventTime,
  EventTitle,
  standEvent,
  standEvents,
  TimeSlot,
} from './StandCard';

interface HSPEventsProps {
  stand: StandCard_stand;
  time: Dayjs;
  currentEvent: standEvent | null;
}

interface RelevantEventsProps {
  events: standEvents;
}

const RelevantEvents = ({ events }: RelevantEventsProps): JSX.Element => (
  <>
    {events.slice(Math.max(events.length - 3, 0)).map((event) => (
      <EventGrid key={event?.id}>
        <TimeSlot>{eventTime(event).timeRange}</TimeSlot>
        <EventTitle>{eventTime(event, 200).eventTitle}</EventTitle>
      </EventGrid>
    ))}
  </>
);

const HSPEvents = ({
  stand,
  time,
  currentEvent,
}: HSPEventsProps): JSX.Element => {
  const relevantEvents =
    stand?.events &&
    stand.events.filter(
      (event) =>
        event &&
        timeIsAfter({ time: time, start: toDayjs(event.date, event.timeStart) })
    );

  return currentEvent ? (
    <>
      <EventGrid>
        <TimeSlot current={true}>{eventTime(currentEvent).timeRange}</TimeSlot>
        <EventTitle>{eventTime(currentEvent, 200).eventTitle}</EventTitle>
      </EventGrid>
      <RelevantEvents events={relevantEvents ?? []} />
    </>
  ) : (
    <RelevantEvents events={relevantEvents ?? []} />
  );
};

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  padding-bottom: 8px;
`;

export default HSPEvents;
