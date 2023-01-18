import React from 'react';
import Link from 'next/link';
import Loading from '../LoadingIndicator';
import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import { StandJoblistings_joblistings$key } from '../../__generated__/StandJoblistings_joblistings.graphql';
import { JoblistingItem } from '../Joblistings/JoblistingsContainer';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: stretch;
  align-items: center;
  justify-content: center;
`;

const Div2 = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: center;
  justify-content: center;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

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
        <Div>
          {company.joblistings.edges.map(
            (e, i) => e?.node && <JoblistingItem node={e.node} key={i} />
          )}
        </Div>
        <Div2>
          <h3>
            <Link
              href={`/jobb?company=${company.id}&companyName=${company.name}`}
            >
              Flere annonser
            </Link>
          </h3>
        </Div2>
      </div>
    ) : (
      <Div2>
        <DivItem>
          <StyledH1>Ingen jobbannonser</StyledH1>
        </DivItem>
      </Div2>
    )
  ) : (
    <Loading />
  );
};

export default StandJoblistings;
