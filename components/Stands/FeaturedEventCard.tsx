import { Dayjs } from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'relay-hooks';
import styled from 'styled-components';
import { FeaturedEventCard_stand } from '../../__generated__/FeaturedEventCard_stand.graphql';
import { CompanyInfo, Divider, SubHeader } from './CompanyCardInfo';
import {
  CompanyImg,
  eventTime,
  EventTitle,
  getCurrentEvent,
  StandardContainer,
} from './StandCard';

interface FeaturedEventCard {
  stand: FeaturedEventCard_stand;
  time: Dayjs;
}

const FeaturedEventCard = ({ stand, time }: FeaturedEventCard): JSX.Element => {
  return (
    <Link href={`/stands/${stand.slug}`}>
      <StandardContainer scale={1.03}>
        <FeatCompanyImgContainer>
          <CompanyImg src={stand?.company.logo ?? ''} />
        </FeatCompanyImgContainer>
        <Divider />
        <CompanyInfo>
          <SubHeader>
            {eventTime(getCurrentEvent(stand.events, time)).eventTitle}
          </SubHeader>
          <EventTitle>
            {eventTime(getCurrentEvent(stand.events, time)).eventDescription}
          </EventTitle>
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
