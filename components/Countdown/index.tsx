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
} from '../../utils/countdown';

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
    return (
      <div className="event-countdown event-countdown--complete" role="status">
        <span className="event-countdown__kicker">
          {phase === 'postEvent' ? 'Takk for i år' : 'itDAGENE er i gang'}
        </span>
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
    }
  `,
});
