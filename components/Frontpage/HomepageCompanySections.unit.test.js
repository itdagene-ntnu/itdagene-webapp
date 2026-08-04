/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { HomepageCompanySections } from './HomepageCompanySections';

global.IS_REACT_ACT_ENVIRONMENT = true;

const company = {
  id: 'company',
  logo: null,
  name: 'Bedrift',
  url: null,
};

const partner = {
  id: 'partner',
  logo: null,
  name: 'Partner',
  url: null,
};

const historicalItems = [
  {
    id: 'historical-company',
    logo: null,
    name: 'Tidligere bedrift',
  },
];

describe('HomepageCompanySections', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const renderSections = ({
    firstDay = [company],
    lastDay = [company],
    partners = [partner],
  } = {}) => {
    act(() => {
      root.render(
        <HomepageCompanySections
          edition={2026}
          endDate="2026-09-15"
          firstDay={firstDay}
          historicalEdition={2025}
          historicalItems={historicalItems}
          historicalLabel="Tidligere bedrifter"
          lastDay={lastDay}
          mainPartner={null}
          partners={partners}
          startDate="2026-09-14"
        />
      );
    });
  };

  it('keeps all company sections rendered while switching the mobile view', () => {
    renderSections();

    const buttons = [
      ...container.querySelectorAll('.segmented-control button'),
    ];
    const partnerPanel = container.querySelector(
      '[data-company-mobile-panel="partners"]'
    );
    const directoryPanel = container.querySelector(
      '[data-company-mobile-panel="directory"]'
    );
    const days = container.querySelectorAll('[data-company-day]');

    expect(buttons.map((button) => button.textContent)).toEqual([
      'Samarbeidspartnere',
      'Mandag',
      'Tirsdag',
    ]);
    expect(partnerPanel.dataset.mobileActive).toBe('true');
    expect(directoryPanel.dataset.mobileActive).toBe('false');
    expect(days).toHaveLength(2);

    act(() => buttons[1].click());
    expect(partnerPanel.dataset.mobileActive).toBe('false');
    expect(directoryPanel.dataset.mobileActive).toBe('true');
    expect(days[0].dataset.mobileActive).toBe('true');
    expect(days[1].dataset.mobileActive).toBe('false');

    act(() => buttons[2].click());
    expect(days[0].dataset.mobileActive).toBe('false');
    expect(days[1].dataset.mobileActive).toBe('true');
    expect(container.textContent).toContain('Partner');
    expect(container.querySelectorAll('[data-company-id]')).toHaveLength(2);
  });

  it('does not add a selector to the historical fallback', () => {
    renderSections({ firstDay: null, lastDay: null });

    expect(container.querySelector('.segmented-control')).toBeNull();
    expect(
      container.querySelector('[data-company-mobile-panel="directory"]').dataset
        .mobileActive
    ).toBe('true');
    expect(container.textContent).toContain('Tidligere bedrifter');
  });

  it('starts with the available day when no partner or first day is published', () => {
    renderSections({ firstDay: null, lastDay: [company], partners: [] });

    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'last'
    );
    expect(
      container.querySelector('[data-company-day="last"]').dataset.mobileActive
    ).toBe('true');
  });

  it('keeps a visible selection when live data removes the partner panel', () => {
    renderSections();
    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'partners'
    );

    renderSections({ firstDay: null, lastDay: [company], partners: [] });

    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'last'
    );
    expect(
      container.querySelector('[data-company-mobile-panel="directory"]').dataset
        .mobileActive
    ).toBe('true');
    expect(
      container.querySelector('[data-company-day="last"]').dataset.mobileActive
    ).toBe('true');
    expect(
      [...container.querySelectorAll('.segmented-control button')].some(
        (button) => button.getAttribute('aria-pressed') === 'true'
      )
    ).toBe(true);
  });

  it('moves from a removed selected day to the remaining published day', () => {
    renderSections({ partners: [] });
    let buttons = [...container.querySelectorAll('.segmented-control button')];

    act(() => buttons[1].click());
    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'last'
    );

    renderSections({ firstDay: [company], lastDay: null, partners: [] });
    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'first'
    );
    expect(
      container.querySelector('[data-company-day="first"]').dataset.mobileActive
    ).toBe('true');

    renderSections({ firstDay: [company], lastDay: [company], partners: [] });
    buttons = [...container.querySelectorAll('.segmented-control button')];
    act(() => buttons[0].click());
    renderSections({ firstDay: null, lastDay: [company], partners: [] });

    expect(container.firstElementChild.dataset.companyMobileSection).toBe(
      'last'
    );
    expect(
      container.querySelector('[data-company-day="last"]').dataset.mobileActive
    ).toBe('true');
  });
});
