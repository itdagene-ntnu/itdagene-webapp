/** @jest-environment jsdom */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import ProgramTimeline from './ProgramTimeline';

global.IS_REACT_ACT_ENVIRONMENT = true;

const events = {
  '2026-09-14': [
    {
      id: 'event-1',
      title: 'Åpning og frokost',
      timeStart: '09:00:00',
      timeEnd: '09:45:00',
      coverImage: null,
      description: 'Velkommen til årets itDAGENE.',
      location: 'Realfagbygget U1',
      date: '2026-09-14',
      type: 'A_1',
      company: null,
      usesTickets: false,
      maxParticipants: null,
    },
    {
      id: 'event-2',
      title: 'Teknologi for et bedre samfunn',
      timeStart: '10:00:00',
      timeEnd: '10:45:00',
      coverImage: null,
      description: 'Møt fagmiljøet og hør om aktuelle prosjekter.',
      location: 'EL5',
      date: '2026-09-14',
      type: 'A_1',
      company: {
        id: 'company-1',
        name: 'Computas',
      },
      usesTickets: false,
      maxParticipants: null,
    },
  ],
};

describe('ProgramTimeline', () => {
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

  it('links list hover and detail presentation without changing the selected event', () => {
    const updateQueryEvent = jest.fn();

    act(() => {
      root.render(
        <ProgramTimeline
          activeDate="2026-09-14"
          events={events}
          router={{ query: {} }}
          updateQueryEvent={updateQueryEvent}
        />
      );
    });

    const eventCards = container.querySelectorAll('.program-event-card');
    const programLayout = container.querySelector('.program-layout');
    const detailPane = container.querySelector('.program-detail-pane');

    expect(eventCards[0].dataset.active).toBe('true');
    expect(detailPane.querySelector('h2').textContent).toBe(
      'Åpning og frokost'
    );

    act(() => {
      Simulate.mouseEnter(eventCards[1]);
    });

    expect(eventCards[0].dataset.active).toBe('false');
    expect(eventCards[1].dataset.active).toBe('true');
    expect(detailPane.querySelector('h2').textContent).toBe(
      'Teknologi for et bedre samfunn'
    );
    expect(updateQueryEvent).not.toHaveBeenCalled();

    act(() => {
      Simulate.mouseEnter(detailPane);
    });

    expect(eventCards[1].dataset.active).toBe('true');
    expect(detailPane.querySelector('h2').textContent).toBe(
      'Teknologi for et bedre samfunn'
    );

    act(() => {
      Simulate.mouseLeave(programLayout);
    });

    expect(eventCards[0].dataset.active).toBe('true');
    expect(eventCards[1].dataset.active).toBe('false');
    expect(detailPane.querySelector('h2').textContent).toBe(
      'Åpning og frokost'
    );

    act(() => {
      Simulate.click(eventCards[1]);
    });

    expect(eventCards[1].getAttribute('aria-current')).toBe('true');
    expect(detailPane.querySelector('h2').textContent).toBe(
      'Teknologi for et bedre samfunn'
    );
    expect(updateQueryEvent).toHaveBeenCalledWith('event-2');
  });
});
