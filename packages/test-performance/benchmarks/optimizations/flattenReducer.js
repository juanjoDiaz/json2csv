import Benchmark from 'benchmark';
import { flattenReducer } from '@json2csv/plainjs/utils';

function test(sampleSize) {
  const data = Array(sampleSize).fill((() => ['blue', 'red', 'green'])());
  const suite = new Benchmark.Suite();
  suite
    .add(`flattenReducer(${sampleSize})`, () => data.reduce(flattenReducer, []))
    .add(`flat(${sampleSize})`, () => data.flat())
    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', () =>
      console.log(`Fastest is ${suite.filter('fastest').map('name')} \n`)
    )
    .on('error', console.error)
    .run();
}

[10, 100, 1000, 10000].forEach(test);
