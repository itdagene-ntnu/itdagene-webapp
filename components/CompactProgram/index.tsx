import React from 'react';
import { CenterIt } from '../Styled';
import styled from 'styled-components';
import Link from 'next/link';
import {
  blueNCS,
  princetonOrange,
  skyBlue,
  indigoDye,
} from '../../utils/colors';

const DivWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-content: stretch;
`;

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

const Title = styled('h1')`
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const Tile = styled.div`
  background: ${(props: { color: string }): string => props.color};
  width: 25%;
  height: 100px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;

  :hover {
    transition: 0.2s;
    transform: scale(1.2);
  }

  @media only screen and (max-width: 767px) {
    width: 50%;
    transition: none;
  }
`;

const StyledLink = styled.a`
  color: white;
  font-size: 1.5em;
  line-height: 4;
  cursor: pointer;

  :hover {
    color: white;
  }
`;

const ReadMore = styled('h4')`
  margin-top: 40px;
`;

const CompactProgram = (): JSX.Element => (
  <DivWrapper>
    <DivItem>
      <Title>Hva skjer under itDAGENE?</Title>
    </DivItem>
    <Div>
      <Tile color={blueNCS}>
        <Link href="/jobb" legacyBehavior>
          <CenterIt text>
            <StyledLink>Jobb</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color={princetonOrange}>
        <Link href="/program" legacyBehavior>
          <CenterIt text>
            <StyledLink>Program</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color={skyBlue}>
        <Link href="/info/stands" legacyBehavior>
          <CenterIt text>
            <StyledLink>Stands</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color={indigoDye}>
        <Link href="/info/bankett" legacyBehavior>
          <CenterIt text>
            <StyledLink>Bankett</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
    </Div>

    <CenterIt text>
      <Link href="/program">
        <ReadMore>Les mer</ReadMore>
      </Link>
    </CenterIt>
  </DivWrapper>
);

export default CompactProgram;
