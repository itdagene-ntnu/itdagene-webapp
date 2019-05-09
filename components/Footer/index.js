import * as React from 'react';

import styled from 'styled-components';
import { FlexItem } from 'styled-flex-component';
import { ResponsiveContent, NoBulletUl } from '../Styled';
import { lightGrey } from '../../utils/colors';

const Container = styled('div')`
  padding: 2.5em 0em;
  border-top: 1px solid ${lightGrey};
  background-color: #f7f9fb;
`;

const InnerContainer = styled('div')`
  display: flex;
  wrap: nowrap;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const RightBorderFlex = styled(FlexItem)`
  border-right: 1px solid ${lightGrey};
  margin-right: 20px;
  padding-right: 20px;

  @media only screen and (max-width: 800px) {
    border-right: 0;
    margin-right: 10px;
  }
`;

const BottomAbout = styled('div')`
  width: 600px;

  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Footer = () => (
  <Container>
    <ResponsiveContent>
      <InnerContainer>
        <RightBorderFlex>
          <NoBulletUl>
            <li>
              <img
                style={{ width: 150 }}
                src="https://cdn.itdagene.no/itdagene2019-logo.svg"
                alt="itDAGENE logo"
              />
            </li>
            <li>Sem Sælands vei 7-9</li>
            <li>7491 Trondheim</li>
            <li>Orgnr. 912 601 625 </li>
          </NoBulletUl>
        </RightBorderFlex>
        <RightBorderFlex>
          <NoBulletUl>
            <li>
              <strong>Kontakt</strong>
            </li>
            <li>
              Styret •{' '}
              <a href="mailto:styret@itdagene.no">styret@itdagene.no </a>
            </li>
            <li>
              Webansvarlig •{' '}
              <a href="mailto:web@itdagene.no">web@itdagene.no </a>
            </li>
          </NoBulletUl>
          <NoBulletUl>
            <li>
              <strong>Teknologi</strong>
            </li>
            <li>
              Github •{' '}
              <a href="https://github.com/itdagene-ntnu">itdagene-ntnu</a>
            </li>
            <li>
              Docs • <a href="https://docs.itdagene.no">docs.itdagene.no</a>
            </li>
          </NoBulletUl>
        </RightBorderFlex>
        <BottomAbout>
          <NoBulletUl>
            <li>
              <strong>Om</strong>
            </li>
            <li>
              itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
              fremtidige arbeidsgivere. Messen arrangeres av studenter for
              studenter, overskuddet går til studentenes ekskursjon i
              tredjeklasse. itDAGENE arrangeres en gang i året av data- og
              kommunikasjonsteknologi ved NTNU i Trondheim.
            </li>
          </NoBulletUl>
        </BottomAbout>
      </InnerContainer>
    </ResponsiveContent>
  </Container>
);

export default styled(Footer)`
  padding: 5em 0em;
  border-top: 1px solid ${lightGrey};
  background-color: #f7f9fb;
`;
