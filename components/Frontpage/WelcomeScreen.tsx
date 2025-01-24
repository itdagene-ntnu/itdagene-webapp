import React, { useRef } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { WelcomeScreen_currentMetaData } from '../../__generated__/WelcomeScreen_currentMetaData.graphql';
import Countdown from '../Countdown';
import Link from 'next/link';
import styled from 'styled-components';
import { CenterIt } from '../Styled';
import { itdageneDarkBlue } from '../../utils/colors';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';
import { Button } from '@mui/material';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData;
};

const MainContainer = styled(CenterIt)`
  @media only screen and (min-width: 800px) {
    background: rgba(0, 0, 0, 0.2);
  }
  height: 100%;
  min-height: 400px;
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
  margin: 0;
  font-size: 4em !important;
  color: white;
  font-weight: normal;
  margin-bottom: 0;
  text-shadow: 3px 2px 3px rgba(0, 0, 0, 0.4);
`;

const SubHeader = styled('h2')`
  margin: 0;
  color: white;
  text-shadow: 3px 2px 3px rgba(0, 0, 0, 0.4);
`;

const Location = styled('h3')`
  text-shadow: 3px 2px 3px rgba(0, 0, 0, 0.4);
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
  height: auto;
  // max-height: 500px;
  @media only screen and (max-width: 800px) {
    display: none;
  }
`;

const RootContainer = styled('div')`
  max-height: 800px;
  @media only screen and (max-width: 800px) {
    background: ${itdageneDarkBlue};
    min-height: 700px;
  }
  height: 75%;
  position: relative;
  overflow: hidden;
`;

const WelcomeScreen = ({ currentMetaData }: Props): JSX.Element => {
  const startDate = dayjs(currentMetaData.startDate);
  const endDate = dayjs(currentMetaData.endDate);
  const scrollToTarget = () => {
    const targetElement = document.getElementById('interesse-skjema-div'); // Use the id of the target div
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <RootContainer>
      <Video
        autoPlay
        preload="auto"
        className="cover-video"
        loop
        muted
        src="https://cdn.itdagene.no/itdagene.mp4"
      />
      <MainContainer text>
        <Flex flexDirection="column" alignContent="space-between">
          <FlexItem>
            <Header>
              <b>it</b>DAGENE {currentMetaData.year}
            </Header>

            <SubHeader>
              {`${startDate.date()}. & ${endDate.date()}. ${endDate
                .locale('nb')
                .format('MMMM')} ${startDate.year()}`}
            </SubHeader>
            <Location>NTNU Trondheim</Location>
          </FlexItem>
          <FlexItem>
            <Countdown currentMetaData={currentMetaData} />
          </FlexItem>
        </Flex>

        <Button onClick={scrollToTarget}>
          <ReadMore>Meld interesse!</ReadMore>
        </Button>
      </MainContainer>
    </RootContainer>
  );
};

export default createFragmentContainer(WelcomeScreen, {
  currentMetaData: graphql`
    fragment WelcomeScreen_currentMetaData on MetaData {
      year
      startDate
      ...Countdown_currentMetaData
      endDate
    }
  `,
});
