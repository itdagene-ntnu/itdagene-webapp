import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Collapse, Text } from '@nextui-org/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { itdageneBlue } from '../../../utils/colors';
import { findClosestDate } from '../../../utils/findClosestDate';
import { eventTime, toDayjs } from '../../../utils/time';
import { ArrayElement } from '../../../utils/types';
import { ProgramView_events } from '../../../__generated__/ProgramView_events.graphql';
import Flex from '../../Styled/Flex';

type ProgramTimelineProps = {
  activeDate: string;
  events: Record<string, ProgramView_events>;
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

const EventCover = styled.img`
  max-height: 256px;
  object-fit: cover;
`;

const DesktopProgramTimeline = ({
  activeDate,
  events,
}: ProgramTimelineProps): JSX.Element => {
  const [activeEvent, setActiveEvent] = useState<ArrayElement<ProgramView_events>>();
  
  // If activeDate is today, select the next event to happen, 
  // if not select the first event of that day
  useEffect(() => {
    if (!events || !events[activeDate]) return;
    const closestTime = findClosestDate(events[activeDate].map(event => event.timeStart), 'HH:mm:ss')
    const closestEvent = events[activeDate].find((event) => event.timeStart === closestTime)
    const isToday = dayjs(activeDate).isSame(dayjs(), 'day')
    setActiveEvent((isToday && closestEvent) ? closestEvent : events[activeDate][0]);
  }, [events, activeDate])
  
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
                  active={activeEvent?.id === event.id}
                  onClick={(): void => setActiveEvent(event)}
                >
                  <Flex flexDirection="column">
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>
                      {event.title}
                    </h3>
                    <Flex
                      style={{
                        color: activeEvent?.id === event.id ? '#eee' : 'grey',
                      }}
                      alignItems="center"
                    >
                      {/* eslint-disable-next-line*/}
                      {/* @ts-ignore*/}
                      <ion-icon
                        style={{
                          color:
                            activeEvent?.id === event.id ? '#eee' : '#156493',
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
      {activeEvent && <EventPage event={activeEvent} />}
    </Grid>
  );
};

const EventPage = ({ event }: { event: any }): JSX.Element => {
  return (
    <Flex
      flexDirection="column"
      style={{ position: "sticky", height: "fit-content", top: "2rem" }}
    >
      <EventCover src={"https://itdagene.no/uploads/event_covers/" + event.coverImage} alt="cover image" />
      <h3 style={{ fontSize: 40, margin: "2rem 0 0" }}>{event.title}</h3>
      <Flex gap="0 2rem" flexDirection="column">
        <p style={{ margin: 0 }}>{event.location}</p> 
        <p style={{ margin: 0 }}>{dayjs(event.date).format('dddd DD.MM')} {event.timeStart} - {event.timeEnd}</p> 
      </Flex>
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
