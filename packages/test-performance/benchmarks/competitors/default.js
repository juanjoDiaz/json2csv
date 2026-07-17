import { string as stringFormatter } from '@json2csv/formatters';
import { Parser } from '@json2csv/plainjs';
import Benchmark from 'benchmark';
import json2csv2 from 'json-2-csv';
import { Parser as LegacyParser } from 'json2csv';
import Papa from 'papaparse';

const data = Array(1000).fill(
  (() => ({ carModel: 'Audi', price: 0, color: 'blue' }))(),
);
// const data = Array(100).fill((() => ({ carModel: 1234123, price: 0, color: 1234 }))());
// const data = Array(10000).fill((() => ({ carModel: 'Audi', price: 0, color: ['blue', 'red', 'green' ]}))());

const suite = new Benchmark.Suite();
const json2csvParser = new Parser();
const json2csvParserWithoutScaping = new Parser({
  formatters: {
    string: stringFormatter({ escapedQuote: '"' }),
  },
});
const json2csvLegacyParser = new LegacyParser();

suite
  .add('@json2csv', () => {
    json2csvParser.parse(data);
  })
  .add('@json2csv (no string escaping)', () => {
    json2csvParserWithoutScaping.parse(data);
  })
  .add('json2csv (Legacy)', () => {
    json2csvLegacyParser.parse(data);
  })
  .add('PapaParse', () => {
    Papa.unparse(data);
  })
  .add('json-2-csv', {
    defer: true,
    fn: (deferred) => {
      json2csv2.json2csv(data, () => deferred.resolve());
    },
  })
  .on('cycle', (event) => console.log(String(event.target)))
  .on('complete', () =>
    console.log(`Fastest is ${suite.filter('fastest').map('name')}\n`),
  )
  .on('error', console.error)
  .run();
