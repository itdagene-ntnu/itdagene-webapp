import { PublishedStandMap } from './standMap';
import fetch from 'isomorphic-unfetch';

export const DEFAULT_EVENT_START_TIME = '10:00:00';
export const DEFAULT_EVENT_VENUE = 'Realfagbygget, NTNU';

export type OptionalEventConfiguration = {
  currentStandMap?: PublishedStandMap | null;
  eventStartTime?: string;
  programPublished?: boolean;
  venue?: string;
};

let browserConfigurationCache: OptionalEventConfiguration | undefined;

export const getCachedOptionalEventConfiguration = ():
  | OptionalEventConfiguration
  | undefined => browserConfigurationCache;

export const cacheOptionalEventConfiguration = (
  configuration: OptionalEventConfiguration
): void => {
  browserConfigurationCache = configuration;
};

type OptionalEventConfigurationResponse = {
  data?: {
    currentMetaData?: {
      eventStartTime?: unknown;
      programPublished?: unknown;
      venue?: unknown;
    } | null;
    currentStandMap?: PublishedStandMap | null;
  } | null;
  errors?: ReadonlyArray<unknown>;
};

export const OPTIONAL_EVENT_CONFIGURATION_QUERY = `
  query OptionalEventConfigurationQuery {
    currentMetaData {
      programPublished
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
          yPercent
        }
      }
    }
  }
`;

export const parseOptionalEventConfiguration = (
  response: OptionalEventConfigurationResponse
): OptionalEventConfiguration => {
  if (response.errors?.length || !response.data) return {};

  const metadata = response.data.currentMetaData;

  return {
    currentStandMap: response.data.currentStandMap,
    eventStartTime:
      typeof metadata?.eventStartTime === 'string'
        ? metadata.eventStartTime
        : undefined,
    programPublished:
      typeof metadata?.programPublished === 'boolean'
        ? metadata.programPublished
        : undefined,
    venue: typeof metadata?.venue === 'string' ? metadata.venue : undefined,
  };
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
    const response = await request(endpoint, {
      body: JSON.stringify({
        operationName: 'OptionalEventConfigurationQuery',
        query: OPTIONAL_EVENT_CONFIGURATION_QUERY,
        variables: {},
      }),
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: controller?.signal,
    });

    if (!response.ok) return {};

    return parseOptionalEventConfiguration(await response.json());
  } catch {
    // The public frontend is deployed independently from the backend. Keep the
    // unpublished-safe defaults until the extended schema is available.
    return {};
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};
