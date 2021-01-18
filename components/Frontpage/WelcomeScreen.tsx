import React, { useEffect, useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { WelcomeScreen_currentMetaData } from '../../__generated__/WelcomeScreen_currentMetaData.graphql';
import Countdown from '../Countdown';
import Link from 'next/link';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { CenterIt } from '../Styled';
import { itdageneDarkBlue } from '../../utils/colors';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { timeIsAfter, toDayjs } from '../../utils/time';
import StandsButton from './StandsButton';

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

const LiveHeader = styled.span`
  position: relative;
  display: inline-block;
  border-radius: 5px;
  color: #f05454;
  font-weight: 900;
  stroke: white;
  font-size: 35px;
  text-shadow: 3px 2px 3px rgba(0, 0, 0, 0.4);

  -webkit-text-stroke-width: 0.75px;
  -webkit-text-stroke-color: white;
`;

// Update the currentEvent-list every sec
const intervalLength = 1000 * 1;

const WelcomeScreen = ({ currentMetaData }: Props): JSX.Element => {
  const [time, setTime] = useState(dayjs());
  const [active, setActive] = useState(false);

  const startDate = dayjs(currentMetaData.startDate);
  const endDate = dayjs(currentMetaData.endDate);

  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), intervalLength);
    return (): void => clearInterval(interval);
  }, []);

  // TODO: Double-check this logic
  useEffect(() => {
    const beforeEventStart = timeIsAfter({
      time: time,
      start: toDayjs(currentMetaData.startDate, '09:30:00'),
    });
    setActive(!beforeEventStart);
  }, [currentMetaData, active, time]);

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
        <Flex column contentSpaceBetween>
          <FlexItem>
            <Header>
              <b>it</b>DAGENE {currentMetaData.year}
            </Header>

            {active ? (
              <Flex justifyBetween alignCenter style={{ marginBottom: '10px' }}>
                <SubHeader>
                  {`${startDate.date()}. & ${endDate.date()}. ${endDate
                    .locale('nb')
                    .format('MMMM')} ${startDate.year()}`}
                </SubHeader>
                <LiveHeader>LIVE NÅ</LiveHeader>
              </Flex>
            ) : (
              <SubHeader>
                {`${startDate.date()}. & ${endDate.date()}. ${endDate
                  .locale('nb')
                  .format('MMMM')} ${startDate.year()}`}
              </SubHeader>
            )}
            {!active && <Location>Digitalt // itdagene.no</Location>}
          </FlexItem>
          <FlexItem>
            {active ? (
              <StandsButton />
            ) : (
              <Countdown currentMetaData={currentMetaData} />
            )}
          </FlexItem>
        </Flex>
        {!active && (
          <Link href="/om-itdagene">
            <a>
              <ReadMore>Les mer</ReadMore>
            </a>
          </Link>
        )}
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
