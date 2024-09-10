import React, { useEffect, useState } from 'react';
import { groupBy, sortBy } from 'lodash';

import styled from 'styled-components';
import { graphql, createFragmentContainer } from 'react-relay';

import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
import EventsToggle from './Components/EventsToggle';

import Flex from '../Styled/Flex';

import ProgramTimeline from './Components/ProgramTimeline';
import { findClosestDate } from '../../utils/findClosestDate';
import { isMobile } from 'react-device-detect';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { ProgramView_currentMetaData } from '../../__generated__/ProgramView_currentMetaData.graphql';
import dayjs from 'dayjs';
import { NextRouter } from 'next/router';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  ${isMobile && 'margin-top: 0;'}
  margin-bottom: 3rem;
  white-space: nowrap;
`;

const UnderDevelopmentPlaceholder = styled('img')`
  margin-bottom: 1rem;
`;

type Props = {
  events: ProgramView_events;
  currentMetaData: ProgramView_currentMetaData;
  showToggleButton?: boolean;
  useLinks?: boolean;
  router: NextRouter;
};

const ProgramView = (props: Props): JSX.Element => {
  const [showPromoted, setShowPromoted] = useState('Generelt program');
  const [activeDate, setActiveDate] = useState('');

  const filteredEvents: ProgramView_events = props.events.filter((event) =>
    showPromoted ? event.type === 'A_7' : event.type !== 'A_7'
  );

  // If on a company's page, don't show toggleButton and don't filter any events
  const groupedEvents = groupBy(
    sortBy(props.showToggleButton ? filteredEvents : props.events, 'timeStart'),
    'date'
  );

  const sortedEvents = sortBy(props.events, 'timeStart');

  const startDate = props.currentMetaData.startDate;
  const endDate = props.currentMetaData.endDate;

  const otherGrouped = groupBy(sortedEvents, ({ date }) =>
    date === startDate || date === endDate ? date : 'Før itDAGENE'
  );

  const sortedKeys = sortBy(Object.keys(otherGrouped), (key) => [
    dayjs(key).isValid(),
    key,
  ]);

  const parsedQueryEvent =
    typeof props.router.query.event === 'string'
      ? props.events.find((event) => event.id === props.router.query.event)
      : null;

  useEffect(() => {
    const parsedDate = parsedQueryEvent?.date;
    setActiveDate(
      parsedDate === startDate || parsedDate === endDate
        ? parsedDate
        : findClosestDate(sortedKeys)
    );
  }, []);

  if (props.events.length === 0) {
    return (
      <UnderDevelopmentPlaceholder
        alt="Programmet og nettsiden for itDAGENE 2024 er for tiden under planlegging!"
        src="/static/under-development-placeholder.png"
      />
    );
  }

  return (
    <Flex flexDirection="column">
      {props.showToggleButton && (
        <EventsToggle
          options={['Generelt program', 'Promotert program']}
          activeOption={showPromoted}
          setActiveOption={setShowPromoted}
        />
      )}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <Title>Program</Title>
        <EventsToggle
          options={sortedKeys}
          activeOption={activeDate}
          setActiveOption={setActiveDate}
        />
      </Flex>
      <ProgramTimeline
        activeDate={activeDate}
        events={otherGrouped}
        router={props.router}
      />
    </Flex>
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
      startDate
      endDate
    }
  `,
});
