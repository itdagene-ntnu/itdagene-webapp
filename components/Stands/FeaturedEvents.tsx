import React from 'react';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import { Divider } from './CompanyCardInfo';
import FeaturedEventCard from './FeaturedEventCard';

import { itdageneBlue } from '../../utils/colors';
import Link from 'next/link';

interface FeaturedEventsProps {
  stands: NonNullable<stands_QueryResponse['stands']>;
}

const FeaturedEvents = ({ stands }: FeaturedEventsProps) => {
  return (
    <div>
      <Flex justifyBetween wrap>
        <Flex column>
          <Flex wrap>
            <Header>Halvtimens bedrifter:</Header>
            <Time>10:30-11:00</Time>
          </Flex>
          <SubHeader>
            Trykk på bedriftene under for å se hva de har forberedt for sin
            halvtime
          </SubHeader>
        </Flex>
        <Link href={'/program'}>
          <ProgramButtonContainer>
            <ProgramButtonText>Program itDAGENE</ProgramButtonText>
          </ProgramButtonContainer>
        </Link>
      </Flex>
      <FeatStandGrid>
        {stands
          .slice(Math.max(stands.length - 5, 0))
          .map((stand) => stand && <FeaturedEventCard stand={stand} />)}
      </FeatStandGrid>
      <PaddedDivider />
    </div>
  );
};

const ProgramButtonContainer = styled.div`
  display: flex;
  max-width: 300px;
  flex: 1 1 150px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
  border: 2px solid ${itdageneBlue};
  color: ${itdageneBlue};
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media only screen and (max-width: 992px) {
    display: none;
  }

  @media only screen and (max-width: 1199px) {
    max-width: 150px;
    font-size: 10px;
  } ;
`;

const Header = styled.h1`
  margin: 0;
  margin-right: 10px;
  font-weight: 600;

  @media only screen and (max-width: 992px) {
    font-size: 26px;
  }
`;

const ProgramButtonText = styled.h1`
  margin: 0;
  font-weight: 600;
  margin-right: 10px;
  font-size: 22px;

  @media only screen and (max-width: 1199px) {
    font-size: 15px;
  }
`;

const Time = styled(Header)`
  font-weight: 300;
`;

const SubHeader = styled.h3`
  margin: 0;
  font-weight: 300;
`;

const PaddedDivider = styled(Divider)`
  margin: 50px 0 50px 0;
`;

const FeatStandGrid = styled('div')`
  display: grid;
  margin: 25px 0;
  width: 100%;
  gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

export default FeaturedEvents;
