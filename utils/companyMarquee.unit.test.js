import {
  resolveHistoricalCompanyMarquee,
  splitCompanyMarqueeLanes,
} from './companyMarquee';

describe('historical company marquee', () => {
  it('always uses the explicitly labelled historical archive', () => {
    const result = resolveHistoricalCompanyMarquee({});

    expect(result.historical).toBe(true);
    expect(result.label).toBe('Bedrifter fra itDAGENE 2025');
    expect(result.items.length).toBeGreaterThan(1);
    expect(result.items.every((item) => Boolean(item.logo))).toBe(true);
    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          logo: expect.stringContaining('/uploads/cache/'),
          name: expect.stringMatching(/^Computas/),
        }),
      ])
    );
  });

  it('keeps premium partner tiers out of the historical participant list', () => {
    const historical = resolveHistoricalCompanyMarquee({
      excludedCompanyNames: ['Computas', 'Bouvet Norge'],
    });

    expect(historical.items.map((item) => item.name)).not.toContain(
      'Computas AS'
    );
    expect(historical.items.map((item) => item.name)).not.toContain(
      'Bouvet Norge AS'
    );
    expect(historical.items.map((item) => item.name)).toContain('Norkart');
  });

  it('splits the roster into two stable lanes', () => {
    const items = ['A', 'B', 'C', 'D'].map((name) => ({
      id: name.toLowerCase(),
      logo: null,
      name,
    }));

    expect(splitCompanyMarqueeLanes(items)).toEqual([
      [items[0], items[2]],
      [items[1], items[3]],
    ]);
  });
});
