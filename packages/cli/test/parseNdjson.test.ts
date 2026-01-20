import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';
import { beforeAll, describe, expect, it } from 'vitest';
import parsendjson from '../bin/utils/parseNdjson.js';

describe('Parse ND-JSON', () => {
  let jsonFixtures: Record<string, () => any>;

  beforeAll(async () => {
    const loadedFixtures = await fixtures;
    jsonFixtures = loadedFixtures.jsonFixtures;
  });

  it('should parse line-delimited JSON', () => {
    const parsed = parsendjson(jsonFixtures.ndjson(), '\n');

    expect(parsed.length).toEqual(4);
  });
});
