export const availableBenchmarks = new Map([
  ['formatter', './optimizations/stringQuoteOnlyIfNecessary.js'],
  ['parser', './optimizations/parser.js'],
  ['fast-join', './optimizations/fastJoin.js'],
  ['flatten', './optimizations/flattenReducer.js'],
]);

export function selectBenchmarks(args) {
  const requestedBenchmarks = args.filter((argument) =>
    availableBenchmarks.has(argument),
  );
  const unknownBenchmarks = args.filter(
    (argument) =>
      !argument.startsWith('--') && !availableBenchmarks.has(argument),
  );

  if (unknownBenchmarks.length) {
    throw new Error(
      `Unknown benchmark "${unknownBenchmarks[0]}". Available benchmarks: ${[
        ...availableBenchmarks.keys(),
      ].join(', ')}`,
    );
  }

  return requestedBenchmarks.length
    ? requestedBenchmarks
    : [...availableBenchmarks.keys()];
}
