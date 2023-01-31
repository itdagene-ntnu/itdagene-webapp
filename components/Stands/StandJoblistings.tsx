import React from 'react';
import Link from 'next/link';
import Loading from '../LoadingIndicator';
import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import { StandJoblistings_joblistings$key } from '../../__generated__/StandJoblistings_joblistings.graphql';
import { JoblistingItem } from '../Joblistings/JoblistingsContainer';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

const StyledH1 = styled.h1`
  font-weight: 100;
`;

type Props = {
  company: StandJoblistings_joblistings$key;
};

const StandJoblistings = (props: Props): JSX.Element => {
  const company = useFragment(
    graphql`
      fragment StandJoblistings_joblistings on Company {
        joblistings(first: 3) {
          edges {
            node {
              ...JoblistingsContainer_joblisting
            }
          }
        }
        id
        name
      }
    `,
    props.company
  );

  return company ? (
    company.joblistings?.edges && company.joblistings.edges.length > 0 ? (
      <div>
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          style={{ alignItems: 'center' }}
        >
          {company.joblistings.edges.map(
            (e, i) => e?.node && <JoblistingItem node={e.node} key={i} />
          )}
        </Flex>
        <Flex justifyContent="center" style={{ alignItems: 'center' }}>
          <h3>
            <Link
              href={`/jobb?company=${company.id}&companyName=${company.name}`}
            >
              Flere annonser
            </Link>
          </h3>
        </Flex>
      </div>
    ) : (
      <Flex justifyContent="center" style={{ alignItems: 'center' }}>
        <FlexItem>
          <StyledH1>Ingen jobbannonser</StyledH1>
        </FlexItem>
      </Flex>
    )
  ) : (
    <Loading />
  );
};

export default StandJoblistings;
