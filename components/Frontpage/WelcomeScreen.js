//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WelcomeScreen_currentMetaData } from './__generated__/WelcomeScreen_currentMetaData.graphql';
import Countdown from '../Countdown';
import Link from 'next/link';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { CenterIt } from '../Styled';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData
};

const MainContainer = styled(CenterIt)`
  padding-top: 160px;
  padding-bottom: 170px;
  color: white;
`;

const Header = styled('h1')`
  font-size: 4em !important;
  font-weight: normal;
  margin-bottom: 0;
`;

const SubHeader = styled('h2')`
  margin: 0;
`;

const ReadMore = styled('h4')`
  background: white;
  border-radius: 2000px;
  padding: 20px 40px;
`;

const WelcomeScreen = ({ currentMetaData }: Props) => (
  <div>
    <MainContainer text>
      <Flex column spaceBetween>
        <FlexItem>
          <Header>
            <b>it</b>DAGENE {currentMetaData.year}
          </Header>
          <SubHeader>10. & 11. september 2018</SubHeader>
          <h3>NTNU // Glassgården</h3>
        </FlexItem>
        <FlexItem>
          <Countdown currentMetaData={currentMetaData} />
        </FlexItem>
      </Flex>

      <Link href="/om-itdagene">
        <a>
          <ReadMore>Les mer</ReadMore>
        </a>
      </Link>
    </MainContainer>
  </div>
);

export default createFragmentContainer(
  WelcomeScreen,
  graphql`
    fragment WelcomeScreen_currentMetaData on MetaData {
      year
      startDate
      ...Countdown_currentMetaData
      endDate
    }
  `
);
