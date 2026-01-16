import React, { useState, useEffect } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { WelcomeScreen_currentMetaData } from '../../__generated__/WelcomeScreen_currentMetaData.graphql';
import Countdown from '../Countdown';
import styled from 'styled-components';
import { CenterIt } from '../Styled';
import { itdageneDarkBlue, itdageneBlue } from '../../utils/colors';
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

const ReadMore = styled('span')`
  display: inline-block;
  font-weight: bold;
  font-size: 1.125rem;
  background: white;
  border-radius: 2000px;
  padding: 20px 40px;
  color: ${itdageneBlue};
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
  const [isClient, setIsClient] = useState(false);

  const startDate = dayjs(currentMetaData.startDate);
  const endDate = dayjs(currentMetaData.endDate);

  // Effect only runs on the client, after the first render, to avoid hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToTarget = (): void => {
    const targetElement = document.getElementById('interest-schema-div');
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
              <b>it</b>DAGENE {String(currentMetaData.year)}{' '}
            </Header>

            <SubHeader>
              {`${startDate.date()}. & ${endDate.date()}. ${endDate
                .locale('nb')
                .format('MMMM')} ${startDate.year()}`}
            </SubHeader>
            <Location>NTNU Trondheim</Location>
          </FlexItem>
          <FlexItem>
            {isClient ? <Countdown currentMetaData={currentMetaData} /> : null}
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
