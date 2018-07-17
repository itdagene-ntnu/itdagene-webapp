//@flow
import React from 'react';

import { Section } from '../components/Styled';
import { Image, CenterIt } from '../components/Styled';
import { QueryRenderer, graphql } from 'react-relay';

import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';
import Collaborators from '../components/Collaborators/Collaborators';
import Companies from '../components/Companies/Companies';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import HSP from '../components/Frontpage/HSP';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import withData, { type WithDataProps } from '../lib/withData';
import Layout, { BlueSection } from '../components/Layout';

type RenderProps = {
  error: ?Error,
  props: ?pages_index_QueryResponse
};

const BiggerText = styled('div')`
  font-size: 18px;
`;
const ReadMore = styled('h4')`
  padding: 20px 40px;
`;

const AboutSection = () => (
  <>
    <Flex justifyAround wrapReverse>
      <FlexItem grow={1} basis="700px">
        <h1 id="om-itdagene">Hva er itDAGENE?</h1>
        <p>
          itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
          fremtidige arbeidsgivere. Messen arrangeres av studenter for
          studenter, overskuddet går til studentenes ekskursjon i tredjeklasse.
          itDAGENE arrangeres en gang i året av data- og kommunikasjonsteknologi
          ved NTNU i Trondheim.
        </p>
        <p>
          Hvert år har vi besøk av mer enn 60 bedrifter, fordelt på to dager.
        </p>
        <ul>
          <li>Stands</li>
          <li>Sommerjobbmaraton</li>
          <li>Mingling</li>
          <li>Kurs</li>
          <li>
            <a href="/info?side=bankett">Bankett</a>
          </li>
        </ul>
        <h2>Hvor og når?</h2>
        <p>
          itDAGENE 2018 finner sted 10. & 11. september, i{' '}
          <a href="http://bit.ly/2uupU4h"> Glassgården </a> på NTNU Campus
          Gløshaugen.
        </p>

        <h2>Interessert i å delta?</h2>
        <p>
          Vi tilbyr masse rart. Deriblant har vi en bankett. Dette er bare masse
          tekst-fyll.
        </p>
      </FlexItem>
      <FlexItem>
        <CenterIt>
          <Image
            style={{ width: 350, maxWidth: '100%' }}
            src="static/itdagene-svart.png"
            alt="itDAGENE logo"
          />
        </CenterIt>
      </FlexItem>
    </Flex>
    <CenterIt text>
      <a href="/om-itdagene">
        <ReadMore>Les mer</ReadMore>
      </a>
    </CenterIt>
  </>
);

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: WithDataProps) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({ props, error }: RenderProps) => {
      return (
        <Layout
          {...{ error, props }}
          contentRenderer={({ props }) => (
            <BiggerText>
              <BlueSection>
                <WelcomeScreen currentMetaData={props.currentMetaData} />
              </BlueSection>
              <Section>
                <AboutSection />
              </Section>
              {/*<Section>

                <Stats />
              </Section>
              */}
              <Section>
                <HSP />
              </Section>
              <Section>
                <Collaborators showDescription query={props} />
              </Section>
              <Section>
                <Companies query={props} />
              </Section>
              <Section style={{ borderBottom: 0 }}>
                <h2>Hva er Lorem Ipsum?</h2>
                <p>
                  Lorem Ipsum er rett og slett dummytekst fra og for
                  trykkeindustrien. Lorem Ipsum har vært bransjens standard for
                  dummytekst helt siden 1500-tallet, da en ukjent boktrykker
                  stokket en mengde bokstaver for å lage et prøveeksemplar av en
                  bok. Lorem Ipsum har tålt tidens tann usedvanlig godt, og har
                  i tillegg til å bestå gjennom fem århundrer også tålt spranget
                  over til elektronisk typografi uten vesentlige endringer.{' '}
                </p>
                <a>Les mer</a>
                <h4>
                  <a href="/#">Mer informasjon</a>
                </h4>
                <h2>Bankett</h2>
                <p>
                  itDAGENE avholder årlig en bankett for it-studenter og
                  bedrifter. Årets bankett blir som tidligere år på Scandic
                  Lerkendal, som ligger under en kilometer fra Gløshaugen,
                  mandag 10. september. Det serveres middag og drikke, med
                  underholdning og studentsanger. Banketten er et perfekt sted
                  for studenter å mingle med fremtidige arbeidsgivere og lære
                  mer om hver enkelt bedrift. Lurer du kanskje på om bedriften
                  har noen sosiale arrangementer? Eller hva
                  bedriftsrepresentanten har studert tidligere? Du kommer til å
                  bli plassert på bord med bedriftsrepresentanter og studenter,
                  så det er bare å gjøre seg klar til en hyggelig og sosial
                  kveld!
                </p>
                <a href="/info?side=bankett">Les mer</a>
              </Section>
            </BiggerText>
          )}
        />
      );
    }}
  />
);

export default withData(Index, {
  query: graphql`
    query pages_index_Query {
      currentMetaData {
        ...Year_currentMetaData
        ...WelcomeScreen_currentMetaData
        id
      }
      ...Companies_query
      ...Collaborators_query
    }
  `,
  variables: {}
});
