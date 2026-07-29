import { resolveContentState } from './eventLifecycle';

const lifecycle = {
  edition: 2026,
  source: 'graphql',
  owner: 'Test owner',
  configuredState: 'unpublished',
};

describe('content lifecycle resolution', () => {
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
