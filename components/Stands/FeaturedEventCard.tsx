import { Dayjs } from 'dayjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'relay-hooks';
import styled from 'styled-components';
import { FeaturedEventCard_stand } from '../../__generated__/FeaturedEventCard_stand.graphql';
import { EllipseOverflowDiv } from '../Styled';
import { CompanyInfo, Divider, SubHeader } from './CompanyCardInfo';
import {
  CompanyImg,
  EventTitle,
  getCurrentEvent,
  StandardContainer,
  standEvent,
} from './StandCard';

interface FeaturedEventCard {
  stand: FeaturedEventCard_stand;
  time: Dayjs;
}

const FeaturedEventCard = ({ stand, time }: FeaturedEventCard): JSX.Element => {
  const [currentEvent, setCurrentEvent] = useState<standEvent | null>();

  useEffect(() => {
    const newCurrentEvent = getCurrentEvent(stand.events ?? [], time);
    setCurrentEvent(newCurrentEvent);
  }, [time, stand]);

  return (
    <Link href={`/stands/${stand.slug}`}>
      <StandardContainer scale={1.03}>
        <FeatCompanyImgContainer>
          <CompanyImg src={stand.company.logo ?? ''} />
        </FeatCompanyImgContainer>
        <Divider />
        <CompanyInfo>
          <EllipseOverflowDiv maxLines={2} smallScreenMaxLines={3}>
            <SubHeader>{currentEvent ? currentEvent.title : '🤷🏼‍♀️'}</SubHeader>
          </EllipseOverflowDiv>
          <EllipseOverflowDiv maxLines={2} smallScreenMaxLines={1}>
            <EventTitle>
              {currentEvent ? currentEvent.description : ''}
            </EventTitle>
          </EllipseOverflowDiv>
        </CompanyInfo>
      </StandardContainer>
    </Link>
  );
};

const FeatCompanyImgContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 60px;
  width: 100%;
`;

export default createFragmentContainer(FeaturedEventCard, {
  stand: graphql`
    fragment FeaturedEventCard_stand on Stand {
      id
      slug
      events {
        id
        title
        description
        date
        timeStart
        timeEnd
        type
      }
      company {
        id
        logo
      }
    }
  `,
});
