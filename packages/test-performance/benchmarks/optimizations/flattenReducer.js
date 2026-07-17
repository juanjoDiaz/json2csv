import { flattenReducer } from '@json2csv/plainjs/utils.js';
import runSuite from '../runSuite.js';

function flattenWithLoops(data) {
  const flattened = [];
  for (const values of data) {
    for (const value of values) flattened.push(value);
  }
  return flattened;
}

for (const sampleSize of [10, 100, 1000, 10000]) {
  const data = Array.from({ length: sampleSize }, () => [
    'blue',
    'red',
    'green',
  ]);
  const expected = data.flat();

  await runSuite({
    name: `Flattening ${sampleSize} arrays`,
    expected,
    benchmarks: [
      {
        name: 'flattenReducer',
        run: () => data.reduce(flattenReducer, []),
      },
      {
        name: 'Array.flat',
        run: () => data.flat(),
      },
      {
        name: 'nested loops',
        run: () => flattenWithLoops(data),
      },
    ],
  });
}
