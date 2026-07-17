import { fastJoin } from '@json2csv/plainjs/utils.js';
import runSuite from '../runSuite.js';

for (const sampleSize of [10, 100, 1000, 10000]) {
  const data = Array.from({ length: sampleSize }, (_, index) => {
    if (index % 29 === 0) return undefined;
    if (index % 17 === 0) return null;
    return 'blue';
  });
  const expected = data.join(', ');

  await runSuite({
    name: `Joining ${sampleSize} cells`,
    expected,
    benchmarks: [
      {
        name: 'fastJoin',
        run: () => fastJoin(data, ', '),
      },
      {
        name: 'Array.join',
        run: () => data.join(', '),
      },
    ],
  });
}
