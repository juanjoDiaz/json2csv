import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';

import AsyncParser from './AsyncParser.ts';
import AsyncParserInMemory from './AsyncParserInMemory.ts';
import TransformStream from './TransformStream.ts';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixturesWithLinuxEol } =
    await fixtures;

  AsyncParser(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
  AsyncParserInMemory(jsonFixtures, csvFixturesWithLinuxEol).run();
  TransformStream(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
}

run();
