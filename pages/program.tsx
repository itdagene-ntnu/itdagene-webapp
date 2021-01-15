import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import ProgramView from '../components/Program/ProgramView';
import Flex, { FlexItem } from 'styled-flex-component';

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => (
  <>
    {props.programPage && <PageView hideContent page={props.programPage} />}

    {props.programPage && (
      <PageView hideTitle hideDate page={props.programPage} />
    )}

    {props.events ? (
      <ProgramView
        events={props.events}
        stands={props.stands}
        showToggleButton
      />
    ) : (
      <Flex>
        <FlexItem>
          <h1>Programmet er tomt</h1>
        </FlexItem>
      </Flex>
    )}
  </>
);

export default withDataAndLayout(Index, {
  query: graphql`
    query program_Query {
      stands {
        active
        slug
        company {
          id
        }
      }
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
