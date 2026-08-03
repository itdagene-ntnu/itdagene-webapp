/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import {
  CurrentCompanyDirectory,
  formatCompanyDay,
  sortDirectoryCompanies,
} from './CurrentCompanyDirectory';

global.IS_REACT_ACT_ENVIRONMENT = true;

const firstDay = [
  {
    id: 'a-energy',
    logo: 'https://cdn.example/a-energy.png',
    name: 'Å Energi',
    url: 'https://a-energy.example',
  },
  {
    id: 'bekk',
    logo: 'https://cdn.example/bekk.png',
    name: 'Bekk',
    url: 'https://bekk.example',
  },
  {
    id: 'accenture',
    logo: null,
    name: 'Accenture',
    url: null,
  },
];

describe('CurrentCompanyDirectory', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const renderDirectory = ({ first = firstDay, last = [firstDay[1]] } = {}) => {
    act(() => {
      root.render(
        <CurrentCompanyDirectory
          edition={2026}
          endDate="2026-09-15"
          firstDay={first}
          lastDay={last}
          startDate="2026-09-14"
        />
      );
    });
  };

  it('omits the section only while both company days are unpublished', () => {
    renderDirectory({ first: null, last: null });

    expect(container.innerHTML).toBe('');
  });

  it('shows every company in both complete day lists without disclosure', () => {
    renderDirectory();

    const days = container.querySelectorAll('[data-company-day]');
    const firstItems = days[0].querySelectorAll('[data-company-id]');
    const lastItems = days[1].querySelectorAll('[data-company-id]');

    expect(days).toHaveLength(2);
    expect(days[0].dataset.companyState).toBe('published');
    expect(days[1].dataset.companyState).toBe('published');
    expect([...firstItems].map((item) => item.dataset.companyId)).toEqual([
      'accenture',
      'bekk',
      'a-energy',
    ]);
    expect([...lastItems].map((item) => item.dataset.companyId)).toEqual([
      'bekk',
    ]);
    expect(container.querySelectorAll('details, [role="tab"]')).toHaveLength(0);
    expect(container.textContent).toContain('Mandag 14. september');
    expect(container.textContent).toContain('Tirsdag 15. september');
    expect(container.textContent).toContain('3 bedrifter');
    expect(container.textContent).toContain('1 bedrift');
    expect(
      container.querySelector('.current-company-directory__name').textContent
    ).toBe('Accenture');
    expect(
      container.querySelector('a[href="https://bekk.example"]').target
    ).toBe('_blank');
    expect(
      container.querySelector('.current-company-directory__heading a').href
    ).toContain('/stands');
  });

  it('shows unpublished and empty states independently', () => {
    renderDirectory({ first: [], last: null });

    const days = container.querySelectorAll('[data-company-day]');

    expect(days[0].dataset.companyState).toBe('empty');
    expect(days[0].textContent).toContain(
      'Ingen bedrifter er publisert for denne dagen ennå.'
    );
    expect(days[1].dataset.companyState).toBe('unpublished');
    expect(days[1].textContent).toContain('Publiseres senere');
  });

  it('falls back to the company name when a logo fails to load', () => {
    renderDirectory();

    const bekkImage = container.querySelector('img[alt="Logo for Bekk"]');
    act(() => {
      bekkImage.dispatchEvent(new Event('error'));
    });

    const bekkLink = container.querySelector('a[href="https://bekk.example"]');
    expect(bekkLink.dataset.logoState).toBe('fallback');
    expect(bekkLink.textContent).toBe('Bekk');
  });

  it('detects a logo that failed before its React error handler attached', () => {
    const completeDescriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'complete'
    );
    const naturalWidthDescriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'naturalWidth'
    );

    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 0,
    });

    try {
      renderDirectory();
      const bekkLink = container.querySelector(
        'a[href="https://bekk.example"]'
      );

      expect(bekkLink.dataset.logoState).toBe('fallback');
      expect(bekkLink.textContent).toBe('Bekk');
    } finally {
      Object.defineProperty(
        HTMLImageElement.prototype,
        'complete',
        completeDescriptor
      );
      Object.defineProperty(
        HTMLImageElement.prototype,
        'naturalWidth',
        naturalWidthDescriptor
      );
    }
  });
});

describe('company directory helpers', () => {
  it('formats event dates without relying on the browser timezone', () => {
    expect(formatCompanyDay('2026-09-14', 'Første messedag')).toBe(
      'Mandag 14. september'
    );
    expect(formatCompanyDay('invalid', 'Første messedag')).toBe(
      'Første messedag'
    );
  });

  it('sorts Norwegian company names deterministically', () => {
    expect(
      sortDirectoryCompanies(firstDay).map((company) => company.name)
    ).toEqual(['Accenture', 'Bekk', 'Å Energi']);
  });
});
