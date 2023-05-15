import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../lib/withData';
import { omItdagene_QueryResponse } from '../__generated__/omItdagene_Query.graphql';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import { Collapse, Text, Link } from '@nextui-org/react';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const companyInformation = ({
  error,
  props,
}: WithDataAndLayoutProps<omItdagene_QueryResponse>): JSX.Element => {
  return (
    <>
      <Title>For bedrifter</Title>
      <Collapse.Group>
        <Collapse title="Når er fristen for å melde seg på?">
          <Text>
            itDAGENE 2023 er fullbooket, men dere kan sende en mail til
            bedrift@itdagene.no så kontakter vi dere for å melde interesse for
            2024.
          </Text>
        </Collapse>
        <Collapse title="Hva koster det å delta på itDAGENE?">
          <Text>
            For informasjon om priser på pakketilbudene og arrangementene vi
            tilbyr, ta kontakt med{' '}
            <a href="mailto:styret@itdagene.no">styret@itdagene.no </a>.
          </Text>
        </Collapse>
        <Collapse title="Hvor arrangeres itDAGENE?">
          <Text>itDAGENE arrangeres i underetasjen U1 på Realfagsbygget.</Text>
        </Collapse>
        <Collapse title="Hvem deltar på itDAGENE?">
          <Text>
            itDAGENE arrangeres av studenter ved Datateknologi og
            Kommunikasjonsteknologi & digital sikkerhet, men alle IT-studenter
            på Gløshaugen er velkommen!
          </Text>
        </Collapse>
        <Collapse title="Når står bedriftene på stand">
          <Text>Standområdet er åpent fra 10.00 til 16.00 begge dager.</Text>
        </Collapse>
      </Collapse.Group>
    </>
  );
};

export default withDataAndLayout(companyInformation, {
  query: graphql`
    query companyInformation_Query {
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
