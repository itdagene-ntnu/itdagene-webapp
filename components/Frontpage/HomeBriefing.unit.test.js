import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeBriefing } from './HomeBriefing';

const legacyMap = {
  edition: 2025,
  location: 'Realfagbygget, U1',
  days: [
    {
      id: 'mandag',
      label: 'Mandag',
      location: 'Realfagbygget, U1',
      mapImage: 'https://cdn.itdagene.no/standkart_mandag_plain.png',
      downloadImage: 'https://cdn.itdagene.no/standkart_mandag.png',
      stands: [],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderBriefing = ({ standMap, standState }) =>
  renderToStaticMarkup(
    <HomeBriefing
      edition={2026}
      events={[]}
      phase="planning"
      programState="unpublished"
      referenceTime="2026-08-02T10:00:00+02:00"
      standMap={standMap}
      standState={standState}
    />
  );

describe('HomeBriefing stand map publication state', () => {
  it('shows the current-edition placeholder when no map is published', () => {
    const markup = renderBriefing({
      standMap: undefined,
      standState: 'unpublished',
    });

    expect(markup).toContain('Standkartet for 2026 er ikke publisert ennå.');
    expect(markup).toContain('Se status for standkartet');
    expect(markup).not.toContain('standkart_mandag');
  });

  it('never exposes a previous-edition map as an unpublished fallback', () => {
    const markup = renderBriefing({
      standMap: legacyMap,
      standState: 'stale',
    });

    expect(markup).toContain('Standkartet for 2026 er ikke publisert ennå.');
    expect(markup).not.toContain('standkart_mandag_plain.png');
    expect(markup).not.toContain('Standkart 2025');
  });

  it('shows the uploaded map only when the current release is published', () => {
    const currentMap = {
      ...legacyMap,
      edition: 2026,
      days: [
        {
          ...legacyMap.days[0],
          id: '2026-09-14',
          mapImage: 'https://itdagene.no/stands/maps/4/background/',
        },
      ],
    };
    const markup = renderBriefing({
      standMap: currentMap,
      standState: 'published',
    });

    expect(markup).toContain('Standkart 2026');
    expect(markup).toContain('Finn bedriftene du vil møte');
    expect(markup).not.toContain(
      'Standkartet for 2026 er ikke publisert ennå.'
    );
  });
});
