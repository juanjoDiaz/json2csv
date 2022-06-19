import { fixtures } from '@json2csv/test-helpers/fixtureLoader.js';

import Parser from './Parser.js';
import StreamParser from './StreamParser.js';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixturesWithLinuxEol } =
    await fixtures;

  Parser(jsonFixtures, csvFixturesWithLinuxEol).run();
  StreamParser(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
}

run();
