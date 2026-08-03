import { selectHydrationQueryProps } from './hydrationSnapshot';

describe('hydration query snapshot', () => {
  it('keeps the server company state for the first browser render', () => {
    const serverSnapshot = {
      companiesFirstDay: null,
      companiesLastDay: null,
    };
    const liveRelayData = {
      companiesFirstDay: [{ id: 'company-1' }],
      companiesLastDay: [{ id: 'company-1' }],
    };

    expect(
      selectHydrationQueryProps({
        hasHydrated: false,
        initialQueryProps: serverSnapshot,
        liveQueryProps: liveRelayData,
      })
    ).toBe(serverSnapshot);
  });

  it('adopts live Relay data after hydration', () => {
    const serverSnapshot = {
      companiesFirstDay: null,
      companiesLastDay: null,
    };
    const liveRelayData = {
      companiesFirstDay: [{ id: 'company-1' }],
      companiesLastDay: [{ id: 'company-1' }],
    };

    expect(
      selectHydrationQueryProps({
        hasHydrated: true,
        initialQueryProps: serverSnapshot,
        liveQueryProps: liveRelayData,
      })
    ).toBe(liveRelayData);
  });
});
