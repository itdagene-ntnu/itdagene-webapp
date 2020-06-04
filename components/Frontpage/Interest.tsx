import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Flex, { FlexItem } from 'styled-flex-component';
import { Image, CenterIt } from '../Styled';

const Title = styled('h1')`
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const Interest = (): JSX.Element => (
  <>
    <Flex justifyAround wrapReverse>
      <FlexItem grow={1} basis="700px">
        <Title>Interessert i å delta? </Title>
        {/*}<p>
          Henvendelser angående interesse for itDAGENE 2020 er nå åpent. Vi
          ønsker å påpeke at dette <b>IKKE er et påmeldingskjema</b>, og det er
          <b> IKKE</b> førsteman til mølla. Under finner dere en lenke til vårt
          nye interesseskjema hvor din bedrift kan melde sin interesse for
          itDAGENE 2020.
          </p>*/}
        <p>
          Henvendelser angående deltakelse på itDAGENE 2020 kan sendes på mail
          til{' '}
          <a href="mailto:bedrift@itdagene.no" target="_blank" rel="noreferrer">
            bedrift@itdagene.no
          </a>
          . For mer informasjon angående itDAGENE 2020, se våre{' '}
          <Link href="/info/[side]" as="/info/for-bedrifter">
            infosider
          </Link>
          .
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
  </>
);

export default Interest;
