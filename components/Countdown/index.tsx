import React, { useEffect, useMemo, useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Countdown_currentMetaData } from '../../__generated__/Countdown_currentMetaData.graphql';
import { EventPhase } from '../../config/edition';
import {
  CountdownParts,
  formatAccessibleEventStart,
  formatEventStartDateTime,
  getCountdownParts,
  getEventStartTimestamp,
  getFairDays,
} from '../../utils/countdown';
import { eventInstant } from '../../utils/eventTime';

const labels: Array<{
  key: keyof CountdownParts;
  singular: string;
  plural: string;
}> = [
  { key: 'days', singular: 'dag', plural: 'dager' },
  { key: 'hours', singular: 'time', plural: 'timer' },
  { key: 'minutes', singular: 'minutt', plural: 'minutter' },
  { key: 'seconds', singular: 'sekund', plural: 'sekunder' },
];

const pad = (value: number): string => String(value).padStart(2, '0');

const CountdownComponent = ({
  currentMetaData,
  eventStartTime = '10:00:00',
  phase,
}: {
  currentMetaData: Countdown_currentMetaData;
  eventStartTime?: string;
  phase?: EventPhase;
}): JSX.Element => {
  const targetTimestamp = useMemo(
    () =>
      currentMetaData?.startDate
        ? getEventStartTimestamp(currentMetaData.startDate, eventStartTime)
        : 0,
    [currentMetaData, eventStartTime]
  );
  const [nowTimestamp, setNowTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setNowTimestamp(Date.now());
    const interval = window.setInterval(
      () => setNowTimestamp(Date.now()),
      1000
    );
    return (): void => window.clearInterval(interval);
  }, []);

  if (!targetTimestamp) {
    return <div className="event-countdown event-countdown--empty" />;
  }

  const countdown =
    nowTimestamp === null
      ? getCountdownParts(targetTimestamp, targetTimestamp - 1)
      : getCountdownParts(targetTimestamp, nowTimestamp);
  const completed =
    countdown.completed || phase === 'live' || phase === 'postEvent';
  const eventDateTime = formatEventStartDateTime(
    currentMetaData.startDate,
    eventStartTime
  );
  const accessibleEventDate = formatAccessibleEventStart(
    currentMetaData.startDate,
    eventStartTime
  );

  if (completed) {
    const fairDays = getFairDays(
      currentMetaData.startDate,
      currentMetaData.endDate
    );
    // Resolved only after mount, like the countdown itself, so the server and
    // the client render the same markup.
    const today =
      nowTimestamp === null
        ? null
        : eventInstant(new Date(nowTimestamp).toISOString()).format(
            'YYYY-MM-DD'
          );
    const activeDay = fairDays.find((day) => day.date === today);

    return (
      <div
        className="event-countdown event-countdown--complete"
        data-testid="event-countdown"
        role="status"
      >
        <span className="event-countdown__kicker" data-countdown-content>
          {phase === 'postEvent' ? 'Takk for i år' : 'itDAGENE er i gang'}
        </span>
        <p className="visually-hidden">
          {activeDay
            ? `Dag ${fairDays.indexOf(activeDay) + 1} av ${fairDays.length}: ${
                activeDay.weekday
              } ${activeDay.dayOfMonth}.`
            : `itDAGENE går over ${fairDays.length} dager.`}
        </p>
        {fairDays.length > 0 && (
          <dl
            aria-hidden="true"
            className="event-countdown__values"
            data-countdown-grid
            // Lets the stylesheet cap the row at the natural width for this
            // many days, so two days do not stretch into two huge blocks.
            style={
              { '--fair-day-count': fairDays.length } as React.CSSProperties
            }
          >
            {fairDays.map((day, index) => (
              <div
                // No --1..--4 modifier here: those carry the route colours,
                // which mean nothing on a day tile.
                className="event-countdown__unit"
                data-countdown-tile
                data-fair-day={day.date === today ? 'today' : 'other'}
                key={day.date}
              >
                <dd data-countdown-content>{day.dayOfMonth}</dd>
                <dt data-countdown-content>{day.weekday}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    );
  }

  return (
    <div className="event-countdown" data-testid="event-countdown">
      <time className="visually-hidden" dateTime={eventDateTime}>
        itDAGENE starter {accessibleEventDate}
      </time>
      <p className="event-countdown__kicker" data-countdown-content>
        Til itDAGENE starter
      </p>
      <dl
        aria-hidden="true"
        className="event-countdown__values"
        data-countdown-grid
      >
        {labels.map(({ key, singular, plural }, index) => {
          const value = countdown[key] as number;
          return (
            <div
              className={`event-countdown__unit event-countdown__unit--${
                index + 1
              }`}
              data-countdown-tile
              key={key}
            >
              <dd data-countdown-content>{pad(value)}</dd>
              <dt data-countdown-content>{value === 1 ? singular : plural}</dt>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default createFragmentContainer(CountdownComponent, {
  currentMetaData: graphql`
    fragment Countdown_currentMetaData on MetaData {
      startDate
      endDate
    }
  `,
});
