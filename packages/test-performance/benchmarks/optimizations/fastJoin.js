import { fastJoin } from '@json2csv/plainjs/utils.js';
import runSuite from '../runSuite.js';

// Exploratory candidate: same reduce()-based skip-holes semantics as fastJoin,
// but avoids the reduce callback and per-element template-literal overhead.
function indexedLoopJoin(arr, separator) {
  const length = arr.length;
  let result = '';
  let isFirst = true;
  for (let index = 0; index < length; index++) {
    if (!(index in arr)) continue;
    let elem = arr[index];
    if (elem === null || elem === undefined) elem = '';
    if (isFirst) {
      result = `${elem}`;
      isFirst = false;
    } else {
      result += separator;
      result += elem;
    }
  }
  return result;
}

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
        name: 'indexedLoopJoin',
        run: () => indexedLoopJoin(data, ', '),
      },
      {
        name: 'Array.join',
        run: () => data.join(', '),
      },
    ],
  });
}

// Sparse arrays (real holes, not explicit undefined) are the one case where
// fastJoin and Array.join intentionally disagree: fastJoin skips the hole
// entirely (no separator emitted for it), native join fills it with ''.
// indexedLoopJoin must match fastJoin here, not Array.join.
{
  // biome-ignore lint/suspicious/noSparseArray: real holes are the point of this test
  const sparse = ['a', , 'b', , , 'c'];
  const expected = fastJoin(sparse, ', ');

  await runSuite({
    name: 'Joining sparse array (holes)',
    expected,
    benchmarks: [
      {
        name: 'fastJoin',
        run: () => fastJoin(sparse, ', '),
      },
      {
        name: 'indexedLoopJoin',
        run: () => indexedLoopJoin(sparse, ', '),
      },
    ],
  });
}
