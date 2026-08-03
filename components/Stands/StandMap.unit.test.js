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
    const onSelect = jest.fn();

    act(() => {
      root.render(<StandMap day={firstDay} onSelect={onSelect} />);
    });

    const search = container.querySelector('#stand-search');
    act(() => Simulate.change(search, { target: { value: 'Alpha' } }));

    expect(search.value).toBe('Alpha');
    expect(container.querySelectorAll('.stand-directory li')).toHaveLength(1);

    act(() => {
      root.render(<StandMap day={secondDay} onSelect={onSelect} />);
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

  it('shows the top search result in the stand summary without committing it', () => {
    const onSelect = jest.fn();

    act(() => {
      root.render(<StandMap day={firstDay} onSelect={onSelect} />);
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
    expect(onSelect).not.toHaveBeenCalled();

    act(() => Simulate.click(summary.querySelector('button')));
    expect(container.querySelector('#stand-search').value).toBe('');
    expect(container.querySelector('.stand-selection')).toBeNull();
  });
});
