/** @jest-environment jsdom */

import {
  consumeMainFocusRequest,
  focusRouteContent,
  hasMainFocusRequest,
  requestMainFocusAfterNavigation,
} from './navigationFocus';

describe('navigation focus', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    document.body.innerHTML = '';
  });

  it('keeps a focus request available until it is explicitly consumed', () => {
    requestMainFocusAfterNavigation();

    expect(hasMainFocusRequest()).toBe(true);
    expect(consumeMainFocusRequest()).toBe(true);
    expect(hasMainFocusRequest()).toBe(false);
  });

  it('focuses the destination heading when it is available', () => {
    document.body.innerHTML = `
      <main id="main-content" tabindex="-1">
        <h1>Program</h1>
      </main>
    `;

    focusRouteContent();

    expect(document.activeElement.tagName).toBe('H1');
    expect(document.activeElement.getAttribute('tabindex')).toBe('-1');
  });
});
