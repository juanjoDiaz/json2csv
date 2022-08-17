import Benchmark from 'benchmark';
import { fastJoin } from '@json2csv/plainjs/utils';

function test(sampleSize) {
  const data = Array(sampleSize).fill((() => 'blue')());
  const suite = new Benchmark.Suite();
  suite
    .add(`fastJoin(${sampleSize})`, () => fastJoin(data, ', '))
    .add(`join(${sampleSize})`, () => data.join(', '))
    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', () =>
      console.log(`Fastest is ${suite.filter('fastest').map('name')} \n`)
    )
    .on('error', console.error)
    .run();
}

[10, 100, 1000, 10000].forEach(test);
