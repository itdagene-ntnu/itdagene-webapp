import React from 'react';
import styled from 'styled-components';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const StyledLink = styled.a`
  cursor: pointer;
  transition: 0.2s;

  :hover {
    transform: scale(1.1);
    transition: 0.2s;
  }
`;

const Interest = (): JSX.Element => (
  <>
    <Flex justifyAround wrapReverse>
      <FlexItem grow={1} basis="700px">
        <Title>Løp for meg!</Title>
        <p>
          I år er vi kjempestolte av å fortelle at itDAGENE, i samarbeid med vår
          HSP ITverket, skal støtte Barnekreftforeningen gjennom prosjektet{' '}
          <q>Løp for meg</q>! Ta deg en løpetur eller fem i september, og støtt
          Barnekreftforeningen med penger. Alt du må gjøre er å scanne QR-koden
          i linken under, løpe, og så har du til og med mulighet til å vinne
          noen rimelig bra premier!
        </p>
      </FlexItem>
      <FlexItem>
        <CenterIt>
          <Image
            style={{ width: 350, maxWidth: '100%' }}
            src="https://bkf.itverket.no/static/media/BKF-logo-lopformeg-liggende-RGB.9dc0e941ec780e9c3b67.png"
            alt="Barnekreftforeningens 'Løp for meg'"
          />
        </CenterIt>
      </FlexItem>
    </Flex>
    <CenterIt text>
      <StyledLink href="/run-for-me" target="_blank">
        <h3>Gå til oversikt</h3>
      </StyledLink>
    </CenterIt>
  </>
);

export default Interest;
