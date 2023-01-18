import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { program_QueryResponse } from '../__generated__/program_Query.graphql';
import PageView from '../components/PageView';
import ProgramView from '../components/Program/ProgramView';
import styled from 'styled-components';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

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
        // showToggleButton
        // useLinks
      />
    ) : (
      <Div>
        <DivItem>
          <h1>Programmet er tomt</h1>
        </DivItem>
      </Div>
    )}
  </>
);

export default withDataAndLayout(Index, {
  query: graphql`
    query program_Query {
      stands {
        ...ProgramView_stands
      }
      events {
        ...ProgramView_events
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
