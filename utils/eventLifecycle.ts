import dayjs, { Dayjs } from 'dayjs';
import {
  ContentLifecycleConfig,
  ContentState,
  EventPhase,
} from '../config/edition';
import { eventInstant, eventLocalTime } from './eventTime';

export const resolveEventPhase = ({
  startDate,
  endDate,
  publicLaunchAt,
  now = dayjs(),
}: {
  startDate: string;
  endDate: string;
  publicLaunchAt: string;
  now?: string | Dayjs;
}): EventPhase => {
  const current = eventInstant(now);
  const launch = eventLocalTime(publicLaunchAt).startOf('day');
  const start = eventLocalTime(startDate).startOf('day');
  const end = eventLocalTime(endDate).endOf('day');

  if (current.isBefore(launch)) return 'planning';
  if (current.isBefore(start)) return 'upcoming';
  if (current.isAfter(end)) return 'postEvent';
  return 'live';
};

export const resolveContentState = ({
  lifecycle,
  currentEdition,
  sourceEdition,
  itemCount,
  isPublished,
  hasError = false,
}: {
  lifecycle: ContentLifecycleConfig;
  currentEdition: number;
  sourceEdition?: number;
  itemCount?: number;
  isPublished?: boolean;
  hasError?: boolean;
}): ContentState => {
  if (hasError) return 'error';

  const resolvedSourceEdition = sourceEdition ?? lifecycle.edition;
  if (resolvedSourceEdition !== currentEdition) return 'stale';
  if (lifecycle.configuredState === 'unavailable') return 'unavailable';

  // An admin-owned publication switch is authoritative when the source
  // provides one. A published empty program is meaningfully different from a
  // draft, even though both return an empty event array.
  if (isPublished === false) return 'unpublished';
  if (isPublished === true) {
    return itemCount === 0 ? 'empty' : 'published';
  }

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
