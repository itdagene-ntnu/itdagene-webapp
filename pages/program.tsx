import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import ProgramView from '../components/Program/ProgramView';
import { ContentStatePanel } from '../components/DesignSystem';
import PageView from '../components/PageView';
import { Metadata } from '../components/Layout';
import { DEFAULT_EVENT_VENUE } from '../utils/optionalEventConfiguration';

const Index = ({
  optionalEventConfiguration,
  props,
  router,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => {
  if (!props.currentMetaData) {
    return (
      <ContentStatePanel
        description="Last siden på nytt, eller prøv igjen om litt."
        state="error"
        title="Vi fikk ikke hentet programinformasjonen."
      />
    );
  }

  return (
    <>
      <ProgramView
        currentMetaData={props.currentMetaData}
        events={props.events || []}
        programPublished={optionalEventConfiguration.programPublished ?? false}
        router={router}
        venue={optionalEventConfiguration.venue || DEFAULT_EVENT_VENUE}
      />
      {props.programPage && <PageView hideTitle page={props.programPage} />}
    </>
  );
};

export default withDataAndLayout(Index, {
  includeEventConfiguration: true,
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
        title
        description
        sharingImage
      }
    }
  `,
  variables: {},
  layout: ({ props }) => ({
    responsive: true,
    customOpengraphMetadata: (): Metadata =>
      props?.programPage || {
        title: 'Program',
        description: 'Finn tider, rom og arrangementer under itDAGENE på NTNU.',
      },
  }),
});
