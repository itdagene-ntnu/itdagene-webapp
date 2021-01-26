import React from 'react';
import styled from 'styled-components';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';

const Title = styled('h1')`
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
        <Title>Interessert i å delta? </Title>
        <p>
          Henvendelser angående interesse for itDAGENE 2021 er nå åpent. Vi
          ønsker å påpeke at dette <b>IKKE er et påmeldingskjema</b>, og det er
          <b> IKKE</b> førsteman til mølla. Under finner dere en lenke til vårt
          nye interesseskjema hvor din bedrift kan melde sin interesse for
          itDAGENE 2021.
        </p>
      </FlexItem>
      <FlexItem>
        <CenterIt>
          <Image
            style={{ width: 350, maxWidth: '100%' }}
            src="https://cdn.itdagene.no/exhibit.png"
            alt="itDAGENE logo"
          />
        </CenterIt>
      </FlexItem>
    </Flex>
    <CenterIt text>
      <StyledLink href="https://interesse.itdagene.no" target="_blank">
        <Image
          style={{ width: 50 }}
          src="https://cdn.onlinewebfonts.com/svg/img_193664.png"
          alt="signup"
        />
        <h3>Interesseskjema</h3>
      </StyledLink>
    </CenterIt>
  </>
);

export default Interest;
