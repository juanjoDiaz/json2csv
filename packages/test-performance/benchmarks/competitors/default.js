import Benchmark from 'benchmark';
import { Parser as LegacyParser } from 'json2csv';
import { Parser } from '@json2csv/plainjs';
import { string as stringFormatter } from '@json2csv/formatters';
import Papa from 'papaparse';
import json2csv2 from 'json-2-csv';

const data = Array(1000).fill(
  (() => ({ carModel: 'Audi', price: 0, color: 'blue' }))()
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
  .add('@json2csv', function () {
    json2csvParser.parse(data);
  })
  .add('@json2csv (no string escaping)', function () {
    json2csvParserWithoutScaping.parse(data);
  })
  .add('json2csv (Legacy)', function () {
    json2csvLegacyParser.parse(data);
  })
  .add('PapaParse', function () {
    Papa.unparse(data);
  })
  .add('json-2-csv', {
    defer: true,
    fn: function (deferred) {
      json2csv2.json2csv(data, () => deferred.resolve());
    },
  })
  .on('cycle', (event) => console.log(String(event.target)))
  .on('complete', () =>
    console.log(`Fastest is ${suite.filter('fastest').map('name')} \n`)
  )
  .on('error', console.error)
  .run();
