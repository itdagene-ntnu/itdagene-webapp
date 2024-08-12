import * as React from 'react';
import styled from 'styled-components';
import { ResponsiveContent, NoBulletUl } from '../Styled';
import { lightGrey } from '../../utils/colors';

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

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

const RightBorderFlex = styled(DivItem)`
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

const Footer = (): JSX.Element => (
  <Container>
    <ResponsiveContent>
      <InnerContainer>
        <RightBorderFlex>
          <NoBulletUl>
            <li>
              <img
                style={{ width: 150 }}
                src="https://cdn.itdagene.no/itdagene-svart.png"
                alt="itDAGENE logo"
              />
            </li>
            <li>Sem Sælands vei 7-9</li>
            <li>7034 Trondheim</li>
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
              <a
                href="https://github.com/itdagene-ntnu"
                target="_blank"
                rel="noreferrer"
              >
                itdagene-ntnu
              </a>
            </li>
            <li>
              Docs •{' '}
              <a
                href="https://docs.itdagene.no"
                target="_blank"
                rel="noreferrer"
              >
                docs.itdagene.no
              </a>
            </li>
          </NoBulletUl>
        </RightBorderFlex>
        <BottomAbout>
          <NoBulletUl>
            <li>
              <strong>Om oss</strong>
            </li>
            <li>
              itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
              fremtidige arbeidsgivere. Messen arrangeres én gang i året av
              data- og cybersikkerhetsstudenter ved NTNU i Trondheim.
              Overskuddet går til studentenes ekskursjon i tredjeklasse.
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
