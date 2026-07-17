import {
  availableBenchmarks,
  selectBenchmarks,
} from './availableBenchmarks.js';

const selectedBenchmarks = selectBenchmarks(process.argv.slice(2));

process.stdout.write(
  `json2csv performance suite | Node ${process.version} | ${process.platform} ${process.arch}\n`,
);

for (const benchmarkName of selectedBenchmarks) {
  const benchmarkPath = availableBenchmarks.get(benchmarkName);
  await import(benchmarkPath);
}
