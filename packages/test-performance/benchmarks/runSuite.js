import assert from 'node:assert/strict';
import Benchmark from 'benchmark';

const validateOnly = process.argv.includes('--validate-only');

export default async function runSuite({ name, benchmarks, expected }) {
  process.stdout.write(`\n${name}\n`);

  for (const benchmark of benchmarks) {
    const actual = (benchmark.validate || benchmark.run)();
    assert.deepStrictEqual(
      actual,
      expected,
      `${name}: "${benchmark.name}" produced different output`,
    );
  }

  process.stdout.write('  validation: passed\n');
  if (validateOnly) return;

  const suite = new Benchmark.Suite(name);
  for (const benchmark of benchmarks) {
    suite.add(benchmark.name, {
      fn: benchmark.run,
      maxTime: 1,
      minSamples: 10,
    });
  }

  await new Promise((resolve, reject) => {
    suite
      .on('cycle', (event) => {
        process.stdout.write(`  ${String(event.target)}\n`);
      })
      .on('complete', () => {
        const fastest = suite.filter('fastest').map('name').join(', ');
        process.stdout.write(`  fastest: ${fastest}\n`);
        resolve();
      })
      .on('error', (event) => {
        reject(event.target.error);
      })
      .run({ async: true });
  });
}
