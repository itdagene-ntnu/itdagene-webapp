import { PublishedStandMap } from './standMap';
import fetch from 'isomorphic-unfetch';

export const DEFAULT_EVENT_START_TIME = '10:00:00';
export const DEFAULT_EVENT_VENUE = 'Realfagbygget, NTNU';

export type OptionalEventConfiguration = {
  currentStandMap?: PublishedStandMap | null;
  eventStartTime?: string;
  programPublished?: boolean;
  standsPublished?: boolean;
  venue?: string;
};

type OptionalEventConfigurationResponse = {
  data?: {
    currentMetaData?: {
      eventStartTime?: unknown;
      programPublished?: unknown;
      standsPublished?: unknown;
      venue?: unknown;
    } | null;
    currentStandMap?: PublishedStandMap | null;
  } | null;
  errors?: ReadonlyArray<unknown>;
};

const buildOptionalEventConfigurationQuery = (
  includeCollaboratorTier: boolean
): string => `
  query OptionalEventConfigurationQuery {
    currentMetaData {
      programPublished
      standsPublished
      venue
      eventStartTime
    }
    currentStandMap {
      edition
      revision
      maps {
        date
        label
        location
        backgroundImage
        placements {
          standNumber
          companyName
          companySlug
          xPercent
          yPercent${
            includeCollaboratorTier ? '\n          collaboratorTier' : ''
          }
        }
      }
    }
  }
`;

export const OPTIONAL_EVENT_CONFIGURATION_QUERY =
  buildOptionalEventConfigurationQuery(true);

// A backend deployed before the partner highlight rejects the whole document
// rather than the single unknown field, which would take the map, the venue and
// the publication switches down with it.
export const LEGACY_OPTIONAL_EVENT_CONFIGURATION_QUERY =
  buildOptionalEventConfigurationQuery(false);

export const parseOptionalEventConfiguration = (
  response: OptionalEventConfigurationResponse
): OptionalEventConfiguration => {
  if (response.errors?.length || !response.data) return {};

  const metadata = response.data.currentMetaData;
  const standsPublished =
    typeof metadata?.standsPublished === 'boolean'
      ? metadata.standsPublished
      : undefined;

  return {
    // The visibility switch is authoritative. Fail closed when an older
    // backend omits it or malformed metadata reaches the frontend.
    currentStandMap:
      standsPublished === true ? response.data.currentStandMap : null,
    eventStartTime:
      typeof metadata?.eventStartTime === 'string'
        ? metadata.eventStartTime
        : undefined,
    programPublished:
      typeof metadata?.programPublished === 'boolean'
        ? metadata.programPublished
        : undefined,
    standsPublished,
    venue: typeof metadata?.venue === 'string' ? metadata.venue : undefined,
  };
};

const postConfigurationQuery = async (
  endpoint: string,
  request: typeof fetch,
  query: string,
  signal?: AbortSignal
): Promise<OptionalEventConfigurationResponse | null> => {
  const response = await request(endpoint, {
    body: JSON.stringify({
      operationName: 'OptionalEventConfigurationQuery',
      query,
      variables: {},
    }),
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  });

  if (!response.ok) return null;

  return response.json();
};

export const fetchOptionalEventConfiguration = async (
  endpoint: string,
  request: typeof fetch = fetch,
  timeoutMs = 2500
): Promise<OptionalEventConfiguration> => {
  const controller =
    typeof AbortController === 'undefined' ? undefined : new AbortController();
  const timeout = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : undefined;

  try {
    const extended = await postConfigurationQuery(
      endpoint,
      request,
      OPTIONAL_EVENT_CONFIGURATION_QUERY,
      controller?.signal
    );

    if (!extended) return {};
    if (!extended.errors?.length)
      return parseOptionalEventConfiguration(extended);

    // Only the partner highlight depends on the newest field, so retry without
    // it rather than dropping the whole configuration on an older backend.
    const legacy = await postConfigurationQuery(
      endpoint,
      request,
      LEGACY_OPTIONAL_EVENT_CONFIGURATION_QUERY,
      controller?.signal
    );

    return legacy ? parseOptionalEventConfiguration(legacy) : {};
  } catch {
    // The public frontend is deployed independently from the backend. Keep the
    // unpublished-safe defaults until the extended schema is available.
    return {};
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};
