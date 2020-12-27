import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import ProgramView from '../components/ProgramView';
import Flex, { FlexItem } from 'styled-flex-component';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import {
  Heading,
  Blockquote,
  ThematicBreak,
  MarkdownList,
  Paragraph,
} from '../components/MarkdownRenderer';
import Link from 'next/link';

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => {
  const groupedEvents =
    props.events && groupBy(sortBy(props.events, 'timeStart'), 'date');
  const sortedKeys = props.events && sortBy(Object.keys(groupedEvents || {}));

  const renderHostingCompany = (company: any) => {
    if (company) {
      return (
        <Link href={`stands/${company.stand?.slug}`}>
          <HostingCompany>{`🏢 ${company?.name}`}</HostingCompany>
        </Link>
      );
    }
  };
  return (
    <>
      {props.programPage && <PageView hideContent page={props.programPage} />}

      {props.programPage && (
        <PageView hideTitle hideDate page={props.programPage} />
      )}

      {/* {props.events ? (
        <ProgramView events={props.events} /> */}
      {sortedKeys && groupedEvents ? (
        <CenterFlex>
          {sortedKeys.map((k) => (
            <GroupedDateEvent key={k}>
              <DateTitle>
                {dayjs(k).format('dddd DD.MM').toUpperCase()}
              </DateTitle>
              <GroupedEvent>
                {groupedEvents[k].map((event) => (
                  <EventInfo key={event.id}>
                    <Title>{event.title}</Title>
                    <EventTimePlaceInfo>
                      <InfoElement>{`🕐 ${event.timeStart.slice(
                        0,
                        5
                      )} - ${event.timeEnd.slice(0, 5)}`}</InfoElement>
                      <InfoElement>{`📍${event.location}`}</InfoElement>
                      {renderHostingCompany(event.company)}
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
      ) : (
        <Flex>
          <FlexItem>
            <h1>Programmet er tomt</h1>
          </FlexItem>
        </Flex>
      )}
    </>
  );
};

export default withDataAndLayout(Index, {
  query: graphql`
    query program_Query {
      events {
        ...ProgramView_events
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
          stand {
            slug
          }
        }
        usesTickets
        maxParticipants
      }
      programPage: page(slug: "program") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props && props.programPage,
  }),
});

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

const HostingCompany = styled.a`
  font-weight: 500;
  cursor: pointer;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;
`;
