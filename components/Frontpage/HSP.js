import React from 'react';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';
import styled from 'styled-components';

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

const HSP = () => (
  <Flex justifyAround wrap>
    <FlexItem>
      <CenterIt text>
        <Title>Hovedsamarbeidspartner</Title>
      </CenterIt>
    </FlexItem>
    <FlexItem grow={1} basis="500px">
      <FlexItem>
        <a href="http://www.bouvet.no/">
          <HSPLogo src="static/bouvet_logo.png" alt="bouvet logo" />
        </a>
      </FlexItem>
      <CenterIt text>
        <p>
          <b>Vi er stolte av å kunne presentere Bouvet som HSP i 2019.</b>
        </p>
        <p>
          «Dette samarbeidet er vi svært stolte av! Vi er opptatt av at
          studenter skal få muligheten til å se hva potensielle arbeidsgivere
          kan tilby, samt å skape en dialog med studentene, slik at de får en
          bedre forståelse for hva som kreves av de senere. Dette er et
          arrangement som er like positivt for bedriftene som studentene, og det
          er nettopp dette som gjør at vi ønsket å være med som hovedsponsor»
          <i>
            <br /> - Eirik Vefsnmo, Reg. dir Bovuet Region Nord.
          </i>
        </p>
      </CenterIt>
    </FlexItem>
  </Flex>
);
export default HSP;
