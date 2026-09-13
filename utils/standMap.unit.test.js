import { toStandMapManifest } from './standMap';

describe('stand map API adapter', () => {
  test('turns a published release into the shared manifest in day and natural stand order', () => {
    expect(
      toStandMapManifest({
        edition: 2026,
        revision: 3,
        maps: [
          {
            backgroundImage: 'https://itdagene.no/uploads/tuesday.png',
            date: '2026-09-15',
            label: 'Tirsdag',
            location: 'Sentralbygg 2',
            placements: [],
          },
          {
            backgroundImage: 'https://itdagene.no/uploads/monday.png',
            date: '2026-09-14',
            label: 'Mandag',
            location: 'Realfagbygget, U1',
            placements: [
              {
                companyName: 'Førti to',
                companySlug: 'forti-to',
                standNumber: '42',
                xPercent: 66.4,
                yPercent: 67,
              },
              {
                companyName: 'To',
                companySlug: 'to',
                standNumber: '2',
                xPercent: 22.15,
                yPercent: 51.3,
              },
            ],
          },
        ],
      })
    ).toEqual({
      edition: 2026,
      location: 'Realfagbygget, U1',
      days: [
        {
          id: '2026-09-14',
          label: 'Mandag',
          location: 'Realfagbygget, U1',
          mapImage: 'https://itdagene.no/uploads/monday.png',
          downloadImage: 'https://itdagene.no/uploads/monday.png',
          stands: [
            {
              number: '2',
              companyName: 'To',
              companySlug: 'to',
              position: { x: 22.15, y: 51.3 },
            },
            {
              number: '42',
              companyName: 'Førti to',
              companySlug: 'forti-to',
              position: { x: 66.4, y: 67 },
            },
          ],
        },
        {
          id: '2026-09-15',
          label: 'Tirsdag',
          location: 'Sentralbygg 2',
          mapImage: 'https://itdagene.no/uploads/tuesday.png',
          downloadImage: 'https://itdagene.no/uploads/tuesday.png',
          stands: [],
        },
      ],
    });
  });

  test('carries the collaborator tier through and drops an unknown one', () => {
    const stands = toStandMapManifest({
      edition: 2026,
      revision: 1,
      maps: [
        {
          backgroundImage: 'https://itdagene.no/uploads/monday.png',
          date: '2026-09-14',
          label: 'Mandag',
          location: 'Realfagbygget, U1',
          placements: [
            {
              collaboratorTier: 'main',
              companyName: 'Hoved',
              companySlug: 'hoved',
              standNumber: '1',
              xPercent: 10,
              yPercent: 10,
            },
            {
              collaboratorTier: 'collaborator',
              companyName: 'Partner',
              companySlug: 'partner',
              standNumber: '2',
              xPercent: 20,
              yPercent: 20,
            },
            {
              collaboratorTier: 'gullpakke',
              companyName: 'Ukjent',
              companySlug: 'ukjent',
              standNumber: '3',
              xPercent: 30,
              yPercent: 30,
            },
            {
              companyName: 'Vanlig',
              companySlug: 'vanlig',
              standNumber: '4',
              xPercent: 40,
              yPercent: 40,
            },
          ],
        },
      ],
    }).days[0].stands;

    expect(
      stands.map((stand) => [stand.companySlug, stand.collaboratorTier])
    ).toEqual([
      ['hoved', 'main'],
      ['partner', 'collaborator'],
      ['ukjent', undefined],
      ['vanlig', undefined],
    ]);
  });

  test('does not invent a current map when no release is published', () => {
    expect(toStandMapManifest(null)).toBeNull();
    expect(
      toStandMapManifest({ edition: 2026, revision: 1, maps: [] })
    ).toBeNull();
  });
});
