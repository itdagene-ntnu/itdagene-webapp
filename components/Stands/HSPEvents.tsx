import { Dayjs } from 'dayjs';
import { sortBy } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { eventTime, timeIsAfter, toDayjs } from '../../utils/time';
import { StandCard_stand } from '../../__generated__/StandCard_stand.graphql';
import { EventTitle, standEvent, standEvents, TimeSlot } from './StandCard';

interface HSPEventsProps {
  stand: StandCard_stand;
  time: Dayjs;
  currentEvent: standEvent | null;
}

interface RelevantEventsProps {
  events: standEvents;
}

const RelevantEvents = ({ events }: RelevantEventsProps): JSX.Element => {
  return (
    <>
      {events.slice(0, 3).map((event) => (
        <EventGrid key={event?.id}>
          <TimeSlot>
            {eventTime({
              start: toDayjs(event.date, event.timeStart),
              end: toDayjs(event.date, event.timeEnd),
            })}
          </TimeSlot>
          <EventTitle>{event.title}</EventTitle>
        </EventGrid>
      ))}
    </>
  );
};

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

  const sortedEvents = sortBy(relevantEvents, ['date', 'timeStart']);

  return currentEvent ? (
    <>
      <EventGrid>
        <TimeSlot current={true}>
          {eventTime({
            start: toDayjs(currentEvent.date, currentEvent.timeStart),
            end: toDayjs(currentEvent.date, currentEvent.timeEnd),
          })}
        </TimeSlot>
        <EventTitle>{currentEvent.title}</EventTitle>
      </EventGrid>
      <RelevantEvents events={sortedEvents ?? []} />
    </>
  ) : (
    <RelevantEvents events={sortedEvents ?? []} />
  );
};

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  padding-bottom: 8px;
`;

export default HSPEvents;
