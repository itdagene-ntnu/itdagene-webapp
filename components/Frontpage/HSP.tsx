import React from 'react';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';
import styled from 'styled-components';
import { Player } from 'video-react';

const HSPLogo = styled(Image)`
  width: 450px;
  max-width: 100%;
  margin-top: 10px;
`;

/*
const MiscPhoto = styled(Image)`
  width: 450px;
  max-width: 100%;
  padding: 25px;
  @media only screen and (max-width: 767px) {
    padding: 0;
  }
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;
*/
const Title = styled('h1')`
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const HSP = (): JSX.Element => (
  <Flex justifyAround column>
    <FlexItem>
      <CenterIt text>
        <Title>Hovedsamarbeidspartner</Title>
      </CenterIt>
    </FlexItem>
    <FlexItem>
      <FlexItem>
        <a href="http://www.bouvet.no/">
          <HSPLogo src="static/bouvet_logo.png" alt="bouvet logo" />
        </a>
      </FlexItem>
      <CenterIt text>
        <p>
          <b>Vi er stolte av å kunne presentere Bouvet som HSP i 2020.</b>
        </p>

        <h3>
          Er du nysgjerrig på hvorfor de egentlig heter Bouvet? Eller lurer du
          på hva de gjør, hva de står for, hva de bidrar til for samfunnet og
          hva som betyr litt ekstra for dem?
        </h3>
        <h3>↓ Da anbefaler vi å ta en titt på denne filmen ↓</h3>
        <Player
          playsInline
          poster="https://cdn.itdagene.no/placeholder.png"
          src="https://cdn.itdagene.no/Bouvet.mp4"
        />
      </CenterIt>
    </FlexItem>
  </Flex>
);
export default HSP;
