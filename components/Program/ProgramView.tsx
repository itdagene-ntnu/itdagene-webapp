import React, { useState } from 'react';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';

import styled from 'styled-components';
import { graphql, createFragmentContainer } from 'react-relay';

import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
import { ProgramView_stands } from '../../__generated__/ProgramView_stands.graphql';
import EventsToggle from './EventsToggle';

import { eventTime, toDayjs } from '../../utils/time';
import Flex from '../Styled/Flex';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';

const TimelineDate = styled(TimelineOppositeContent)`
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

const MobileViewDate = styled(Typography)`
  display: none;
  @media only screen and (max-width: 767px) {
    display: block;
  }
`;

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 3rem;
`;
const DateTitle = styled.h1`
  margin: 0px 0px 5px 0px;
  font-size: 1.5em;
  font-weight: 900;

  text-align: center;
  @media only screen and (max-width: 767px) {
    text-align: left;
  }
`;

type Props = {
  events: ProgramView_events;
  stands: ProgramView_stands | null;
  showToggleButton?: boolean;
  useLinks?: boolean;
};

const ProgramView = (props: Props): JSX.Element => {
  const [showPromoted, setShowPromoted] = useState(false);

  const filteredEvents = props.events.filter((event) =>
    showPromoted ? event.type === 'A_7' : event.type !== 'A_7'
  );

  // If on a company's page, don't show toggleButton and don't filter any events
  const groupedEvents = groupBy(
    sortBy(props.showToggleButton ? filteredEvents : props.events, 'timeStart'),
    'date'
  );
  const sortedKeys = sortBy(Object.keys(groupedEvents || {}));

  return (
    <Flex flexDirection="column">
      {props.showToggleButton && (
        <EventsToggle
          showPromoted={showPromoted}
          setShowPromoted={setShowPromoted}
        />
      )}
      <Title>Program</Title>
      <div>
        {sortedKeys.map((k) => (
          <div key={k}>
            <DateTitle>{dayjs(k).format('dddd DD.MM').toUpperCase()}</DateTitle>
            <Timeline>
              {groupedEvents[k].map((event) => (
                <TimelineItem key={k + event.id}>
                  <TimelineDate
                    style={{
                      margin: 'auto 0',
                      paddingLeft: '4rem',
                      paddingRight: '4rem',
                      color: 'grey',
                    }}
                  >
                    {`${eventTime({
                      start: toDayjs(event.date, event.timeStart),
                      end: toDayjs(event.date, event.timeEnd),
                    })}`}
                  </TimelineDate>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="inherit"></TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    style={{
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingLeft: '4rem',
                      paddingRight: '4rem',
                    }}
                  >
                    <Typography variant="h5" component="span">
                      {event.title}
                    </Typography>
                    <Typography />
                    {/* eslint-disable-next-line*/}
                    {/* @ts-ignore*/}
                    <ion-icon
                      style={{ color: '#156493' }}
                      name="location-sharp"
                    />
                    {event.location}
                    <MobileViewDate>{`${eventTime({
                      start: toDayjs(event.date, event.timeStart),
                      end: toDayjs(event.date, event.timeEnd),
                    })}`}</MobileViewDate>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        ))}
      </div>
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
