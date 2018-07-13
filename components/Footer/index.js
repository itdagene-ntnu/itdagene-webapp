import * as React from 'react';

import { Container, Segment, Grid, List, Header } from 'semantic-ui-react';

const Footer = () => (
  <Segment
    vertical
    style={{
      padding: '5em 0em',
      borderTop: '1px solid #E2E9F1',
      backgroundColor: '#F7F9FB'
    }}
  >
    <Container>
      <Grid stackable>
        <Grid.Column width={3}>
          <Header inverted as="h4">
            Adresse
          </Header>
          <List>
            <List.Item>
              <b> itDAGENE</b>
            </List.Item>
            <List.Item>Sem Sælands vei 7-9</List.Item>
            <List.Item>7491 Trondheim</List.Item>
          </List>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header inverted as="h4">
            Kontakt
          </Header>
          <List>
            <List.Item>
              Styret •{' '}
              <a href="mailto:styret@itdagene.no">styret@itdagene.no </a>
            </List.Item>
            <List.Item>
              Webansvarlig •{' '}
              <a href="mailto:web@itdagene.no">web@itdagene.no </a>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column width={6}>
          <Header inverted as="h4">
            Hva er itDAGENE?
          </Header>
          <p>
            itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
            fremtidige arbeidsgivere. Messen arrangeres av studenter for
            studenter, overskuddet går til studentenes ekskursjon i
            tredjeklasse. itDAGENE arrangeres en gang i året av data- og
            kommunikasjonsteknologi ved NTNU i Trondheim.
          </p>
        </Grid.Column>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;
