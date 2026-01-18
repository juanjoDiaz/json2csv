import { fixtures } from '@json2csv/test-helpers/fixtureLoader.ts';

import Parser from './Parser.ts';
import StreamParser from './StreamParser.ts';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixturesWithLinuxEol } =
    await fixtures;

  Parser(jsonFixtures, csvFixturesWithLinuxEol).run();
  StreamParser(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
}

run();
