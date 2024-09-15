import { Timeline, TimelineItem } from './Timeline';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import {
  blueNCS,
  indigoDye,
  itdageneBlue,
  princetonOrange,
  skyBlue,
} from '../../../utils/colors';
import { findClosestDate } from '../../../utils/findClosestDate';
import { eventTime, toDayjs } from '../../../utils/time';
import { ArrayElement } from '../../../utils/types';
import { ProgramView_events } from '../../../__generated__/ProgramView_events.graphql';
import Flex from '../../Styled/Flex';
import Link from 'next/link';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { capitalize } from 'lodash';
import { Collapse } from '@nextui-org/react';
import { NextRouter } from 'next/router';

dayjs.extend(customParseFormat);

type ProgramTimelineProps = {
  activeDate: string;
  updateQueryEvent: (opt: string) => void;
  events: Record<string, ProgramView_events>;
  router: NextRouter;
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
  gap: 1.5rem;
  grid-template-columns: 40% 60%;
`;

const EventCover = styled.img`
  max-height: 256px;
  object-fit: cover;
`;

const timelineColors = [indigoDye, blueNCS, princetonOrange, skyBlue];

const hasHappened = (date: string, time: string) => {
  return dayjs().isAfter(dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm::ss'));
};

const DesktopProgramTimeline = ({
  activeDate,
  updateQueryEvent,
  events,
  router,
}: ProgramTimelineProps): JSX.Element => {
  const [activeEvent, setActiveEvent] =
    useState<ArrayElement<ProgramView_events>>();

  const updateActiveEvent = (event: any): void => {
    setActiveEvent(event);
    updateQueryEvent(event.id);
  };

  // If activeDate is today, select the next event to happen,
  // if not select the first event of that day

  useEffect(() => {
    if (!events || !events[activeDate]) return;
    const parsedQueryEvent =
      typeof router.query.event === 'string'
        ? events[activeDate].find((event) => event.id === router.query.event)
        : null;
    if (parsedQueryEvent) {
      setActiveEvent(parsedQueryEvent);
      return;
    }
    const upcomingEvents = events[activeDate].filter(
      (event) => !hasHappened(activeDate, event.timeEnd)
    );
    const closestTime = findClosestDate(
      upcomingEvents.map((event) => event.timeStart),
      'HH:mm:ss'
    );
    const closestEvent = upcomingEvents.find(
      (event) => event.timeStart === closestTime
    );
    const isToday = dayjs(activeDate).isSame(dayjs(), 'day');
    setActiveEvent(
      isToday && closestEvent ? closestEvent : events[activeDate][0]
    );
  }, [events, activeDate]);

  if (!activeDate) return <span></span>;

  return (
    <Grid>
      <Timeline>
        {events[activeDate].map((event: any, index: number) => (
          <TimelineItem
            key={event.id}
            prevColor={
              hasHappened(activeDate, event.timeStart)
                ? timelineColors[index % timelineColors.length]
                : undefined
            }
            color={
              hasHappened(activeDate, event.timeStart)
                ? timelineColors[(index + 1) % timelineColors.length]
                : undefined
            }
          >
            <div
              style={{
                textAlign: 'right',
                width: '100px',
                flexShrink: 0,
                color: 'grey',
              }}
            >
              {`${eventTime({
                start: toDayjs(event.date, event.timeStart),
                end: toDayjs(event.date, event.timeEnd),
              })}`}
            </div>

            <Card
              active={activeEvent?.id === event.id}
              onClick={(): void => updateActiveEvent(event)}
            >
              <Flex flexDirection="column" gap="0.5rem">
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 400,
                    hyphens: 'manual',
                  }}
                >
                  {event.title}
                </h3>
                <Flex
                  style={{
                    color: activeEvent?.id === event.id ? '#eee' : 'grey',
                  }}
                  alignItems="center"
                  gap="0.1rem"
                >
                  {/* eslint-disable-next-line*/}
                  {/* @ts-ignore*/}
                  <ion-icon
                    style={{
                      color: activeEvent?.id === event.id ? '#eee' : '#156493',
                    }}
                    name="location-sharp"
                  />

                  {event.location}
                </Flex>
              </Flex>
            </Card>
          </TimelineItem>
        ))}
      </Timeline>
      {activeEvent && <EventPage event={activeEvent} />}
    </Grid>
  );
};

const LinkRenderer = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element => {
  // Use next.js router for internal urls
  if (href.startsWith('/')) {
    return <Link href={href}>{children}</Link>;
  }
  return <a href={href}> {children}</a>;
};

const renderers = { link: LinkRenderer };

const EventPage = ({ event }: { event: any }): JSX.Element => {
  return (
    <Flex
      flexDirection="column"
      style={{ position: 'sticky', height: 'fit-content', top: '2rem' }}
    >
      {event.coverImage && (
        <EventCover
          src={'https://itdagene.no/uploads/' + event.coverImage}
          alt="cover image"
        />
      )}

      <h3 style={{ fontSize: 40, margin: '2rem 0 0' }}>{event.title}</h3>
      <Flex gap="0 2rem" flexDirection="column">
        <p style={{ margin: 0 }}>
          <b>Når: </b>
          {capitalize(dayjs(event.date).format('dddd DD. MMM'))} |{' '}
          {dayjs(event.timeStart, 'HH:mm').format('HH:mm')} -{' '}
          {dayjs(event.timeEnd, 'HH:mm').format('HH:mm')}
        </p>
        <p style={{ margin: 0 }}>
          <b>Hvor: </b>
          {event.location}
        </p>
      </Flex>
      <ReactMarkdown renderers={renderers} source={event.description} />
    </Flex>
  );
};

const MobileProgramTimeline = ({
  activeDate,
  events,
}: ProgramTimelineProps): JSX.Element => {
  return (
    <Timeline>
      <Collapse.Group>
        {activeDate &&
          events[`${activeDate}`].map((event: any, index: number) => (
            <TimelineItem
              key={activeDate + event.id}
              prevColor={
                hasHappened(activeDate, event.timeStart)
                  ? timelineColors[index % timelineColors.length]
                  : undefined
              }
              color={
                hasHappened(activeDate, event.timeStart)
                  ? timelineColors[(index + 1) % timelineColors.length]
                  : undefined
              }
            >
              <span></span>
              <Collapse
                shadow
                bordered={false}
                title={<h5>{event.title}</h5>}
                subtitle={
                  <>
                    <div className="flex gap-1 items-center">
                      {/* eslint-disable-next-line*/}
                      {/* @ts-ignore*/}
                      <ion-icon
                        style={{ color: '#156493' }}
                        name="location-sharp"
                      />
                      {event.location}
                    </div>
                    <div className="flex gap-1 items-center">
                      {/* eslint-disable-next-line*/}
                      {/* @ts-ignore*/}
                      <ion-icon
                        style={{ color: '#156493' }}
                        name="time-sharp"
                      />
                      {`${eventTime({
                        start: toDayjs(event.date, event.timeStart),
                        end: toDayjs(event.date, event.timeEnd),
                      })}`}
                    </div>
                  </>
                }
              >
                <ReactMarkdown
                  renderers={renderers}
                  source={event.description}
                />
              </Collapse>
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
