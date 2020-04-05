import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import Flex, { FlexItem } from 'styled-flex-component';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => {
  const groupedEvents =
    props.events && groupBy(sortBy(props.events, 'timeStart'), 'date');
  const sortedKeys = props.events && sortBy(Object.keys(groupedEvents || {}));
  return (
    <>
      {props.programPage && <PageView hideContent page={props.programPage} />}
      <Flex wrap justifyCenter>
        {sortedKeys && groupedEvents ? (
          sortedKeys.map((k) => (
            <FlexItem
              grow="1"
              style={{ padding: '20px 30px' }}
              basis="500px"
              key={k}
            >
              <h1>{dayjs(k).format('dddd DD.MM').toUpperCase()}</h1>
              {groupedEvents[k].map((event) => (
                <div key={event.id}>
                  {event.timeStart.slice(0, 5)} - {event.timeEnd.slice(0, 5)},{' '}
                  {event.location}
                  <h3
                    style={{
                      fontWeight: 600,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  >
                    {event.title}
                  </h3>
                  {event.description}
                  <br />
                  <br />
                </div>
              ))}
            </FlexItem>
          ))
        ) : (
          <FlexItem>
            <h1>Programmet er tomt</h1>
          </FlexItem>
        )}
      </Flex>
      {props.programPage && (
        <PageView hideTitle hideDate page={props.programPage} />
      )}
    </>
  );
};

export default withDataAndLayout(Index, {
  query: graphql`
    query program_Query {
      events {
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
