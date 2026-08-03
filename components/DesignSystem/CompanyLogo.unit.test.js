import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CompanyLogo } from './CompanyLogo';

describe('CompanyLogo', () => {
  it('describes company logos and external navigation in Norwegian', () => {
    const markup = renderToStaticMarkup(
      <CompanyLogo
        company={{
          name: 'Computas',
          logo: '/computas.svg',
          url: 'https://computas.example',
        }}
        height={80}
        width={200}
      />
    );

    expect(markup).toContain('alt="Logo for Computas"');
    expect(markup).toContain('aria-label="Computas - åpnes i nytt vindu"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
  });
});
