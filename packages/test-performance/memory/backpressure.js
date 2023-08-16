import fs from 'fs';
import https from 'https';
import { pipeline } from 'stream/promises';

import { Transform } from '@json2csv/node';
import { flatten } from '@json2csv/transforms';
const mb100 =
  'https://data.wa.gov/api/views/f6w7-q2d2/rows.json?accessType=DOWNLOAD';

const parserOptions = { transforms: [flatten()] };
const streamParserOptions = { stringBufferSize: 256 };
const transformOptions = { highWaterMark: 96000 };

try {
  const url = mb100;
  await new Promise((resolve) => {
    https.get(url, (networkStream) => {
      resolve(
        pipeline(
          networkStream,
          new Transform(parserOptions, streamParserOptions, transformOptions),
          fs.createWriteStream('mb100.csv'),
        ),
      );
    });
  });
} catch (err) {
  console.error(err);
}
