'use strict';

const tape = require('tape');
const loadFixtures = require('./helpers/loadFixtures');
const CLI = require('./CLI');
const Parser = require('./Parser');
const AsyncParser = require('./NodeAsyncParser');
const AsyncParserInMemory = require('./NodeAsyncParserInMemory');
const StreamParser = require('./StreamParser');
const Transform = require('./NodeTransform');
const parseNdjson = require('./parseNdjson');

const testRunner = {
  tests: [],
  before: [],
  after: [],
  add(name, test) {
    this.tests.push({ name, test });
  },
  addBefore(func) {
    this.before.push(func);
  },
  addAfter(func) {
    this.after.push(func);
  },
  async run() {
    try {
      await Promise.all(testRunner.before.map(before => before()));
      this.tests.forEach(({ name, test }) => tape(name, async (t) => {
        try {
          await test(t);
        } catch (err) {
          t.fail(err);
        }
      }));
      this.after.forEach(after => tape.onFinish(after));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
};

async function loadAllFixtures() {
  return Promise.all([
    loadFixtures.loadJSON(),
    loadFixtures.loadJSONStreams(),
    loadFixtures.loadCSV()
  ]);
}

async function setupTests([jsonFixtures, jsonFixturesStreams, csvFixtures]) {
  CLI(testRunner, jsonFixtures, csvFixtures);
  Parser(testRunner, jsonFixtures, csvFixtures);
  AsyncParser(testRunner, jsonFixturesStreams, csvFixtures);
  AsyncParserInMemory(testRunner, jsonFixtures, csvFixtures);
  StreamParser(testRunner, jsonFixturesStreams, csvFixtures);
  Transform(testRunner, jsonFixturesStreams, csvFixtures);
  parseNdjson(testRunner, jsonFixtures);
}

loadAllFixtures()
  .then(setupTests)
  .then(() => testRunner.run());