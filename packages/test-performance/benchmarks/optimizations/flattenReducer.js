import { flattenReducer } from '@json2csv/plainjs/utils';
import Benchmark from 'benchmark';

function test(sampleSize) {
  const data = Array(sampleSize).fill((() => ['blue', 'red', 'green'])());
  const suite = new Benchmark.Suite();
  suite
    .add(`flattenReducer(${sampleSize})`, () => data.reduce(flattenReducer, []))
    .add(`flat(${sampleSize})`, () => data.flat())
    .on('cycle', (_event) => {})
    .on('complete', () => {})
    .on('error', console.error)
    .run();
}

[10, 100, 1000, 10000].forEach(test);
