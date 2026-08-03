import fs from 'fs';
import path from 'path';
import { buildSchema, parse, validate } from 'graphql';
import {
  OPTIONAL_EVENT_CONFIGURATION_QUERY,
  fetchOptionalEventConfiguration,
  parseOptionalEventConfiguration,
} from './optionalEventConfiguration';

describe('optional event configuration', () => {
  test('matches the reviewed backend schema', () => {
    const schema = buildSchema(
      fs.readFileSync(
        path.join(__dirname, '..', 'schema', 'schema.graphql'),
        'utf8'
      )
    );

    expect(validate(schema, parse(OPTIONAL_EVENT_CONFIGURATION_QUERY))).toEqual(
      []
    );
  });

  test('accepts the configuration published by the new backend', () => {
    const currentStandMap = {
      edition: 2026,
      revision: 3,
      maps: [],
    };

    expect(
      parseOptionalEventConfiguration({
        data: {
          currentMetaData: {
            eventStartTime: '09:30:00',
            programPublished: true,
            standsPublished: true,
            venue: 'Realfagbygget',
          },
          currentStandMap,
        },
      })
    ).toEqual({
      currentStandMap,
      eventStartTime: '09:30:00',
      programPublished: true,
      standsPublished: true,
      venue: 'Realfagbygget',
    });
  });

  test('falls back cleanly while production has the legacy schema', () => {
    expect(
      parseOptionalEventConfiguration({
        errors: [{ message: 'Cannot query field programPublished' }],
      })
    ).toEqual({});
  });

  test('ignores malformed optional values', () => {
    expect(
      parseOptionalEventConfiguration({
        data: {
          currentMetaData: {
            eventStartTime: null,
            programPublished: 'yes',
            standsPublished: 'yes',
            venue: 2026,
          },
          currentStandMap: null,
        },
      })
    ).toEqual({ currentStandMap: null, standsPublished: undefined });
  });

  test('hides a returned stand map when the visibility setting is off', () => {
    expect(
      parseOptionalEventConfiguration({
        data: {
          currentMetaData: {
            standsPublished: false,
          },
          currentStandMap: {
            edition: 2025,
            revision: 9,
            maps: [],
          },
        },
      })
    ).toEqual({ currentStandMap: null, standsPublished: false });
  });

  test('fetches the extended contract from the selected GraphQL endpoint', async () => {
    const request = jest.fn().mockResolvedValue({
      json: async () => ({
        data: {
          currentMetaData: {
            eventStartTime: '09:00:00',
            programPublished: false,
            standsPublished: false,
            venue: 'Realfagbygget, NTNU',
          },
          currentStandMap: null,
        },
      }),
      ok: true,
    });

    await expect(
      fetchOptionalEventConfiguration('https://example.test/graphql', request)
    ).resolves.toEqual({
      currentStandMap: null,
      eventStartTime: '09:00:00',
      programPublished: false,
      standsPublished: false,
      venue: 'Realfagbygget, NTNU',
    });

    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toBe('https://example.test/graphql');
    expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({
      operationName: 'OptionalEventConfigurationQuery',
      variables: {},
    });
  });

  test('uses unpublished-safe defaults when the extended contract is absent', async () => {
    const request = jest.fn().mockRejectedValue(new Error('offline'));

    await expect(
      fetchOptionalEventConfiguration('https://example.test/graphql', request)
    ).resolves.toEqual({});
  });
});
