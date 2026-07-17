const availableBenchmarks = new Map([
  ['formatter', './optimizations/stringQuoteOnlyIfNecessary.js'],
  ['parser', './optimizations/parser.js'],
  ['fast-join', './optimizations/fastJoin.js'],
  ['flatten', './optimizations/flattenReducer.js'],
]);

const requestedBenchmarks = process.argv
  .slice(2)
  .filter((argument) => argument !== '--validate-only');
const selectedBenchmarks = requestedBenchmarks.length
  ? requestedBenchmarks
  : [...availableBenchmarks.keys()];

process.stdout.write(
  `json2csv performance suite | Node ${process.version} | ${process.platform} ${process.arch}\n`,
);

for (const benchmarkName of selectedBenchmarks) {
  const benchmarkPath = availableBenchmarks.get(benchmarkName);
  if (!benchmarkPath) {
    throw new Error(
      `Unknown benchmark "${benchmarkName}". Available benchmarks: ${[
        ...availableBenchmarks.keys(),
      ].join(', ')}`,
    );
  }

  await import(benchmarkPath);
}
