import { fixtures } from '@json2csv/test-helpers/fixtureLoader.js';

import CommonJS from './CommonJS.cjs';
import Parser from './Parser.js';
import StreamParser from './StreamParser.js';

async function run() {
  const { jsonFixtures, jsonFixturesStreams, csvFixturesWithLinuxEol } =
    await fixtures;

  CommonJS().run();
  Parser(jsonFixtures, csvFixturesWithLinuxEol).run();
  StreamParser(jsonFixturesStreams, csvFixturesWithLinuxEol).run();
}

run();
