import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CompanyExposure, resolveCompanyExposureMode } from './CompanyExposure';

const historicalItems = [
  {
    id: 'archive-bekk',
    logo: 'https://cdn.example/bekk-2025.png',
    name: 'Bekk',
  },
  {
    id: 'archive-norkart',
    logo: 'https://cdn.example/norkart-2025.png',
    name: 'Norkart',
  },
];

const currentCompany = {
  id: 'current-bekk',
  logo: 'https://cdn.example/bekk-2026.png',
  name: 'Bekk',
  url: 'https://bekk.example',
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderExposure = ({
  firstDay = [currentCompany],
  lastDay = [currentCompany],
} = {}) =>
  renderToStaticMarkup(
    <CompanyExposure
      edition={2026}
      endDate="2026-09-15"
      firstDay={firstDay}
      historicalEdition={2025}
      historicalItems={historicalItems}
      historicalLabel="Tidligere bedrifter"
      lastDay={lastDay}
      startDate="2026-09-14"
    />
  );

describe('CompanyExposure', () => {
  it('uses the historical marquee only while both current days are unpublished', () => {
    const markup = renderExposure({ firstDay: null, lastDay: null });

    expect(markup).toContain('data-company-exposure="historical"');
    expect(markup).toContain('data-testid="event-marquee"');
    expect(markup).toContain('Tidligere bedrifter');
    expect(markup).toContain('itDAGENE 2025');
    expect(markup).not.toContain('current-company-directory');
  });

  it('uses the current directory as soon as either day is published', () => {
    const markup = renderExposure({
      firstDay: [currentCompany],
      lastDay: null,
    });

    expect(markup).toContain('data-company-exposure="current"');
    expect(markup).toContain('current-company-directory');
    expect(markup).toContain('data-company-state="published"');
    expect(markup).toContain('data-company-state="unpublished"');
    expect(markup).not.toContain('data-testid="event-marquee"');
    expect(markup).not.toContain('Tidligere bedrifter');
  });

  it('keeps a genuine current-year empty state instead of falling back to history', () => {
    const markup = renderExposure({ firstDay: [], lastDay: [] });

    expect(markup).toContain('data-company-exposure="current"');
    expect(markup.match(/data-company-state="empty"/g)).toHaveLength(2);
    expect(markup).not.toContain('data-testid="event-marquee"');
    expect(markup).not.toContain('Tidligere bedrifter');
  });

  it('never renders current and historical company presentations together', () => {
    const currentMarkup = renderExposure();
    const historicalMarkup = renderExposure({
      firstDay: null,
      lastDay: null,
    });

    expect(currentMarkup).toContain('current-company-directory');
    expect(currentMarkup).not.toContain('data-testid="event-marquee"');
    expect(historicalMarkup).toContain('data-testid="event-marquee"');
    expect(historicalMarkup).not.toContain('current-company-directory');
  });
});

describe('resolveCompanyExposureMode', () => {
  it.each([
    [null, null, 'historical'],
    [[currentCompany], null, 'current'],
    [null, [currentCompany], 'current'],
    [[], [], 'current'],
  ])(
    'resolves first day %p and last day %p as %s',
    (firstDay, lastDay, expected) => {
      expect(resolveCompanyExposureMode({ firstDay, lastDay })).toBe(expected);
    }
  );
});
