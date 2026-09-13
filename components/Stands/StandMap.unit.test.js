/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { StandMap } from './StandMap';

global.IS_REACT_ACT_ENVIRONMENT = true;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createDay = (id, label, stands) => ({
  id,
  label,
  location: 'Realfagbygget, U1',
  mapImage: '/standkart.png',
  downloadImage: '/standkart.png',
  stands,
});

const firstDay = createDay('2026-09-14', 'Første dag', [
  {
    number: 1,
    companyName: 'Alpha',
    companySlug: 'alpha',
    collaboratorTier: 'main',
    position: { x: 20, y: 30 },
  },
  {
    number: 2,
    companyName: 'Beta',
    companySlug: 'beta',
    position: { x: 40, y: 50 },
  },
]);

const secondDay = createDay('2026-09-15', 'Andre dag', [
  {
    number: 3,
    companyName: 'Gamma',
    companySlug: 'gamma',
    collaboratorTier: 'collaborator',
    position: { x: 60, y: 70 },
  },
]);

describe('StandMap', () => {
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

  it('clears a previous-day search when the visitor changes day', () => {
    act(() => {
      root.render(<StandMap day={firstDay} />);
    });

    const search = container.querySelector('#stand-search');
    act(() => Simulate.change(search, { target: { value: 'Alpha' } }));

    expect(search.value).toBe('Alpha');
    expect(container.querySelectorAll('.stand-directory li')).toHaveLength(1);

    act(() => {
      root.render(<StandMap day={secondDay} />);
    });

    expect(container.querySelector('#stand-search').value).toBe('');
    expect(container.querySelectorAll('.stand-directory li')).toHaveLength(1);
    expect(container.querySelector('.stand-directory strong').textContent).toBe(
      'Gamma'
    );
    expect(
      container.querySelector('.stand-map__marker[data-active="true"]')
    ).toBeNull();
  });

  it('shows the top search result in the stand summary', () => {
    act(() => {
      root.render(<StandMap day={firstDay} />);
    });

    act(() =>
      Simulate.change(container.querySelector('#stand-search'), {
        target: { value: 'Beta' },
      })
    );

    const summary = container.querySelector('.stand-selection');
    expect(summary.querySelector('.site-eyebrow').textContent).toBe(
      'Øverste søkeresultat'
    );
    expect(summary.querySelector('h2').textContent).toBe('Beta');

    act(() => Simulate.click(summary.querySelector('.stand-selection__clear')));
    expect(container.querySelector('#stand-search').value).toBe('');
    expect(container.querySelector('.stand-selection')).toBeNull();
  });

  it('marks a hovered company active on every surface without committing it', () => {
    act(() => {
      root.render(<StandMap day={firstDay} />);
    });

    const marker = container.querySelector(
      '.stand-map__marker[data-stand-company="alpha"]'
    );
    const row = container.querySelector(
      '.stand-directory button[data-stand-company="alpha"]'
    );

    act(() => Simulate.mouseEnter(row));
    expect(marker.dataset.active).toBe('true');
    expect(marker.querySelector('.stand-map__marker-label').textContent).toBe(
      'Alpha'
    );
    expect(marker.getAttribute('aria-pressed')).toBe('false');

    act(() => Simulate.mouseLeave(row));
    expect(marker.dataset.active).toBe('false');
    expect(marker.querySelector('.stand-map__marker-label')).toBeNull();
  });

  it('keeps a tapped company active for pointers that cannot hover', () => {
    act(() => {
      root.render(<StandMap day={firstDay} />);
    });

    const marker = container.querySelector(
      '.stand-map__marker[data-stand-company="beta"]'
    );
    const row = container.querySelector(
      '.stand-directory button[data-stand-company="beta"]'
    );

    act(() => Simulate.click(marker));
    expect(marker.dataset.active).toBe('true');
    expect(marker.getAttribute('aria-pressed')).toBe('true');
    expect(row.dataset.active).toBe('true');

    act(() => Simulate.click(marker));
    expect(marker.dataset.active).toBe('false');
    expect(marker.getAttribute('aria-pressed')).toBe('false');

    act(() => Simulate.click(marker));
    expect(marker.dataset.active).toBe('true');

    const map = container.querySelector('.stand-map');
    act(() => Simulate.click(map));
    expect(marker.dataset.active).toBe('false');
  });

  it('labels collaborators on the map and in the directory', () => {
    act(() => {
      root.render(<StandMap day={firstDay} />);
    });

    const marker = container.querySelector(
      '.stand-map__marker[data-stand-company="alpha"]'
    );
    expect(marker.dataset.collaboratorTier).toBe('main');
    expect(marker.getAttribute('aria-label')).toBe(
      'Stand 1, Alpha, Hovedsamarbeidspartner'
    );
    expect(
      container.querySelector(
        '.stand-directory button[data-stand-company="alpha"] .stand-collaborator-badge'
      ).textContent
    ).toBe('Hovedsamarbeidspartner');

    expect(
      container.querySelector('.stand-map__marker[data-stand-company="beta"]')
        .dataset.collaboratorTier
    ).toBeUndefined();
    expect(
      container.querySelector(
        '.stand-directory button[data-stand-company="beta"] .stand-collaborator-badge'
      )
    ).toBeNull();
  });
});
