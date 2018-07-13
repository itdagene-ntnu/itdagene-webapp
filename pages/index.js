//@flow

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import { Section } from '../components/Styled';
import { List, Container } from 'semantic-ui-react';
import { Image, CenterIt } from '../components/Styled';
import { QueryRenderer, graphql } from 'react-relay';
import React, { Fragment } from 'react';

import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';
import Collaborators from '../components/Collaborators/Collaborators';
import Companies from '../components/Companies/Companies';
import Flex, { FlexItem } from 'styled-flex-component';
import HSP from '../components/Frontpage/HSP';
import Stats from '../components/Stats';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import withData, { type WithDataProps } from '../lib/withData';
import Layout, { BlueSection } from '../components/Layout';

type RenderProps = {
  error: ?Error,
  props: ?pages_index_QueryResponse
};

const AboutSection = () => (
  <>
    <Flex justifyAround wrapReverse>
      <FlexItem style={{ maxWidth: 700 }}>
        <h3>Hva er itDAGENE?</h3>
        <p>
          itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
          fremtidige arbeidsgivere. Messen arrangeres av studenter for
          studenter, overskuddet går til studentenes ekskursjon i tredjeklasse.
          itDAGENE arrangeres en gang i året av data- og kommunikasjonsteknologi
          ved NTNU i Trondheim.
        </p>
        <List as="ul">
          <List.Item as="li">Stands</List.Item>
          <List.Item as="li">Sommerjobbmaraton</List.Item>
          <List.Item as="li">Mingling</List.Item>
          <List.Item as="li">Kurs</List.Item>
          <List.Item as="li">Bankett</List.Item>
        </List>
        <h3 className="ui header">Hvor og når?</h3>
        <p>
          itDAGENE 2018 finner sted 10. & 11. september, i <a> Glassgården </a>{' '}
          på NTNU Campus Gløshaugen.
        </p>

        <h3 className="ui header">Interessert i å delta?</h3>
        <p>
          Vi tilbyr masse rart. Deriblant har vi en bankett. Dette er bare masse
          tekst-fyll.
        </p>
      </FlexItem>
      <FlexItem>
        <CenterIt>
          <Image
            style={{ width: 350 }}
            src="static/itdagene-svart.png"
            alt="itDAGENE logo"
          />
        </CenterIt>
      </FlexItem>
    </Flex>
    <CenterIt text>
      <a href="/om-oss" className="ui huge button">
        Les mer
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
      if (!props) return <Layout {...{ error, props }} />;

      return (
        <Layout
          {...{ error, props }}
          contentRenderer={() => (
            <Fragment>
              <BlueSection>
                <WelcomeScreen currentMetaData={props.currentMetaData} />
              </BlueSection>
              <Section>
                <AboutSection />
              </Section>
              <Section>
                <Container>
                  <Stats />
                </Container>
              </Section>
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
                <h3 className="ui header">Hva er Lorem Ipsum?</h3>
                <p>
                  Lorem Ipsum er rett og slett dummytekst fra og for
                  trykkeindustrien. Lorem Ipsum har vært bransjens standard for
                  dummytekst helt siden 1500-tallet, da en ukjent boktrykker
                  stokket en mengde bokstaver for å lage et prøveeksemplar av en
                  bok. Lorem Ipsum har tålt tidens tann usedvanlig godt, og har
                  i tillegg til å bestå gjennom fem århundrer også tålt spranget
                  over til elektronisk typografi uten vesentlige endringer.{' '}
                </p>
                <a className="ui large button">Les mer</a>
                <h4 className="ui horizontal header divider">
                  <a href="/#">Mer informasjon</a>
                </h4>
                <h3 className="ui header">Bankett</h3>
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
                <a className="ui large button">Les mer</a>
              </Section>
            </Fragment>
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
