//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { type WelcomeScreen_currentMetaData } from './__generated__/WelcomeScreen_currentMetaData.graphql';
import Countdown from '../Countdown';
import { itdageneBlue } from '../../utils/colors';
import Link from 'next/link';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { CenterIt } from '../Styled';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData
};

const MainContainer = styled(CenterIt)`
  @media only screen and (min-width: 800px) {
    background: rgba(0, 0, 0, 0.2);
  }
  height: 100%;
  minheight: 400px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: auto;
  right: 0;
  width: 100%;
  padding-bottom: 170px;
  color: white;
`;

const Header = styled('h1')`
  font-size: 4em !important;
  color: white;
  font-weight: normal;
  margin-bottom: 0;
`;

const SubHeader = styled('h2')`
  margin: 0;
  color: white;
`;

const ReadMore = styled('h4')`
  background: white;
  border-radius: 2000px;
  padding: 20px 40px;
`;

const Video = styled('video')`
  margin: 0;
  width: 100%;
  @media only screen and (max-width: 800px) {
    display: none;
  }
`;
const RootContainer = styled('div')`
  max-height: 800px;
  @media only screen and (max-width: 800px) {
    background: #123962;
    min-height: 700px;
  }
  height: 75%;
  position: relative;
  overflow: hidden;
`;

const WelcomeScreen = ({ currentMetaData }: Props) => (
  <RootContainer>
    <Video
      autoPlay
      autostart
      className="cover-video"
      loop
      muted
      src="https://odinugedal.no/itdagene.mp4"
    />
    <MainContainer text>
      <Flex column spaceBetween>
        <FlexItem>
          <Header>
            <b>it</b>DAGENE {currentMetaData.year}
          </Header>
          <SubHeader>10. & 11. september 2018</SubHeader>
          <h3 style={{ color: 'white' }}>NTNU // Glassgården</h3>
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
  </RootContainer>
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
