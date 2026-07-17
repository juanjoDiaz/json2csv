const validateOnly = globalThis.__json2csvBenchmarkConfig.validateOnly;
const sampleCount = 10;
const sampleDurationMs = 80;
let _benchmarkSink;

function deepEqual(actual, expected) {
  if (Object.is(actual, expected)) return true;
  if (!actual || !expected || typeof actual !== typeof expected) return false;

  if (Array.isArray(actual)) {
    return (
      Array.isArray(expected) &&
      actual.length === expected.length &&
      actual.every((value, index) => deepEqual(value, expected[index]))
    );
  }

  if (typeof actual === 'object') {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    return (
      actualKeys.length === expectedKeys.length &&
      actualKeys.every(
        (key) =>
          Object.hasOwn(expected, key) && deepEqual(actual[key], expected[key]),
      )
    );
  }

  return false;
}

function runIterations(run, iterations) {
  for (let index = 0; index < iterations; index++) _benchmarkSink = run();
}

function calibrate(run) {
  let iterations = 1;
  let elapsedMs = 0;

  while (elapsedMs < 20) {
    const start = performance.now();
    runIterations(run, iterations);
    elapsedMs = performance.now() - start;
    if (elapsedMs < 20) iterations *= 10;
  }

  return Math.max(1, Math.round((iterations * sampleDurationMs) / elapsedMs));
}

async function measure(run) {
  const iterations = calibrate(run);
  const samples = [];

  for (let sample = 0; sample < sampleCount; sample++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const start = performance.now();
    runIterations(run, iterations);
    const elapsedMs = performance.now() - start;
    samples.push((iterations * 1000) / elapsedMs);
  }

  const hz = samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
  const variance =
    samples.reduce((sum, sample) => sum + (sample - hz) ** 2, 0) /
    (samples.length - 1);
  const standardError = Math.sqrt(variance) / Math.sqrt(samples.length);
  const rme = (1.96 * standardError * 100) / hz;

  return { hz, rme, samples: samples.length };
}

function formatOps(hz) {
  return Math.round(hz).toLocaleString('en-US');
}

export default async function runSuite({ name, benchmarks, expected }) {
  console.log(`\n${name}`);

  for (const benchmark of benchmarks) {
    const actual = (benchmark.validate || benchmark.run)();
    if (!deepEqual(actual, expected)) {
      throw new Error(`${name}: "${benchmark.name}" produced different output`);
    }
  }

  console.log('  validation: passed');
  const result = { name, benchmarks: [] };
  globalThis.__json2csvBenchmarkResults.push(result);
  if (validateOnly) return;

  for (const benchmark of benchmarks) {
    const measurement = await measure(benchmark.run);
    result.benchmarks.push({ name: benchmark.name, ...measurement });
    console.log(
      `  ${benchmark.name} x ${formatOps(measurement.hz)} ops/sec ±${measurement.rme.toFixed(2)}% (${measurement.samples} runs sampled)`,
    );
  }

  const best = result.benchmarks.reduce((fastest, benchmark) =>
    benchmark.hz > fastest.hz ? benchmark : fastest,
  );
  const bestLowerBound = best.hz * (1 - best.rme / 100);
  const fastest = result.benchmarks
    .filter(
      (benchmark) => benchmark.hz * (1 + benchmark.rme / 100) >= bestLowerBound,
    )
    .map((benchmark) => benchmark.name)
    .join(', ');
  console.log(`  fastest: ${fastest}`);
}
