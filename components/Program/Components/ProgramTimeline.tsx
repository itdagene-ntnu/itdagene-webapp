import { useEffect, useState } from 'react';
import { eventTime, toDayjs } from '../../../utils/time';
import styled from 'styled-components';
import { itdageneBlue } from '../../../utils/colors';

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

import { Collapse, Text } from '@nextui-org/react';

import Flex from '../../Styled/Flex';

import { isMobile } from 'react-device-detect';

type ProgramTimelineProps = {
  activeDate: string;
  events: any;
  activeEventId: string;
  setActiveEvent: (eventId: string) => void;
};

const Card = styled.div<{ active?: boolean }>`
  box-shadow: 0 0 0.75rem #ddd;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-radius: 0.75rem;
  background-color: ${(props): string =>
    props.active ? itdageneBlue : 'none'};
  color: ${(props): string => (props.active ? '#fff' : 'black')};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
`;

const DesktopProgramTimeline = ({
  activeDate,
  events,
  activeEventId,
  setActiveEvent,
}: ProgramTimelineProps): JSX.Element => {
  const currentEvent = activeDate
    ? Object.values(events)
        .flat()
        .find((event: any) => event.id === activeEventId)
    : null;
  return (
    <Grid>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.5,
          },
        }}
      >
        {activeDate &&
          events[activeDate].map((event: any) => (
            <TimelineItem key={activeDate + event.id}>
              <TimelineOppositeContent
                style={{ margin: 'auto 0', padding: '0 1rem', color: 'grey' }}
              >
                {`${eventTime({
                  start: toDayjs(event.date, event.timeStart),
                  end: toDayjs(event.date, event.timeEnd),
                })}`}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="inherit"></TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent style={{ padding: '5px 1rem 5px 2rem' }}>
                <Card
                  active={activeEventId === event.id}
                  onClick={(): void => setActiveEvent(event.id)}
                >
                  <Flex flexDirection="column">
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>
                      {event.title}
                    </h3>
                    <Flex
                      style={{
                        color: activeEventId === event.id ? '#eee' : 'grey',
                      }}
                      alignItems="center"
                    >
                      {/* eslint-disable-next-line*/}
                      {/* @ts-ignore*/}
                      <ion-icon
                        style={{
                          color:
                            activeEventId === event.id ? '#eee' : '#156493',
                        }}
                        name="location-sharp"
                      />

                      {event.location}
                    </Flex>
                  </Flex>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
      {currentEvent && <EventPage event={currentEvent} />}
    </Grid>
  );
};

const EventPage = ({ event }: { event: any }): JSX.Element => {
  return (
    <Flex
      flexDirection="column"
      style={{
        boxShadow: '0 0 0.75rem #ddd',
        padding: '1rem 1.5rem',
        borderRadius: '0.75rem',
      }}
    >
      <h3 style={{ fontSize: 30 }}>{event.title}</h3>
      <p>{event.description}</p>
    </Flex>
  );
};

const MobileProgramTimeline = ({
  activeDate,
  events,
}: ProgramTimelineProps): JSX.Element => {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      <Collapse.Group>
        {activeDate &&
          events[`${activeDate}`].map((event: any) => (
            <TimelineItem key={activeDate + event.id}>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="inherit"></TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent style={{ padding: '5px 1rem 5px 2rem' }}>
                <Collapse
                  shadow
                  bordered={false}
                  title={<h5>{event.title}</h5>}
                  subtitle={
                    <>
                      {/* eslint-disable-next-line*/}
                      {/* @ts-ignore*/}
                      <ion-icon
                        style={{ color: '#156493' }}
                        name="location-sharp"
                      />
                      {event.location}
                      <div>
                        {`${eventTime({
                          start: toDayjs(event.date, event.timeStart),
                          end: toDayjs(event.date, event.timeEnd),
                        })}`}
                      </div>
                    </>
                  }
                >
                  <Text>{event.description}</Text>
                </Collapse>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Collapse.Group>
    </Timeline>
  );
};

const ProgramTimeline = (props: ProgramTimelineProps): JSX.Element => {
  if (isMobile) {
    return <MobileProgramTimeline {...props} />;
  }
  return <DesktopProgramTimeline {...props} />;
};

export default ProgramTimeline;
