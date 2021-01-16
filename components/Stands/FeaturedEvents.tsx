import React from 'react';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import { stands_QueryResponse } from '../../__generated__/stands_Query.graphql';
import FeaturedEventCard from './FeaturedEventCard';
import { currentHalfhour } from '../../utils/time';
import { Dayjs } from 'dayjs';
import ProgramButton from './ProgramButton';
import { PaddedDivider, SubHeader } from '../Styled';

interface FeaturedEventsProps {
  stands: NonNullable<stands_QueryResponse['stands']>;
  time: Dayjs;
}

const FeaturedEvents = ({ stands, time }: FeaturedEventsProps): JSX.Element => {
  return (
    <div>
      <Flex justifyBetween wrap>
        <FeaturedEventsInfo>
          <Flex wrap>
            <Header>Halvtimens bedrifter:</Header>
            <Time>{currentHalfhour(time)}</Time>
          </Flex>
          <SubHeader>
            Trykk på bedriftene under for å se hva de har forberedt for sin
            halvtime
          </SubHeader>
        </FeaturedEventsInfo>
        <ProgramButton />
      </Flex>
      <FeatStandGrid>
        {/* Show a maximum of 5 featured stands */}
        {stands
          .slice(Math.max(stands.length - 5, 0))
          .map(
            (stand) =>
              stand && (
                <FeaturedEventCard key={stand.id} stand={stand} time={time} />
              )
          )}
      </FeatStandGrid>
      <PaddedDivider />
    </div>
  );
};

const FeaturedEventsInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const Header = styled.h1<{ shadow?: boolean }>`
  margin: 0;
  margin-right: 10px;
  font-weight: 600;
  text-shadow: ${(props): string =>
    props.shadow ? '0px 0px 5px rgba(0, 0, 0, 0.4)' : 'none'};

  @media only screen and (max-width: 992px) {
    font-size: 26px;
  }
`;

const Time = styled(Header)`
  font-weight: 300;
`;

const FeatStandGrid = styled('div')`
  display: grid;
  margin: 25px 0;
  width: 100%;
  gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

export default FeaturedEvents;
