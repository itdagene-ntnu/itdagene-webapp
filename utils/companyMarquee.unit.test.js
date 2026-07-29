import {
  resolveCompanyMarquee,
  splitCompanyMarqueeLanes,
} from './companyMarquee';

describe('company marquee', () => {
  it('renders nothing when company publication is disabled in admin', () => {
    expect(
      resolveCompanyMarquee({
        currentCompanies: null,
        currentEdition: 2026,
      })
    ).toBeNull();
  });

  it('uses unique current-edition company names when they exist', () => {
    expect(
      resolveCompanyMarquee({
        currentCompanies: [
          { id: 'computas', logo: null, name: 'Computas' },
          { id: 'bekk', logo: 'https://cdn.example/bekk.png', name: 'Bekk' },
          {
            id: 'computas-duplicate',
            logo: 'https://cdn.example/computas.png',
            name: 'Computas',
          },
        ],
        currentEdition: 2026,
      })
    ).toEqual({
      items: [
        {
          id: 'computas-duplicate',
          logo: 'https://cdn.example/computas.png',
          name: 'Computas',
        },
        {
          id: 'bekk',
          logo: 'https://cdn.example/bekk.png',
          name: 'Bekk',
        },
      ],
      label: 'Bedrifter på itDAGENE 2026',
      historical: false,
    });
  });

  it('labels the stand manifest as historical when current names are absent', () => {
    const result = resolveCompanyMarquee({
      currentCompanies: [],
      currentEdition: 2026,
    });

    expect(result.historical).toBe(true);
    expect(result.label).toBe('Bedrifter fra itDAGENE 2025');
    expect(result.items.map((item) => item.name)).not.toContain(
      'BEDRIFTER FRA 2025'
    );
    expect(result.items).toContainEqual({
      id: 'archive-computas',
      logo: null,
      name: 'Computas',
    });
  });

  it('keeps partner tiers out of current and historical participant lists', () => {
    const current = resolveCompanyMarquee({
      currentCompanies: [
        { id: 'computas', name: 'Computas' },
        { id: 'bekk', name: 'Bekk' },
        { id: 'norkart', name: 'Norkart' },
      ],
      currentEdition: 2026,
      excludedCompanyNames: ['computas', 'Bekk'],
    });

    expect(current.items).toEqual([
      { id: 'norkart', logo: null, name: 'Norkart' },
    ]);

    const historical = resolveCompanyMarquee({
      currentCompanies: [],
      currentEdition: 2026,
      excludedCompanyNames: ['Computas'],
    });

    expect(historical.items.map((item) => item.name)).not.toContain('Computas');
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
