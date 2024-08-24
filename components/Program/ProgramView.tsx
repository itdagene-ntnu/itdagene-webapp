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
  const [activeEvent, setActiveEvent] = useState('');

  const filteredEvents = props.events.filter((event) =>
    showPromoted ? event.type === 'A_7' : event.type !== 'A_7'
  );

  // If on a company's page, don't show toggleButton and don't filter any events
  const groupedEvents = groupBy(
    sortBy(props.showToggleButton ? filteredEvents : props.events, 'timeStart'),
    'date'
  );
  const sortedKeys = sortBy(Object.keys(groupedEvents || {}));
  
  // const eventsWithTime = sortBy(Object.entries(groupedEvents)).map(event => {
  //   return {
  //     time: event[0] + "T" + event[1][0].timeStart, 
  //     event: event
  //   }
  // })

  // Todo: find active date/event smarter
  useEffect(() => {
    setActiveDate(sortedKeys[0]);
    setActiveEvent(groupedEvents[sortedKeys[0]][0].id);
    // const now = dayjs().format();
    // let closestDate = eventsWithTime[0].time;
    // let smallestDifference = Math.abs(dayjs(closestDate).diff(now));
    
    // for (let i = 1; i < sortedKeys.length; i++) {
    //   const currentDifference = Math.abs(dayjs(eventsWithTime[i].time).diff(now));
    //   if (currentDifference < smallestDifference) {
    //     smallestDifference = currentDifference;
    //     closestDate = eventsWithTime[i].time;
    //   }
    // }
    // console.log(closestDate)

    // const activeEvent = eventsWithTime.find((event) => event.time === closestDate)
    // if (activeEvent) setActiveEvent(activeEvent.event[1][0].id);
    // setActiveDate(closestDate.split("T")[0]);
    // console.log(activeEvent.event[1][0])
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
      <ProgramTimeline
        activeDate={activeDate}
        events={groupedEvents}
        activeEventId={activeEvent}
        setActiveEvent={setActiveEvent}
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
  stands: graphql`
    fragment ProgramView_stands on Stand @relay(plural: true) {
      company {
        id
      }
      slug
    }
  `,
});
