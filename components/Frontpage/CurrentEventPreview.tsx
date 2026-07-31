import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import React from 'react';
import { ContentState, EventPhase } from '../../config/edition';
import { ActionLink, SiteSection } from '../DesignSystem';

export type PreviewEvent = {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly timeStart: string;
  readonly timeEnd: string;
  readonly location: string;
};

const visibleProgramEvents = (
  events: ReadonlyArray<PreviewEvent>,
  phase: EventPhase
): PreviewEvent[] => {
  const sortedEvents = [...events].sort((first, second) =>
    `${first.date}T${first.timeStart}`.localeCompare(
      `${second.date}T${second.timeStart}`
    )
  );
  if (phase !== 'live') return sortedEvents.slice(0, 3);

  const remaining = sortedEvents.filter((event) =>
    dayjs().isBefore(dayjs(`${event.date}T${event.timeEnd}`))
  );
  return (remaining.length > 0 ? remaining : sortedEvents).slice(0, 3);
};

export const CurrentEventPreview = ({
  events,
  phase,
  programState,
}: {
  events: ReadonlyArray<PreviewEvent>;
  phase: EventPhase;
  programState: ContentState;
}): JSX.Element => {
  const published =
    programState === 'published' &&
    visibleProgramEvents(events, phase).length > 0;
  const visibleEvents = visibleProgramEvents(events, phase);

  return (
    <SiteSection className="current-event-preview" tone="warm">
      <div className="current-event-preview__heading">
        <h2>
          {published
            ? phase === 'live'
              ? 'Nå og neste'
              : 'Dette skjer under itDAGENE'
            : 'Programmet publiseres fortløpende'}
        </h2>
        {!published && (
          <p>Tider, rom og arrangementer legges ut så snart de er bekreftet.</p>
        )}
      </div>

      {published ? (
        <>
          <ol className="program-preview">
            {visibleEvents.map((event) => (
              <li key={event.id}>
                <time dateTime={`${event.date}T${event.timeStart}`}>
                  {event.timeStart.slice(0, 5)}
                </time>
                <div>
                  <h3>{event.title}</h3>
                  <p>
                    {event.location}, {dayjs(event.date).format('DD.MM')}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <ActionLink href="/program" variant="text">
            Se hele programmet
          </ActionLink>
        </>
      ) : (
        <div className="current-event-preview__planning">
          <p>I mellomtiden finner du praktisk informasjon i FAQ-en.</p>
          <ActionLink href="/faq">Praktisk informasjon</ActionLink>
        </div>
      )}
    </SiteSection>
  );
};
