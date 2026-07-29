import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { groupBy, sortBy } from 'lodash';
import { NextRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { ProgramView_currentMetaData } from '../../__generated__/ProgramView_currentMetaData.graphql';
import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
import { editionConfig } from '../../config/edition';
import { resolveContentState } from '../../utils/eventLifecycle';
import { ContentStatePanel, PageHeader, MetadataList } from '../DesignSystem';
import EventsToggle from './Components/EventsToggle';
import ProgramTimeline from './Components/ProgramTimeline';

type Props = {
  events: ProgramView_events;
  currentMetaData: ProgramView_currentMetaData;
  showToggleButton?: boolean;
  router: NextRouter;
};

const ProgramView = ({
  events,
  currentMetaData,
  showToggleButton = false,
  router,
}: Props): JSX.Element => {
  const [programType, setProgramType] = useState('Generelt program');
  const [activeDate, setActiveDate] = useState('');

  const filteredEvents = useMemo(
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
        sortBy(filteredEvents, ['date', 'timeStart']),
        (event) => event.date
      ),
    [filteredEvents]
  );
  const sortedDates = useMemo(
    () => Object.keys(groupedEvents).sort((a, b) => a.localeCompare(b)),
    [groupedEvents]
  );
  const queryEvent =
    typeof router.query.event === 'string'
      ? events.find((event) => event.id === router.query.event)
      : undefined;

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const preferredDate =
      queryEvent?.date && sortedDates.includes(queryEvent.date)
        ? queryEvent.date
        : sortedDates.includes(today)
        ? today
        : sortedDates[0];
    setActiveDate(preferredDate || '');
  }, [queryEvent, sortedDates]);

  const updateQueryEvent = (eventId: string): void => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, event: eventId },
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
    }
  };

  const edition = currentMetaData.year || editionConfig.edition;
  const startDate = dayjs(currentMetaData.startDate);
  const endDate = dayjs(currentMetaData.endDate);
  const dateLabel = `${startDate.format('D')}.–${endDate.format('D')}. ${endDate
    .locale('nb')
    .format('MMMM')} ${edition}`;
  const contentState = resolveContentState({
    lifecycle: editionConfig.modules.program,
    currentEdition: edition,
    itemCount: events.length,
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
              { label: 'Dato', value: dateLabel },
              { label: 'Sted', value: 'NTNU Gløshaugen' },
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
            { label: 'Dato', value: dateLabel },
            { label: 'Arrangementer', value: filteredEvents.length },
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

      <div className="program-day-navigation">
        <p className="site-eyebrow">Velg dag</p>
        <EventsToggle
          activeOption={activeDate}
          options={sortedDates}
          setActiveOption={updateActiveDate}
        />
      </div>

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
