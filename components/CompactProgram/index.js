import React from 'react';
import Flex, { FlexItem } from 'styled-flex-component';
import { CenterIt } from '../Styled';
import styled from 'styled-components';
import Link from 'next/link';

const Title = styled('h1')`
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const Tile = styled.div`
  background: ${props => props.color};
  width: 25%;
  height: 100px;
  transition: all 0.1s ease-in-out;

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

const CompactProgram = () => (
  <Flex justifyAround column>
    <FlexItem>
      <Title>Hva skjer under itDAGENE?</Title>
    </FlexItem>
    <Flex row wrap>
      <Tile color="#3ab07b">
        <Link href="/program">
          <CenterIt text>
            <StyledLink>Sommerjobb</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color="#e01e5b">
        <Link href="/program">
          <CenterIt text>
            <StyledLink>Kurs</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color="#41c0eb">
        <Link href="/info?side=stands">
          <CenterIt text>
            <StyledLink>Stands</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
      <Tile color="#f4c20e">
        <Link href="/info?side=bankett">
          <CenterIt text>
            <StyledLink>Bankett</StyledLink>
          </CenterIt>
        </Link>
      </Tile>
    </Flex>
  </Flex>
);
export default CompactProgram;
