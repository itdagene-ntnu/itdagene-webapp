import React, { useEffect, useState } from 'react';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';

import styled from 'styled-components';
import { graphql, createFragmentContainer } from 'react-relay';

import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
import { ProgramView_stands } from '../../__generated__/ProgramView_stands.graphql';
import EventsToggle from './Components/EventsToggle';

import Flex from '../Styled/Flex';

import ProgramTimeline from './Components/ProgramTimeline';
import { findClosestDate } from '../../utils/findClosestDate';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 3rem;
  white-space: nowrap;
`;

const UnderDevelopmentPlaceholder = styled('img')`
  margin-bottom: 1rem;
`;

type Props = {
  events: ProgramView_events;
  stands: ProgramView_stands | null;
  showToggleButton?: boolean;
  useLinks?: boolean;
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

  const sortedKeys = sortBy(Object.keys(groupedEvents || {}));

  useEffect(() => {
    setActiveDate(findClosestDate(sortedKeys));
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
      <Flex alignItems="center" justifyContent="space-between">
        <Title>Program</Title>
        <EventsToggle
          options={sortedKeys}
          activeOption={activeDate}
          setActiveOption={setActiveDate}
          dateOptions
        />
      </Flex>
      <ProgramTimeline activeDate={activeDate} events={groupedEvents} />
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
  stands: graphql`
    fragment ProgramView_stands on Stand @relay(plural: true) {
      company {
        id
      }
      slug
    }
  `,
});
