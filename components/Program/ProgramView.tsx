import React, { useState } from 'react';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { graphql, createFragmentContainer } from 'react-relay';
import {
  Heading,
  Blockquote,
  ThematicBreak,
  MarkdownList,
  Paragraph,
} from '../MarkdownRenderer';
import { ProgramView_events } from '../../__generated__/ProgramView_events.graphql';
// import Link from 'next/link';
import { program_QueryResponse } from '../../__generated__/program_Query.graphql';
import Flex from 'styled-flex-component';
import EventsToggle from './EventsToggle';
import { ArrayElement } from '../../utils/types';
import { eventTime } from '../../utils/time';

const Title = styled.h2`
  position: relative;
  margin: 0px;
  &::after {
    content: ' ';
    position: absolute;
    background-color: #f5f5f5;
    border: 3.5px solid #0d7bb4;
    width: 15px;
    height: 15px;
    bottom: 9px;
    left: -63.2px;
    box-shadow: -2px 0px 5px 2px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }
  @media only screen and (max-width: 991px) {
    font-size: 1.7em;

    &::after {
      bottom: 2px;
    }
  }
`;

const DateTitle = styled.h1`
  margin: 0px 0px 5px 0px;
  font-weight: 300;
`;

const GroupedDateEvent = styled.div`
  display: flex;
  margin: 0px 40px 40px 0;
  flex-direction: column;
  flex: 1 1 500px;
  @media only screen and (max-width: 991px) {
    flex-direction: column;
    padding: 0px 0px;
    margin: 0px 0px 10px 0;
  }
`;

const CenterFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 20px;
  @media only screen and (max-width: 991px) {
    padding: 0px;
    margin: 0px;
  }
`;

const GroupedEvent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
  border-radius: 0px 10px 10px 0px;
  padding: 0px 50px 30px 50px;
  border-left: 4px solid #0d7bb4;
  @media only screen and (max-width: 991px) {
    margin-bottom: 50px;
  }
`;

const EventTimePlaceInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const InfoElement = styled.div`
  margin-right: 15px;
`;

const HostingCompanyLink = styled.a`
  font-weight: 500;
  cursor: pointer;
`;

const HostingCompanyNoLink = styled.span`
  font-weight: 400;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;
`;

interface LocationLinkProps {
  event: ArrayElement<ProgramView_events>;
  stands?: program_QueryResponse['stands'];
}

const LocationLink = ({ event, stands }: LocationLinkProps): JSX.Element => {
  let href;

  const standSlug =
    stands &&
    stands.find((stand) => stand && stand.company.id === event.company?.id)
      ?.slug;

  // FIXME: This should be implemented as types
  switch (event.location.toLowerCase()) {
    case 'forsiden':
      href = '/stands';
      break;
    case 'standen':
      href = standSlug ? `stands/${standSlug}` : null;
      break;
    default:
      href = null;
      break;
  }

  // FIXME: Removed the linking until we've merged further /stands branches
  return (
    // href ? (
    //   <InfoElement>
    //     <Link href={href}>
    //       <HostingCompanyLink>{`📍 ${event.location}`}</HostingCompanyLink>
    //     </Link>
    //   </InfoElement>
    // ) :
    <InfoElement>
      <HostingCompanyNoLink>{`📍 ${event.location}`}</HostingCompanyNoLink>
    </InfoElement>
  );
};

type Props = {
  events: ProgramView_events;
  stands?: program_QueryResponse['stands'];
  showToggleButton?: boolean;
};

const ProgramView = (props: Props): JSX.Element => {
  const [showPromoted, setShowPromoted] = useState(false);

  // Had an issue where event wasn't defined although by the schema it should be. Added a null-safety
  const filteredEvents =
    props.events &&
    props.events.filter((event) =>
      showPromoted ? event?.type === 'A_7' : event?.type !== 'A_7'
    );

  // If on a company's page, don't show toggleButton and don't filter any events
  const groupedEvents = groupBy(
    sortBy(props.showToggleButton ? filteredEvents : props.events, 'timeStart'),
    'date'
  );
  const sortedKeys = sortBy(Object.keys(groupedEvents || {}));

  return (
    <Flex column>
      {props.showToggleButton && (
        <EventsToggle
          showPromoted={showPromoted}
          setShowPromoted={setShowPromoted}
        />
      )}
      <CenterFlex>
        {sortedKeys.map((k) => (
          <GroupedDateEvent key={k}>
            <DateTitle>{dayjs(k).format('dddd DD.MM').toUpperCase()}</DateTitle>
            <GroupedEvent>
              {groupedEvents[k].map(
                (event) =>
                  event && (
                    <EventInfo key={event.id}>
                      <Title>{event.title}</Title>
                      <EventTimePlaceInfo>
                        <InfoElement>{`🕐 ${eventTime(event)}`}</InfoElement>
                        <LocationLink event={event} stands={props.stands} />
                        {event.company && (
                          <HostingCompanyNoLink>{`🏢 ${event.company.name}`}</HostingCompanyNoLink>
                        )}
                      </EventTimePlaceInfo>
                      <br />
                      <ReactMarkdown
                        source={event.description}
                        escapeHtml={false}
                        renderers={{
                          heading: Heading,
                          blockquote: Blockquote,
                          thematicBreak: ThematicBreak,
                          list: MarkdownList,
                          paragraph: Paragraph,
                        }}
                      />
                    </EventInfo>
                  )
              )}
            </GroupedEvent>
          </GroupedDateEvent>
        ))}
      </CenterFlex>
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
});
