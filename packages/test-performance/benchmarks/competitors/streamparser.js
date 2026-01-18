import { string as stringFormatter } from '@json2csv/formatters';
import { StreamParser } from '@json2csv/plainjs';
import Benchmark from 'benchmark';

// import Papa from 'papaparse';
// import json2csv2 from 'json-2-csv';

const data = JSON.stringify(
  Array(1000).fill((() => ({ carModel: 'Audi', price: 0, color: 'blue' }))()),
);
// const data = Array(100).fill((() => ({ carModel: 1234123, price: 0, color: 1234 }))());
// const data = Array(10000).fill((() => ({ carModel: 'Audi', price: 0, color: ['blue', 'red', 'green' ]}))());

const suite = new Benchmark.Suite();

suite
  .add('@json2csv', {
    defer: true,
    fn: (deferred) => {
      const json2csvParser = new StreamParser();
      json2csvParser.onError = (err) => {
        // biome-ignore lint/suspicious/noConsole: Print error for debugging
        console.log(err);
        deferred.reject(err);
      };
      json2csvParser.onEnd = () => deferred.resolve();
      json2csvParser.write(data);
      json2csvParser.end();
    },
  })
  .add('@json2csv (no string escaping)', {
    defer: true,
    fn: (deferred) => {
      const json2csvParserWithoutScaping = new StreamParser({
        formatters: {
          string: stringFormatter({ escapedQuote: '"' }),
        },
      });
      json2csvParserWithoutScaping.onError = (err) => {
        // biome-ignore lint/suspicious/noConsole: Print error for debugging
        console.log(err);
        deferred.reject(err);
      };
      json2csvParserWithoutScaping.onEnd = () => deferred.resolve();
      json2csvParserWithoutScaping.write(data);
      json2csvParserWithoutScaping.end();
    },
  })
  // .add('json2csv (Legacy)', {
  //   defer: true,
  //   fn: async function(deferred) {
  //     await json2csvLegacyParser.parse(data).promise();
  //     deferred.resolve();
  //   }
  // })
  // .add('PapaParse', function() {
  //   Papa.unparse(data);
  // })
  // .add('json-2-csv', {
  //   defer: true,
  //   fn: function (deferred) {
  //     json2csv2.json2csv(data, () => deferred.resolve());
  //   }
  // })
  .on('cycle', (_event) => {})
  .on('complete', () =>
    // biome-ignore lint/suspicious/noConsole: Print error for debugging
    console.log(`Fastest is ${suite.filter('fastest').map('name')} \n`),
  )
  .on('error', console.error)
  .run({ async: true });
