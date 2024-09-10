import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import ProgramView from '../components/Program/ProgramView';
import Flex from '../components/Styled/Flex';
import FlexItem from '../components/Styled/FlexItem';

const Index = ({
  error,
  props,
  router,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => (
  <>
    {props.programPage && <PageView hideContent page={props.programPage} />}

    {props.programPage && <PageView hideTitle page={props.programPage} />}

    {props.events ? (
      <ProgramView
        events={props.events}
        router={router}
        currentMetaData={props.currentMetaData}
        // showToggleButton
        // useLinks
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
      events {
        ...ProgramView_events
      }
      currentMetaData {
        ...ProgramView_currentMetaData
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
