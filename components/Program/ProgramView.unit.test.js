/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { act } from 'react-dom/test-utils';
import { ProgramView } from './ProgramView';

jest.mock('./__generated__/ProgramView_events.graphql', () => ({}), {
  virtual: true,
});
jest.mock('./__generated__/ProgramView_currentMetaData.graphql', () => ({}), {
  virtual: true,
});
jest.mock('react-relay', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createFragmentContainer: (component) => component,
  graphql: jest.fn(),
}));

global.IS_REACT_ACT_ENVIRONMENT = true;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const event = (id, date, title) => ({
  id,
  date,
  title,
  timeStart: '09:00:00',
  timeEnd: '10:00:00',
  coverImage: null,
  description: '',
  location: 'U1',
  type: 'A_0',
  company: null,
  usesTickets: false,
  maxParticipants: null,
});

describe('ProgramView', () => {
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

  it('uses published event dates instead of the fair dates for navigation', () => {
    act(() => {
      root.render(
        <ProgramView
          currentMetaData={{
            year: 2026,
            startDate: '2026-09-11',
            endDate: '2026-09-12',
          }}
          events={[
            event('august-event', '2026-08-02', 'August event'),
            event('fair-event', '2026-09-11', 'Fair event'),
          ]}
          programPublished
          router={{
            pathname: '/program',
            push: jest.fn(),
            query: {},
          }}
          venue="Realfagbygget, NTNU"
        />
      );
    });

    const programDays = Array.from(
      container.querySelectorAll('[data-program-date] time')
    ).map((element) => element.getAttribute('datetime'));
    expect(programDays).toEqual(['2026-08-02', '2026-09-11']);
    expect(container.textContent).toContain('Programperiode');
    expect(container.textContent).toContain('2. august–11. september 2026');
    expect(container.textContent).not.toContain('Messedager');
    expect(container.textContent).toContain('August event');
  });

  it('server-renders the first published program day without an empty flash', () => {
    const markup = renderToString(
      <ProgramView
        currentMetaData={{
          year: 2026,
          startDate: '2026-09-11',
          endDate: '2026-09-12',
        }}
        events={[
          event('august-event', '2026-08-02', 'August event'),
          event('fair-event', '2026-09-11', 'Fair event'),
        ]}
        programPublished
        router={{
          pathname: '/program',
          push: jest.fn(),
          query: {},
        }}
        venue="Realfagbygget, NTNU"
      />
    );

    expect(markup).toContain('August event');
    expect(markup).not.toContain('Ingen arrangementer denne dagen.');
  });

  it('server-renders a directly linked event day without flashing the first day', () => {
    const markup = renderToString(
      <ProgramView
        currentMetaData={{
          year: 2026,
          startDate: '2026-09-11',
          endDate: '2026-09-12',
        }}
        events={[
          event('august-event', '2026-08-02', 'August event'),
          event('september-event', '2026-09-11', 'September event'),
        ]}
        programPublished
        router={{
          pathname: '/program',
          push: jest.fn(),
          query: { event: 'september-event' },
        }}
        venue="Realfagbygget, NTNU"
      />
    );

    expect(markup).toContain('September event');
    expect(markup).not.toContain('August event');
    expect(markup).toContain('aria-current="date"');
  });

  it('renders a published program after the active edition advances', () => {
    const markup = renderToString(
      <ProgramView
        currentMetaData={{
          year: 2027,
          startDate: '2027-09-13',
          endDate: '2027-09-14',
        }}
        events={[event('future-event', '2027-08-20', 'Program 2027')]}
        programPublished
        router={{
          pathname: '/program',
          push: jest.fn(),
          query: {},
        }}
        venue="Realfagbygget, NTNU"
      />
    );

    expect(markup).toContain('Program 2027');
    expect(markup).not.toContain('er ikke publisert ennå');
  });
});
