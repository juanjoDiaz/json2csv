import { fixtures } from '@json2csv/test-helpers/fixtureLoader.js';

import AsyncParser from './AsyncParser.js';
import AsyncParserInMemory from './AsyncParserInMemory.js';
import TransformStream from './TransformStream.js';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixturesWithLinuxEol } =
    await fixtures;

  AsyncParser(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
  AsyncParserInMemory(jsonFixtures, csvFixturesWithLinuxEol).run();
  TransformStream(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
}

run();
