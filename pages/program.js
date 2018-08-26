//@flow
import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';
import { type omItdagene_QueryResponse } from './__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import Layout from '../components/Layout';
import Flex, { FlexItem } from 'styled-flex-component';
import { groupBy, sortBy } from 'lodash';
import dayjs from 'dayjs';

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: WithDataProps) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({
      error,
      props: props
    }: {
      error: ?Error,
      props: ?omItdagene_QueryResponse
    }) => {
      return (
        <Layout
          responsive
          {...{ error, props }}
          contentRenderer={({ props, error }) => {
            const groupedEvents =
              props.events &&
              groupBy(sortBy(props.events, 'timeStart'), 'date');
            const sortedKeys =
              props.events && sortBy(Object.keys(groupedEvents));
            return (
              <>
                {props.programPage && (
                  <PageView hideContent page={props.programPage} />
                )}
                <Flex wrap justifyCenter>
                  {sortedKeys.map(k => (
                    <FlexItem
                      grow="1"
                      style={{ padding: '20px 30px' }}
                      basis="500px"
                      key={k}
                    >
                      <h1>
                        {dayjs(k)
                          .format('dddd DD.MM')
                          .toUpperCase()}
                      </h1>
                      {groupedEvents[k].map(event => (
                        <div key={event.id}>
                          {event.timeStart.slice(0, 5)} -{' '}
                          {event.timeEnd.slice(0, 5)}, {event.location}
                          <h3
                            style={{
                              fontWeight: 600,
                              marginTop: 0,
                              marginBottom: 0
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
                  ))}
                </Flex>
                {props.programPage && (
                  <PageView hideTitle hideDate page={props.programPage} />
                )}
              </>
            );
          }}
        />
      );
    }}
  />
);

export default withData(Index, {
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
      }
    }
  `,
  variables: {}
});
