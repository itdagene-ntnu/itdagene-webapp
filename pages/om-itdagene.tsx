import * as React from 'react';
import { graphql } from 'react-relay';
import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../lib/withData';
import BoardMember from '../components/BoardMember';
import { omItdagene_QueryResponse } from '../__generated__/omItdagene_Query.graphql';
import PageView from '../components/PageView';
import { sortBy } from 'lodash';
import styled from 'styled-components';

const ROLES = [
  'Leder',
  'Nestleder',
  'Økonomi',
  'Bedriftsansvarlig',
  'Bedrift',
  'Bankett',
  'Logistikk',
  'Markedsføring',
  'Web',
  'Medlem',
];

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: stretch
  align-items: center;
  justify-content: center;`;

const Index = ({
  error,
  props,
}: WithDataAndLayoutProps<omItdagene_QueryResponse>): JSX.Element => (
  <>
    {props.omItdagene && <PageView page={props.omItdagene} />}
    <h1>Styret {props.currentMetaData && props.currentMetaData.year}</h1>
    <Div>
      {sortBy(props.currentMetaData.boardMembers, (m) =>
        ROLES.indexOf(m.role || 'Medlem')
      ).map((user) => (
        <BoardMember key={user.id} user={user} />
      ))}
    </Div>
  </>
);

export default withDataAndLayout(Index, {
  query: graphql`
    query omItdagene_Query {
      currentMetaData {
        year
        id
        boardMembers {
          ...BoardMember_user
          id
          role
          fullName
        }
      }

      omItdagene: page(slug: "om-itdagene") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }: WithDataDataProps<omItdagene_QueryResponse>) => ({
    responsive: true,
    metadata: props ? props.omItdagene : undefined,
  }),
});
