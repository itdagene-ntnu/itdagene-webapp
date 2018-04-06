import React from 'react';
import { Image, Header } from 'semantic-ui-react';

const HSP = () => (
  <div className="row">
    <div className="eight wide column">
      <Header as="h3" className="ui header">
        Hovedsamarbeidspartner
      </Header>
      <p>
        <i>
          Vi er stolte av å kunne presentere ITverket AS som
          hovedsamarbeidspartner i 2018.
        </i>
      </p>
      <Header as="h3">Hvem er ITverket?</Header>
      <p>
        <i>
          «ITverket er et konsulentselskap lokalisert i Oslo med 60 engasjerte
          ansatte fordelt på avdelingene våre for systemutvikling (Java og
          .NET), prosjektledelse og front-end. Hos oss har vi en god miks av
          erfarne konsulenter og nyutdannede, fremmadstormende talenter. Vi
          lever etter våre verdier som sier at vi skal være «pålitelige, lekne
          og fleksible» både overfor våre kunder, men også internt. Vi setter
          mennesket i fokus og ønsker at våre konsulenter skal utvikle seg
          faglig, men også personlig. Dette vil også kundene våre dra stor nytte
          av. En fornøyd ansatt er en produktiv ansatt. Vi har jobbet spesielt
          aktivt på NTNU de siste 7-8 årene for å tiltrekke oss flere gode
          ITverkere og vi har gjort dette med stor suksess. 22 av våre ansatte
          er ansatt etter å ha vært med på våre sommerprosjekter.»
        </i>
        <br /> - Tom Henrik N. Rogstad, Adm. dir.
      </p>
    </div>
    <div className="six wide right floated column">
      <Image src="static/itverket.png" alt="ITverket logo" />
      <Image
        style={{ marginTop: 80 }}
        src="static/itverket-kafe.jpg"
        alt="Bilde av mann og dame ved pc"
      />
    </div>
  </div>
);
export default HSP;
