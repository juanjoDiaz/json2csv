import { flattenReducer } from '@json2csv/plainjs/utils.js';
import runSuite from '../runSuite.js';

function flattenWithLoops(data) {
  const flattened = [];
  for (const values of data) {
    for (const value of values) flattened.push(value);
  }
  return flattened;
}

function spreadFlattenReducer(acc, arr) {
  try {
    if (Array.isArray(arr)) acc.push(...arr);
    else acc.push(arr);
    return acc;
  } catch {
    return acc.concat(arr);
  }
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
        name: 'legacy spread reducer',
        run: () => data.reduce(spreadFlattenReducer, []),
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
