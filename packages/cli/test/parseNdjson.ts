import TestRunner from '@json2csv/test-helpers/TestRunner.js';
import parsendjson from '../bin/utils/parseNdjson.js';

export default function (jsonFixtures: Record<string, () => any>) {
  const testRunner = new TestRunner('Parse ND-JSON');

  testRunner.add('should parse line-delimited JSON', (t) => {
    const parsed = parsendjson(jsonFixtures.ndjson(), '\n');

    t.equal(parsed.length, 4, 'parsed input has correct length');
  });

  return testRunner;
}
