//@flow

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import React, { Fragment } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';
import { List, Container, Image, Segment } from 'semantic-ui-react';

import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import HSP from '../components/Frontpage/HSP';
import { HeaderMenu } from '../components/Header';
import Stats from '../components/Stats';
import LoadingIndicator from '../components/LoadingIndicator';
import Companies from '../components/Companies/Companies';
import { itdageneBlue } from '../utils/colors';

import { type pages_index_QueryResponse } from './__generated__/pages_index_Query.graphql';

type RenderProps = {
  error: ?Error,
  props: ?pages_index_QueryResponse
};
const Index = ({
  variables,
  query,
  environment,
  queryProps,
  url
}: WithDataProps) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({ error, props }: RenderProps) => {
      if (error) return <div>Error</div>;

      if (!props) return <LoadingIndicator url={url} />;

      // $FlowFixMe
      if (process.browser) {
        throw new Error('dsadasdsad');
      }

      return (
        <Fragment>
          <div
            style={{ height: 700, background: itdageneBlue }}
            className="ui inverted vertical segment"
          >
            <Container>
              <HeaderMenu url={url} />
            </Container>

            <WelcomeScreen currentMetaData={props.currentMetaData} />
          </div>
          <div className="ui vertical stripe segment">
            <div className="ui middle aligned stackable grid container">
              <div className="row">
                <div className="eight wide column">
                  <h3 className="ui header">Hva er itDAGENE?</h3>
                  <p>
                    itDAGENE er en arbeidslivsmesse hvor studenter blir kjent
                    med fremtidige arbeidsgivere. Messen arrangeres av studenter
                    for studenter, overskuddet går til studentenes ekskursjon i
                    tredjeklasse. itDAGENE arrangeres en gang i året av data- og
                    kommunikasjonsteknologi ved NTNU i Trondheim.
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
                    itDAGENE 2018 finner sted 10. & 11. september, i{' '}
                    <a> Glassgården </a> på NTNU Campus Gløshaugen.
                  </p>

                  <h3 className="ui header">Interessert i å delta?</h3>
                  <p>
                    Vi tilbyr masse rart. Deriblant har vi en bankett. Dette er
                    bare masse tekst-fyll.
                  </p>
                </div>
                <div className="six wide right floated column">
                  <Image src="static/itdagene-svart.png" alt="itDAGENE logo" />
                </div>
              </div>
              <div className="row">
                <div className="center aligned column">
                  <a href="/om-oss" className="ui huge button">
                    Les mer
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Segment vertical className="stripe">
            <Container>
              <Stats />
            </Container>
          </Segment>
          <div className="ui vertical stripe segment">
            <div className="ui middle aligned stackable grid container">
              <HSP />
            </div>
          </div>
          <Segment vertical className="stripe">
            <Container>
              <Companies query={props} />
            </Container>
          </Segment>
          <Segment vertical className="stripe">
            <Container text>
              <h3 className="ui header">Hva er Lorem Ipsum?</h3>
              <p>
                Lorem Ipsum er rett og slett dummytekst fra og for
                trykkeindustrien. Lorem Ipsum har vært bransjens standard for
                dummytekst helt siden 1500-tallet, da en ukjent boktrykker
                stokket en mengde bokstaver for å lage et prøveeksemplar av en
                bok. Lorem Ipsum har tålt tidens tann usedvanlig godt, og har i
                tillegg til å bestå gjennom fem århundrer også tålt spranget
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
                Lerkendal, som ligger under en kilometer fra Gløshaugen, mandag
                10. september. Det serveres middag og drikke, med underholdning
                og studentsanger. Banketten er et perfekt sted for studenter å
                mingle med fremtidige arbeidsgivere og lære mer om hver enkelt
                bedrift. Lurer du kanskje på om bedriften har noen sosiale
                arrangementer? Eller hva bedriftsrepresentanten har studert
                tidligere? Du kommer til å bli plassert på bord med
                bedriftsrepresentanter og studenter, så det er bare å gjøre seg
                klar til en hyggelig og sosial kveld!
              </p>
              <a className="ui large button">Les mer</a>
            </Container>
          </Segment>
        </Fragment>
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
    }
  `,
  variables: {}
});
