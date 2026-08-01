import { resolveContentState, resolveEventPhase } from './eventLifecycle';

const lifecycle = {
  edition: 2026,
  source: 'graphql',
  owner: 'Test owner',
  configuredState: 'unpublished',
};

describe('content lifecycle resolution', () => {
  it('uses an explicit admin publication state before record counts', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, configuredState: 'published' },
        currentEdition: 2026,
        itemCount: 4,
        isPublished: false,
      })
    ).toBe('unpublished');
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2026,
        itemCount: 0,
        isPublished: true,
      })
    ).toBe('empty');
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2026,
        itemCount: 2,
        isPublished: true,
      })
    ).toBe('published');
  });

  it('lets current approved GraphQL data override an unpublished fallback', () => {
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2026,
        itemCount: 1,
      })
    ).toBe('published');
  });

  it('keeps an empty unapproved module unpublished', () => {
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2026,
        itemCount: 0,
      })
    ).toBe('unpublished');
  });

  it('marks a module config from an older edition as stale', () => {
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2027,
        itemCount: 1,
      })
    ).toBe('stale');
  });

  it('publishes approved non-empty data', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, configuredState: 'published' },
        currentEdition: 2026,
        itemCount: 1,
      })
    ).toBe('published');
  });

  it('returns an empty state for an approved module without items', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, configuredState: 'published' },
        currentEdition: 2026,
        itemCount: 0,
      })
    ).toBe('empty');
  });

  it('marks an explicitly older manifest as stale', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, source: 'manifest' },
        currentEdition: 2026,
        sourceEdition: 2025,
        itemCount: 1,
      })
    ).toBe('stale');
  });

  it('marks a manifest from a future edition as stale', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, source: 'manifest' },
        currentEdition: 2026,
        sourceEdition: 2027,
        itemCount: 1,
      })
    ).toBe('stale');
  });

  it('keeps an unpublished static manifest unpublished', () => {
    expect(
      resolveContentState({
        lifecycle: { ...lifecycle, source: 'manifest' },
        currentEdition: 2026,
        sourceEdition: 2026,
        itemCount: 1,
      })
    ).toBe('unpublished');
  });

  it('prioritizes errors over all other states', () => {
    expect(
      resolveContentState({
        lifecycle,
        currentEdition: 2027,
        itemCount: 1,
        hasError: true,
      })
    ).toBe('error');
  });
});

describe('event phase resolution', () => {
  const event = {
    publicLaunchAt: '2026-01-01',
    startDate: '2026-09-22',
    endDate: '2026-09-22',
  };

  it('starts the event day at midnight in Europe/Oslo', () => {
    expect(
      resolveEventPhase({
        ...event,
        now: '2026-09-21T21:59:59.999Z',
      })
    ).toBe('upcoming');
    expect(
      resolveEventPhase({
        ...event,
        now: '2026-09-21T22:00:00.000Z',
      })
    ).toBe('live');
  });

  it('ends the event day at midnight in Europe/Oslo', () => {
    expect(
      resolveEventPhase({
        ...event,
        now: '2026-09-22T21:59:59.999Z',
      })
    ).toBe('live');
    expect(
      resolveEventPhase({
        ...event,
        now: '2026-09-22T22:00:00.000Z',
      })
    ).toBe('postEvent');
  });
});
