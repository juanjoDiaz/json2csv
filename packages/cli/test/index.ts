import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';

import CLI from './CLI.ts';
import parseNdjson from './parseNdjson.ts';

async function run() {
  const { jsonFixtures, csvFixtures } = await fixtures;

  CLI(jsonFixtures, csvFixtures).run();
  parseNdjson(jsonFixtures).run();
}

run();
