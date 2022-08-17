import { Parser as LegacyParser } from 'json2csv';
import { Parser, StreamParser } from '@json2csv/plainjs';
import stringFormatter from '@json2csv/formatters/string';
// import Papa from 'papaparse'
// import json2csv2 from 'json-2-csv';
const data = Array(1000).fill(
  (() => ({ carModel: 'Audi', price: 0, color: 'blue', power: 220 }))()
);
const streamData = JSON.stringify(data);

const json2csvParser = new Parser();
const json2csvLegacyParser = new LegacyParser();

for (let index = 0; index < 1000; index++) {
  json2csvParser.parse(data);
}

for (let index = 0; index < 1000; index++) {
  json2csvLegacyParser.parse(data);
}

for (let index = 0; index < 1000; index++) {
  await new Promise((resolve, reject) => {
    const json2csvParser = new StreamParser();
    json2csvParser.onError = (err) => reject(err);
    json2csvParser.onEnd = () => resolve();
    json2csvParser.write(streamData);
    json2csvParser.end();
  });
}

for (let index = 0; index < 1000; index++) {
  await new Promise((resolve, reject) => {
    const json2csvParserWithoutScaping = new StreamParser({
      formatters: {
        string: stringFormatter({ escapedQuote: '"' }),
      },
    });
    json2csvParserWithoutScaping.onError = (err) => reject(err);
    json2csvParserWithoutScaping.onEnd = () => resolve();
    json2csvParserWithoutScaping.write(streamData);
    json2csvParserWithoutScaping.end();
  });
}
