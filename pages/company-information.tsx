import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../lib/withData';
import { omItdagene_QueryResponse } from '../__generated__/omItdagene_Query.graphql';
import { graphql } from 'react-relay';
import styled from 'styled-components';

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
      <div>
        itDAGENE ønsker å vise studentene på Gløshaugen hva teknologiverden har
        å by på, og vi håper derfor at deres bedrift vil være med å bidra til å
        gjøre itDAGENE til en av Norges beste arbeidslivsmesser! Har du noen
        spørsmål er det bare å ta kontakt via mail: bedrift@itdagene.no
      </div>
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
