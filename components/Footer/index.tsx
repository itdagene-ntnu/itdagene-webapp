import Link from 'next/link';
import React from 'react';
import { SiteContainer } from '../DesignSystem';

const Footer = (): JSX.Element => (
  <footer className="site-footer">
    <SiteContainer>
      <div className="site-footer__top">
        <div className="site-footer__identity">
          <Link aria-label="itDAGENE - forsiden" href="/">
            <img
              alt=""
              height="48"
              src="/static/itdagene-white.png"
              width="225"
            />
          </Link>
          <p>
            itDAGENE er et årlig møtested mellom IT-studenter og næringslivet
            ved NTNU. Arrangementet drives av tredjeårsstudenter fra
            Datateknologi og Cybersikkerhet og datakommunikasjon, og overskuddet
            går til studentenes ekskursjon.
          </p>
        </div>

        <div>
          <h2>Finn frem</h2>
          <ul>
            <li>
              <Link href="/program">Program</Link>
            </li>
            <li>
              <Link href="/stands">Stands</Link>
            </li>
            <li>
              <Link href="/jobb">Jobbannonser</Link>
            </li>
            <li>
              <Link href="/faq">Praktisk informasjon</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Kontakt</h2>
          <ul>
            <li>
              <a href="mailto:styret@itdagene.no">styret@itdagene.no</a>
            </li>
            <li>
              <a href="mailto:web@itdagene.no">web@itdagene.no</a>
            </li>
            <li>
              <a href="https://github.com/itdagene-ntnu">GitHub</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>Sem Sælands vei 7-9, 7034 Trondheim</p>
        <p>Organisasjonsnummer 912 601 625</p>
      </div>
    </SiteContainer>
  </footer>
);

export default Footer;
