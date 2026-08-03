import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PartnerShowcase } from './PartnerTiers';

const mainPartner = {
  id: 'main-partner',
  name: 'Computas',
  logo: 'https://cdn.itdagene.no/computas.png',
  url: 'https://computas.com',
  description: 'Selskapets vanlige profiltekst.',
  intro: 'Adminstyrt introduksjon.\n\nAndre avsnitt fra admin.',
  video: 'https://cdn.itdagene.no/hsp.mp4',
  poster: 'https://cdn.itdagene.no/hsp-poster.jpg',
};

const partners = [
  {
    id: 'partner-1',
    name: 'Bane NOR',
    logo: 'https://cdn.itdagene.no/bane-nor.png',
    url: 'https://www.banenor.no',
    description: 'Jernbanen knytter Norge sammen.',
  },
  {
    id: 'partner-2',
    name: 'Bouvet',
    logo: 'https://cdn.itdagene.no/bouvet.png',
    url: 'https://www.bouvet.no',
    description:
      'Bouvet utvikler **digitale løsninger** sammen med kundene sine.',
  },
];

describe('PartnerShowcase', () => {
  it('renders both independently controlled partner tiers in one section', () => {
    const markup = renderToStaticMarkup(
      <PartnerShowcase mainPartner={mainPartner} partners={partners} />
    );

    expect(markup).toContain('data-partner-showcase="true"');
    expect(markup).toContain('data-partner-tier="primary"');
    expect(markup).toContain('data-partner-tier="associate"');
    expect(markup).toContain('Adminstyrt introduksjon.');
    expect(markup).toContain('Andre avsnitt fra admin.');
    expect(markup).not.toContain('Selskapets vanlige profiltekst.');
    expect(markup).toContain('src="https://cdn.itdagene.no/hsp.mp4"');
    expect(markup).toContain('poster="https://cdn.itdagene.no/hsp-poster.jpg"');
    expect(markup.indexOf('data-partner-tier="primary"')).toBeLessThan(
      markup.indexOf('data-partner-tier="associate"')
    );
    expect(markup).toContain('Jernbanen knytter Norge sammen.');
    expect(markup).toContain(
      'Bouvet utvikler <strong>digitale løsninger</strong> sammen med kundene sine.'
    );
    expect(markup.match(/data-disclosure-motion/g)).toHaveLength(2);
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(2);
    expect(markup).toContain(
      'Les mer<span class="visually-hidden"> om Bane NOR</span>'
    );
  });

  it('keeps each admin-controlled tier optional', () => {
    const associatesOnly = renderToStaticMarkup(
      <PartnerShowcase mainPartner={null} partners={partners} />
    );
    const primaryOnly = renderToStaticMarkup(
      <PartnerShowcase mainPartner={mainPartner} partners={[]} />
    );
    const hidden = renderToStaticMarkup(
      <PartnerShowcase mainPartner={null} partners={[]} />
    );

    expect(associatesOnly).not.toContain('data-partner-tier="primary"');
    expect(associatesOnly).toContain('data-partner-tier="associate"');
    expect(primaryOnly).toContain('data-partner-tier="primary"');
    expect(primaryOnly).not.toContain('data-partner-tier="associate"');
    expect(hidden).toBe('');
  });
});
