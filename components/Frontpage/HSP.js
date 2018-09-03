import React from 'react';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';
import styled from 'styled-components';

const HSPLogo = styled(Image)`
  width: 350px;
  max-width: 100%;
  padding-bottom: 14px;
`;

const MiscPhoto = styled(Image)`
  width: 450px;
  max-width: 100%;
  padding: 25px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;

const HSP = () => (
  <Flex justifyAround wrapReverse>
    <FlexItem grow={1} basis="500px">
      <CenterIt>
        <h1>Hovedsamarbeidspartner</h1>
        <p>
          <i>
            Vi er stolte av å kunne presentere ITverket AS som
            hovedsamarbeidspartner i 2018.
          </i>
        </p>
        <h2>Hvem er ITverket?</h2>
        <p>
          <i>
            «ITverket er et konsulentselskap lokalisert i Oslo med 72 engasjerte
            ansatte fordelt på avdelingene våre for systemutvikling (Java og
            .NET), prosjektledelse og front-end. Hos oss har vi en god miks av
            erfarne konsulenter og nyutdannede, fremmadstormende talenter. Vi
            lever etter våre verdier som sier at vi skal være «pålitelige, lekne
            og fleksible» både overfor våre kunder, men også internt. Vi setter
            mennesket i fokus og ønsker at våre konsulenter skal utvikle seg
            både faglig og personlig. Dette vil også kundene våre dra stor nytte
            av. En fornøyd ansatt er en produktiv ansatt. Vi har jobbet spesielt
            aktivt på NTNU de siste 7-8 årene for å tiltrekke oss flere gode
            ITverkere og vi har gjort dette med stor suksess. 25 av våre ansatte
            er ansatt etter å ha vært med på våre sommerprosjekter. »
          </i>
          <br /> - Tom Henrik N. Rogstad, Adm. dir.
        </p>
      </CenterIt>
    </FlexItem>
    <FlexItem>
      <a href="http://www.itverket.no/">
        <HSPLogo src="static/itverket.png" alt="ITverket logo" />
      </a>
      <a href="http://www.itverket.no/">
        <MiscPhoto
          src="https://odinugedal.no/itverket_hopper.jpg"
          alt="Bilde av itverket, hoppende"
        />
      </a>
    </FlexItem>
  </Flex>
);
export default HSP;
