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
  edition,
  endDate,
  events,
  phase,
  programState,
  startDate,
}: {
  edition: number;
  endDate: string;
  events: ReadonlyArray<PreviewEvent>;
  phase: EventPhase;
  programState: ContentState;
  startDate: string;
}): JSX.Element => {
  const published =
    programState === 'published' &&
    visibleProgramEvents(events, phase).length > 0;
  const visibleEvents = visibleProgramEvents(events, phase);
  const start = dayjs(startDate).locale('nb');
  const end = dayjs(endDate).locale('nb');
  const dateLabel = `${start.format('D')}.–${end.format('D')}. ${end.format(
    'MMMM'
  )} ${edition}`;

  return (
    <SiteSection className="current-event-preview" tone="warm">
      <div className="current-event-preview__heading">
        <p>{published ? 'Program' : 'Programmet planlegges'}</p>
        <h2>
          {published
            ? phase === 'live'
              ? 'Nå og neste'
              : 'Dette skjer under itDAGENE'
            : `${dateLabel} på Gløshaugen`}
        </h2>
        <p>
          {published
            ? 'Et utvalg av arrangementene som er klare for årets messe.'
            : 'Tider, rom og programpunkter publiseres når innholdet er godkjent.'}
        </p>
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
          <p>
            Du kan fortsatt finne sted, datoer og svar på praktiske spørsmål før
            programmet er klart.
          </p>
          <ActionLink href="/faq">Praktisk informasjon</ActionLink>
        </div>
      )}
    </SiteSection>
  );
};
