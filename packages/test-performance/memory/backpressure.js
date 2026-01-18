import fs from 'node:fs';
import https from 'node:https';
import { pipeline } from 'node:stream/promises';

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
  // biome-ignore lint/suspicious/noConsole: Print error for debugging
  console.error(err);
}
