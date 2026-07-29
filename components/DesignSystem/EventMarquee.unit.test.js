import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EventMarquee } from '.';

describe('EventMarquee', () => {
  it('renders two opposite lanes with logo and text fallbacks', () => {
    const markup = renderToStaticMarkup(
      React.createElement(EventMarquee, {
        items: [
          {
            id: 'logo-company',
            logo: 'https://cdn.example/logo.png',
            name: 'Logo Company',
          },
          {
            id: 'text-company',
            logo: null,
            name: 'Text Company',
          },
        ],
        label: 'Bedrifter på itDAGENE 2026',
      })
    );

    expect(markup).toContain('data-direction="left"');
    expect(markup).toContain('data-direction="right"');
    expect(markup).toContain('Logo Company logo');
    expect(markup).toContain('https://cdn.example/logo.png');
    expect(markup).toContain('Text Company');
    expect(markup).toContain('data-marquee-label="true"');
  });
});
