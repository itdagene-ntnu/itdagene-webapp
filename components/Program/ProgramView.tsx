import 'dayjs/locale/nb';
import { groupBy, sortBy } from 'lodash';
import { NextRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { ProgramView_currentMetaData } from '../../__generated__/ProgramView_currentMetaData.graphql';
import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
import { editionConfig } from '../../config/edition';
import { resolveContentState } from '../../utils/eventLifecycle';
import { eventInstant, eventLocalTime } from '../../utils/eventTime';
import {
  buildProgramDates,
  resolveInitialProgramDate,
} from '../../utils/programDates';
import { ContentStatePanel, PageHeader, MetadataList } from '../DesignSystem';
import EventsToggle from './Components/EventsToggle';
import ProgramDateNavigator from './Components/ProgramDateNavigator';
import ProgramTimeline from './Components/ProgramTimeline';

type Props = {
  events: ProgramView_events;
  currentMetaData: ProgramView_currentMetaData;
  programPublished: boolean;
  showToggleButton?: boolean;
  router: NextRouter;
  venue: string;
};

const formatProgramPeriod = (dates: string[]): string => {
  if (dates.length === 0) return '';

  const start = eventLocalTime(dates[0]).locale('nb');
  const end = eventLocalTime(dates[dates.length - 1]).locale('nb');

  if (start.isSame(end, 'day')) return start.format('D. MMMM YYYY');
  if (start.isSame(end, 'month')) {
    return `${start.format('D')}.–${end.format('D. MMMM YYYY')}`;
  }
  if (start.isSame(end, 'year')) {
    return `${start.format('D. MMMM')}–${end.format('D. MMMM YYYY')}`;
  }
  return `${start.format('D. MMMM YYYY')}–${end.format('D. MMMM YYYY')}`;
};

export const ProgramView = ({
  events,
  currentMetaData,
  programPublished,
  showToggleButton = false,
  router,
  venue,
}: Props): JSX.Element => {
  const [programType, setProgramType] = useState('Generelt program');

  const programEvents = useMemo(
    () =>
      showToggleButton
        ? events.filter((event) =>
            programType === 'Promotert program'
              ? event.type === 'A_7'
              : event.type !== 'A_7'
          )
        : events,
    [events, programType, showToggleButton]
  );

  const groupedEvents = useMemo(
    () =>
      groupBy(
        sortBy(programEvents, ['date', 'timeStart']),
        (event) => event.date
      ),
    [programEvents]
  );
  const eventDates = useMemo(
    () => buildProgramDates(programEvents.map((event) => event.date)),
    [programEvents]
  );
  const queryEvent =
    typeof router.query.event === 'string'
      ? programEvents.find((event) => event.id === router.query.event)
      : undefined;
  const [activeDate, setActiveDate] = useState(() =>
    resolveInitialProgramDate({
      programDates: eventDates,
      queryEventDate: queryEvent?.date,
      today: '',
    })
  );
  const eventCounts = useMemo(
    () =>
      eventDates.reduce<Record<string, number>>((counts, date) => {
        counts[date] = groupedEvents[date]?.length || 0;
        return counts;
      }, {}),
    [eventDates, groupedEvents]
  );
  useEffect(() => {
    const today = eventInstant(new Date().toISOString()).format('YYYY-MM-DD');
    setActiveDate(
      resolveInitialProgramDate({
        programDates: eventDates,
        queryEventDate: queryEvent?.date,
        today,
      })
    );
  }, [eventDates, queryEvent]);

  const updateQueryEvent = (eventId?: string): void => {
    const query = { ...router.query };
    if (eventId) query.event = eventId;
    else delete query.event;
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  const updateActiveDate = (date: string): void => {
    setActiveDate(date);
    const firstEvent = groupedEvents[date]?.[0];
    if (firstEvent) {
      updateQueryEvent(firstEvent.id);
    } else {
      updateQueryEvent();
    }
  };

  const edition = currentMetaData.year || editionConfig.edition;
  const startDate = eventLocalTime(currentMetaData.startDate);
  const endDate = eventLocalTime(currentMetaData.endDate);
  const dateLabel = `${startDate.format('D')}.–${endDate.format('D')}. ${endDate
    .locale('nb')
    .format('MMMM')} ${edition}`;
  const programDateLabel = formatProgramPeriod(eventDates) || dateLabel;
  const contentState = resolveContentState({
    lifecycle: editionConfig.modules.program,
    currentEdition: edition,
    sourceEdition: edition,
    itemCount: events.length,
    isPublished: programPublished,
  });

  if (contentState !== 'published') {
    const isPublishedButEmpty = contentState === 'empty';
    return (
      <>
        <PageHeader
          description={
            isPublishedButEmpty
              ? 'Det er foreløpig ingen arrangementer i det publiserte programmet.'
              : 'Tider, rom og arrangementer publiseres samlet når årets program er godkjent.'
          }
          title="Program"
        >
          <MetadataList
            items={[
              { label: 'Messedager', value: dateLabel },
              { label: 'Sted', value: venue },
            ]}
          />
        </PageHeader>
        <ContentStatePanel
          action={{ href: '/faq', label: 'Se praktisk informasjon' }}
          description={
            isPublishedButEmpty
              ? 'Siden oppdateres når det legges til arrangementer.'
              : 'Du trenger ikke lete gjennom en tom tidsplan. Denne siden oppdateres når programmet er klart.'
          }
          compact
          state={contentState}
          title={
            isPublishedButEmpty
              ? `Programmet for ${edition} har ingen arrangementer ennå.`
              : `Programmet for ${edition} er ikke publisert ennå.`
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        description="Velg dag og finn tidspunkt, rom og detaljer for hvert arrangement."
        title="Program"
      >
        <MetadataList
          items={[
            { label: 'Programperiode', value: programDateLabel },
            { label: 'Arrangementer', value: programEvents.length },
          ]}
        />
      </PageHeader>

      {showToggleButton && (
        <div className="program-type-toggle">
          <EventsToggle
            activeOption={programType}
            label="Velg programtype"
            options={['Generelt program', 'Promotert program']}
            setActiveOption={setProgramType}
          />
        </div>
      )}

      <ProgramDateNavigator
        activeDate={activeDate}
        dates={eventDates}
        eventCounts={eventCounts}
        onChange={updateActiveDate}
      />

      <ProgramTimeline
        activeDate={activeDate}
        events={groupedEvents}
        router={router}
        updateQueryEvent={updateQueryEvent}
      />
    </>
  );
};

export default createFragmentContainer(ProgramView, {
  events: graphql`
    fragment ProgramView_events on Event @relay(plural: true) {
      title
      id
      timeStart
      timeEnd
      coverImage
      description
      location
      date
      type
      company {
        id
        name
      }
      usesTickets
      maxParticipants
    }
  `,
  currentMetaData: graphql`
    fragment ProgramView_currentMetaData on MetaData {
      year
      startDate
      endDate
    }
  `,
});
