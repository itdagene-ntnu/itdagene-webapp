/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import ProgramDateNavigator from './ProgramDateNavigator';

global.IS_REACT_ACT_ENVIRONMENT = true;

describe('ProgramDateNavigator', () => {
  let container;
  let root;
  let scrollIntoView;

  beforeEach(() => {
    window.sessionStorage.clear();
    scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('shows each published program day supplied by the event data', () => {
    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-09-11"
          dates={['2026-08-02', '2026-09-11']}
          eventCounts={{ '2026-08-02': 1, '2026-09-11': 2 }}
          onChange={jest.fn()}
        />
      );
    });

    const buttons = container.querySelectorAll('[data-program-date]');
    expect(buttons).toHaveLength(2);
    expect(buttons[1].getAttribute('aria-current')).toBe('date');
    expect(buttons[0].getAttribute('aria-label')).toBe(
      'Søndag 2. august, 1 arrangement'
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'center',
    });
  });

  it('selects a program day without treating the dates as page navigation', () => {
    const onChange = jest.fn();

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-09-11"
          dates={['2026-09-11', '2026-09-12']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    const buttons = container.querySelectorAll('[data-program-date]');
    act(() => Simulate.click(buttons[1]));

    expect(onChange).toHaveBeenCalledWith('2026-09-12');
  });

  it('groups sparse dates by month and shows one selected-day summary', () => {
    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-27"
          dates={['2026-08-02', '2026-08-27', '2026-09-11']}
          eventCounts={{ '2026-08-27': 3 }}
          onChange={jest.fn()}
        />
      );
    });

    const monthLabels = Array.from(
      container.querySelectorAll('.program-date-navigator__month-label')
    ).map((element) => element.textContent);

    expect(monthLabels).toEqual(['August 2026', 'September 2026']);
    expect(
      container.querySelector('.program-date-navigator__count')
    ).toBeNull();
    const selection = container.querySelector(
      '.program-date-navigator__selection'
    );
    expect(selection.querySelector('time').textContent).toBe(
      'Torsdag 27. august'
    );
    expect(selection.textContent).toBe('Torsdag 27. august 3 arrangementer');
    expect(selection.textContent).not.toMatch(/[\u00b7\u2022\u2014]/);
    expect(selection.querySelector('span:last-child').textContent).toBe(
      '3 arrangementer'
    );
    expect(
      Array.from(container.querySelectorAll('optgroup')).map((group) =>
        group.getAttribute('label')
      )
    ).toEqual(['August 2026', 'September 2026']);
  });

  it('steps through dates with controls and disables them at the bounds', () => {
    const onChange = jest.fn();

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-02"
          dates={['2026-08-02', '2026-08-27', '2026-09-11']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    const previous = container.querySelector(
      '[aria-label="Forrige programdag"]'
    );
    const next = container.querySelector('[aria-label="Neste programdag"]');

    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    act(() => Simulate.click(next));
    expect(onChange).toHaveBeenCalledWith('2026-08-27');

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-09-11"
          dates={['2026-08-02', '2026-08-27', '2026-09-11']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    expect(
      container.querySelector('[aria-label="Forrige programdag"]').disabled
    ).toBe(false);
    expect(
      container.querySelector('[aria-label="Neste programdag"]').disabled
    ).toBe(true);
  });

  it('supports arrow, Home and End keyboard navigation', () => {
    const onChange = jest.fn();

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-27"
          dates={['2026-08-02', '2026-08-27', '2026-09-11']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    const buttons = container.querySelectorAll('[data-program-date]');

    act(() => Simulate.keyDown(buttons[1], { key: 'ArrowRight' }));
    expect(onChange).toHaveBeenLastCalledWith('2026-09-11');
    expect(document.activeElement).toBe(buttons[2]);

    act(() => Simulate.keyDown(buttons[2], { key: 'Home' }));
    expect(onChange).toHaveBeenLastCalledWith('2026-08-02');
    expect(document.activeElement).toBe(buttons[0]);

    act(() => Simulate.keyDown(buttons[0], { key: 'End' }));
    expect(onChange).toHaveBeenLastCalledWith('2026-09-11');
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('does not change the selected event when keyboard navigation hits a boundary', () => {
    const onChange = jest.fn();

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-02"
          dates={['2026-08-02', '2026-09-11']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    const firstDate = container.querySelector('[data-program-date]');
    act(() => Simulate.keyDown(firstDate, { key: 'ArrowLeft' }));
    act(() => Simulate.keyDown(firstDate, { key: 'Home' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem('itdagene:focus-program-date')).toBe(
      null
    );
  });

  it('offers every date through the compact mobile picker', () => {
    const onChange = jest.fn();

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-02"
          dates={['2026-08-02', '2026-09-11']}
          eventCounts={{}}
          onChange={onChange}
        />
      );
    });

    const picker = container.querySelector('[aria-label="Alle programdatoer"]');
    act(() => Simulate.change(picker, { target: { value: '2026-09-11' } }));

    expect(onChange).toHaveBeenCalledWith('2026-09-11');
  });

  it('keeps a single program day concise and renders nothing without dates', () => {
    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate="2026-08-02"
          dates={['2026-08-02']}
          eventCounts={{ '2026-08-02': 1 }}
          onChange={jest.fn()}
        />
      );
    });

    expect(
      container.querySelector('[aria-label="Bytt programdag"]')
    ).toBeNull();
    expect(
      container.querySelector(
        '.program-date-navigator__selection span:last-child'
      ).textContent
    ).toBe('1 arrangement');

    act(() => {
      root.render(
        <ProgramDateNavigator
          activeDate=""
          dates={[]}
          eventCounts={{}}
          onChange={jest.fn()}
        />
      );
    });

    expect(container.querySelector('.program-date-navigator')).toBeNull();
  });
});
