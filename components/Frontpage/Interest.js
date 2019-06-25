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

const Interest = () => (
  <>
    <Flex justifyAround wrapReverse>
      <FlexItem grow={1} basis="700px">
        <Title>Interessert i å delta? </Title>
        <p>
          Vi gjør oppmerksom på at itDAGENE 2019 nå er <b>fylt opp</b> med over
          60 spennende bedrifter. Det betyr dessverre at alle nye henvendelser
          havner på venteliste. Ta kontakt{' '}
          <a href="mailto:bedrift@itdagene.no">her</a> hvis dere ønsker dette.
        </p>
        <p>
          Henvendelser angående interesse for itDAGENE 2020 åpner vi etter at
          messen 2019 er over. Dvs fra og med <b>11 september</b>. Under finner
          dere vårt nye interesseskjema hvor din bedrift kan melde interesse.
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
          src="http://cdn.onlinewebfonts.com/svg/img_193664.png"
          alt="signup"
        />
        Interesseskjema
      </StyledLink>
    </CenterIt>
  </>
);

export default Interest;
