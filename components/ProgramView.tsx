import React from 'react';
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
} from '../components/MarkdownRenderer';
import { ProgramView_events } from '../__generated__/ProgramView_events.graphql';

const Title = styled.h1`
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
  margin: 0px 20px 40px;
  flex-direction: column;
  flex: 1 1 500px;
  @media only screen and (max-width: 991px) {
    flex-direction: column;
    padding: 0px 0px;
    margin: 0px 20px 10px;
  }
`;

const CenterFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 50px;
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

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;
`;

type Props = {
  events: ProgramView_events;
};

const ProgramView = (props: Props): JSX.Element => {
  const groupedEvents =
    props.events && groupBy(sortBy(props.events, 'timeStart'), 'date');
  const sortedKeys = props.events && sortBy(Object.keys(groupedEvents || {}));

  return (
    <CenterFlex>
      {sortedKeys.map((k) => (
        <GroupedDateEvent key={k}>
          <DateTitle>{dayjs(k).format('dddd DD.MM').toUpperCase()}</DateTitle>
          <GroupedEvent>
            {groupedEvents[k].map((event) => (
              <EventInfo key={event.id}>
                <Title>{event.title}</Title>
                <EventTimePlaceInfo>
                  <InfoElement>{`🕐 ${event.timeStart.slice(
                    0,
                    5
                  )} - ${event.timeEnd.slice(0, 5)}`}</InfoElement>
                  <InfoElement>{`\t\r📍 ${event.location}`}</InfoElement>
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
            ))}
          </GroupedEvent>
        </GroupedDateEvent>
      ))}
    </CenterFlex>
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
