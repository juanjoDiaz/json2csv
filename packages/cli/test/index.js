import { fixtures } from '@json2csv/test-helpers/fixtureLoader.js';

import CLI from './CLI.js';
import parseNdjson from './parseNdjson.js';

async function run() {
  const { jsonFixtures, csvFixtures } = await fixtures;

  CLI(jsonFixtures, csvFixtures).run();
  parseNdjson(jsonFixtures).run();
}

run();
