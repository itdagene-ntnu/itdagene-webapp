import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { capitalize } from 'lodash';
import Link from 'next/link';
import { NextRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ProgramView_events } from '../../../__generated__/ProgramView_events.graphql';
import { findClosestDate } from '../../../utils/findClosestDate';
import { eventInstant, eventLocalTime } from '../../../utils/eventTime';
import { eventTime, toDayjs } from '../../../utils/time';
import { ArrayElement } from '../../../utils/types';

dayjs.extend(customParseFormat);

type ProgramEvent = ArrayElement<ProgramView_events>;

type ProgramTimelineProps = {
  activeDate: string;
  updateQueryEvent: (eventId: string) => void;
  events: Record<string, ProgramView_events>;
  router: NextRouter;
};

const hasEnded = (date: string, time: string): boolean =>
  eventInstant(new Date().toISOString()).isAfter(
    eventLocalTime(`${date} ${time}`)
  );

const findInitialEvent = (
  events: ProgramView_events,
  activeDate: string,
  queryEvent?: string
): ProgramEvent | undefined => {
  if (!activeDate || events.length === 0) {
    return undefined;
  }

  const selectedFromQuery = queryEvent
    ? events.find((event) => event.id === queryEvent)
    : undefined;

  if (selectedFromQuery) {
    return selectedFromQuery;
  }

  const isToday = eventLocalTime(activeDate).isSame(
    eventInstant(new Date().toISOString()),
    'day'
  );
  if (!isToday) {
    return events[0];
  }

  const upcomingEvents = events.filter(
    (event) => !hasEnded(activeDate, event.timeEnd)
  );
  const closestTime = findClosestDate(
    upcomingEvents.map((event) => event.timeStart),
    'HH:mm:ss'
  );

  return (
    upcomingEvents.find((event) => event.timeStart === closestTime) || events[0]
  );
};

const MarkdownLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element =>
  href.startsWith('/') ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );

const markdownRenderers = { link: MarkdownLink };

const EventDetails = ({
  event,
  compact = false,
}: {
  event: ProgramEvent;
  compact?: boolean;
}): JSX.Element => (
  <div
    className={
      compact ? 'program-detail program-detail--compact' : 'program-detail'
    }
  >
    {event.coverImage && !compact && (
      <img
        alt={`Bilde fra ${event.title}`}
        className="program-detail__image"
        loading="lazy"
        src={`https://itdagene.no/uploads/${event.coverImage}`}
      />
    )}
    <p className="program-detail__coordinate">
      {capitalize(
        eventLocalTime(event.date).locale('nb').format('dddd DD. MMMM')
      )}
    </p>
    {!compact && <h2>{event.title}</h2>}
    <dl className="program-detail__metadata">
      <div>
        <dt>Tid</dt>
        <dd>
          {dayjs(event.timeStart, 'HH:mm').format('HH:mm')} -{' '}
          {dayjs(event.timeEnd, 'HH:mm').format('HH:mm')}
        </dd>
      </div>
      <div>
        <dt>Sted</dt>
        <dd>{event.location}</dd>
      </div>
      {event.company && (
        <div>
          <dt>Arrangør</dt>
          <dd>{event.company.name}</dd>
        </div>
      )}
    </dl>
    {event.usesTickets && (
      <p className="program-detail__notice">Påmelding kan være nødvendig.</p>
    )}
    {event.description && (
      <div className="program-detail__body">
        <ReactMarkdown
          renderers={markdownRenderers}
          source={event.description}
        />
      </div>
    )}
  </div>
);

const ProgramTimeline = ({
  activeDate,
  updateQueryEvent,
  events,
  router,
}: ProgramTimelineProps): JSX.Element => {
  const [activeEvent, setActiveEvent] = useState<ProgramEvent>();
  const [previewEvent, setPreviewEvent] = useState<ProgramEvent>();
  const eventsForDay = activeDate ? events[activeDate] || [] : [];
  const queryEvent =
    typeof router.query.event === 'string' ? router.query.event : undefined;

  useEffect(() => {
    setActiveEvent(findInitialEvent(eventsForDay, activeDate, queryEvent));
    setPreviewEvent(undefined);
  }, [activeDate, eventsForDay, queryEvent]);

  const selectEvent = (event: ProgramEvent): void => {
    setActiveEvent(event);
    setPreviewEvent(undefined);
    updateQueryEvent(event.id);
  };
  const displayedEvent = previewEvent || activeEvent;
  const clearPreviewOnBlur = (
    event: React.FocusEvent<HTMLDivElement>
  ): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPreviewEvent(undefined);
    }
  };

  if (!activeDate || eventsForDay.length === 0) {
    return (
      <p className="program-empty-day">Ingen arrangementer denne dagen.</p>
    );
  }

  return (
    <div
      className="program-layout"
      onBlur={clearPreviewOnBlur}
      onMouseLeave={(): void => setPreviewEvent(undefined)}
    >
      <ol aria-label="Arrangementer" className="program-event-list">
        {eventsForDay.map((event) => {
          const isActive = displayedEvent?.id === event.id;
          const isSelected = activeEvent?.id === event.id;
          const isPast = hasEnded(event.date, event.timeEnd);

          return (
            <li data-past={isPast} key={event.id}>
              <button
                aria-current={isSelected ? 'true' : undefined}
                className="program-event-card"
                data-active={isActive}
                data-event-id={event.id}
                onClick={(): void => selectEvent(event)}
                onFocus={(): void => setPreviewEvent(event)}
                onMouseEnter={(): void => setPreviewEvent(event)}
                type="button"
              >
                <time dateTime={`${event.date}T${event.timeStart}`}>
                  {eventTime({
                    start: toDayjs(event.date, event.timeStart),
                    end: toDayjs(event.date, event.timeEnd),
                  })}
                </time>
                <span className="program-event-card__copy">
                  <strong>{event.title}</strong>
                  <span>{event.location}</span>
                </span>
              </button>
              <div className="program-event-card__mobile-detail">
                <EventDetails compact event={event} />
              </div>
            </li>
          );
        })}
      </ol>
      {displayedEvent && (
        <aside
          aria-live="polite"
          className="program-detail-pane"
          data-event-id={displayedEvent.id}
          onMouseEnter={(): void => setPreviewEvent(displayedEvent)}
        >
          <EventDetails event={displayedEvent} />
        </aside>
      )}
    </div>
  );
};

export default ProgramTimeline;
