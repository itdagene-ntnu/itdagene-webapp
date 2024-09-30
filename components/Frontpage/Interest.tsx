import React from 'react';
import styled from 'styled-components';
import { Image, CenterIt } from '../Styled';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

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

type Props = {
  form: string;
};

const Interest = ({ form }: Props): JSX.Element => (
  <>
    <Flex flexWrap="wrap-reverse" alignContent="space-around">
      <FlexItem flexBasis="700px" flexGrow="1">
        <Title>Interessert i å delta? </Title>
        <p>
          Interesseskjemaet for itDAGENE 2025 er nå åpent. Frist for å melde
          interesse er <b>16. mars 2025</b>. Vi ønsker å påpeke at dette kun er
          for å kartlegge interesse og at det ikke er et påmeldingsskjema. Under
          finner dere en lenke til vårt nye interesseskjema hvor din bedrift kan
          melde sin interesse for itDAGENE 2025.
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
      <StyledLink href={form} target="_blank" rel="noreferrer">
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
