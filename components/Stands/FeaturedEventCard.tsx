import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'relay-hooks';
import styled from 'styled-components';
import { FeaturedEventCard_stand } from '../../__generated__/FeaturedEventCard_stand.graphql';
import { CompanyInfo, Divider, SubHeader } from './CompanyCardInfo';
import { CompanyImg, EventTitle, StandardContainer } from './StandCard';

interface FeaturedEventCard {
  stand: FeaturedEventCard_stand;
}

const FeaturedEventCard = ({ stand }: FeaturedEventCard): JSX.Element => {
  return (
    <StandardContainer scale={1.03}>
      <FeatCompanyImgContainer>
        <CompanyImg src={stand?.company.logo ?? ''} />
      </FeatCompanyImgContainer>
      <Divider />
      <CompanyInfo>
        <SubHeader>Tema:</SubHeader>
        <EventTitle>
          Open Source i Equinor (diskusjon/debatt med ansatte i Equinor) Open
        </EventTitle>
      </CompanyInfo>
    </StandardContainer>
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
