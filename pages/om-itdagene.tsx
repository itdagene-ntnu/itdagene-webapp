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
import { SectionHeading } from '../components/DesignSystem';

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

const Index = ({
  props,
}: WithDataAndLayoutProps<omItdagene_QueryResponse>): JSX.Element => {
  const boardMembers = props.currentMetaData?.boardMembers || [];
  return (
    <>
      {props.omItdagene && <PageView page={props.omItdagene} />}
      {boardMembers.length > 0 && (
        <section className="board-section">
          <SectionHeading
            description="Studentene som planlegger og gjennomfører årets arrangement."
            title={`Styret ${props.currentMetaData?.year || ''}`}
          />
          <div className="board-grid">
            {sortBy(boardMembers, (member) => {
              const roleIndex = ROLES.indexOf(member.role || 'Medlem');
              return roleIndex === -1 ? ROLES.length : roleIndex;
            }).map((user) => (
              <BoardMember key={user.id} user={user} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

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
          linkedin
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
