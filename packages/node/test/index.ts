import { fixtures } from '@json2csv/test-helpers/fixtureLoader.js';

import AsyncParser from './AsyncParser.js';
import AsyncParserInMemory from './AsyncParserInMemory.js';
import Transform from './Transform.js';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixtures } = await fixtures;

  AsyncParser(jsonFixturesStreams, csvFixtures).run();
  AsyncParserInMemory(jsonFixtures, csvFixtures).run();
  Transform(jsonFixturesStreams, csvFixtures).run();
}

run();
