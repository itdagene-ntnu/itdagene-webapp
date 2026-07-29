export type EventPhase = 'planning' | 'upcoming' | 'live' | 'postEvent';

export type ContentState =
  | 'unavailable'
  | 'unpublished'
  | 'published'
  | 'empty'
  | 'stale'
  | 'error';

export type ContentModule =
  | 'program'
  | 'stands'
  | 'jobs'
  | 'gallery'
  | 'companies'
  | 'employerInterest';

export type ContentLifecycleConfig = {
  edition: number;
  source: 'graphql' | 'cms' | 'manifest' | 'external';
  owner: string;
  configuredState: Exclude<ContentState, 'empty' | 'stale' | 'error'>;
  expectedPublishAt?: string;
  expiresAt?: string;
  historicalEdition?: number;
};

export type EditionConfig = {
  edition: number;
  publicLaunchAt: string;
  modules: Record<ContentModule, ContentLifecycleConfig>;
};

export const editionConfig: EditionConfig = {
  edition: 2026,
  publicLaunchAt: '2026-01-01',
  modules: {
    program: {
      edition: 2026,
      source: 'graphql',
      owner: 'Programansvarlig og web',
      configuredState: 'unpublished',
    },
    stands: {
      edition: 2026,
      source: 'manifest',
      owner: 'Logistikk og web',
      configuredState: 'unpublished',
      historicalEdition: 2025,
    },
    jobs: {
      edition: 2026,
      source: 'graphql',
      owner: 'Bedriftsteamet',
      configuredState: 'published',
    },
    gallery: {
      edition: 2026,
      source: 'cms',
      owner: 'Markedsføring',
      configuredState: 'unpublished',
      historicalEdition: 2025,
    },
    companies: {
      edition: 2026,
      source: 'graphql',
      owner: 'Bedriftsteamet',
      configuredState: 'unpublished',
    },
    employerInterest: {
      edition: 2026,
      source: 'external',
      owner: 'Bedriftsteamet',
      configuredState: 'published',
    },
  },
};
