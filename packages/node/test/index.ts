import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';

import AsyncParser from './AsyncParser.ts';
import AsyncParserInMemory from './AsyncParserInMemory.ts';
import Transform from './Transform.ts';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixtures } = await fixtures;

  AsyncParser(jsonFixturesStreams, csvFixtures).run();
  AsyncParserInMemory(jsonFixtures, csvFixtures).run();
  Transform(jsonFixturesStreams, csvFixtures).run();
}

run();
