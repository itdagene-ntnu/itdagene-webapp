import dayjs, { Dayjs } from 'dayjs';
import {
  ContentLifecycleConfig,
  ContentState,
  EventPhase,
} from '../config/edition';

export const resolveEventPhase = ({
  startDate,
  endDate,
  publicLaunchAt,
  now = dayjs(),
}: {
  startDate: string;
  endDate: string;
  publicLaunchAt: string;
  now?: Dayjs;
}): EventPhase => {
  const launch = dayjs(publicLaunchAt).startOf('day');
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).endOf('day');

  if (now.isBefore(launch)) return 'planning';
  if (now.isBefore(start)) return 'upcoming';
  if (now.isAfter(end)) return 'postEvent';
  return 'live';
};

export const resolveContentState = ({
  lifecycle,
  currentEdition,
  sourceEdition,
  itemCount,
  hasError = false,
}: {
  lifecycle: ContentLifecycleConfig;
  currentEdition: number;
  sourceEdition?: number;
  itemCount?: number;
  hasError?: boolean;
}): ContentState => {
  if (hasError) return 'error';

  const resolvedSourceEdition = sourceEdition ?? lifecycle.edition;
  if (resolvedSourceEdition !== currentEdition) return 'stale';
  if (lifecycle.configuredState === 'unavailable') return 'unavailable';

  const hasPublishedItems = typeof itemCount === 'number' && itemCount > 0;
  const isManagedContentSource =
    lifecycle.source === 'graphql' || lifecycle.source === 'cms';

  // The public API and CMS only expose approved records. When either source
  // returns real current-edition content, that evidence is more authoritative
  // than a manually maintained "unpublished" fallback flag.
  if (isManagedContentSource && hasPublishedItems) return 'published';

  if (lifecycle.configuredState === 'unpublished') return 'unpublished';
  if (typeof itemCount === 'number' && itemCount === 0) return 'empty';
  return 'published';
};

export const phaseLabel: Record<EventPhase, string> = {
  planning: 'Planlegging',
  upcoming: 'Neste utgave',
  live: 'Pågår nå',
  postEvent: 'Årets messe er ferdig',
};

export const phasePrimaryAction: Record<
  EventPhase,
  { href: string; label: string }
> = {
  planning: { href: '#for-bedrifter', label: 'For bedrifter' },
  upcoming: { href: '/program', label: 'Se programmet' },
  live: { href: '/stands', label: 'Finn en stand' },
  postEvent: { href: '/galleri', label: 'Se tilbake på dagene' },
};
