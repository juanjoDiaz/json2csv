# @json2csv Performance tests

## Requirements

- Node v20+

## Usage

Run all optimization benchmarks:

```bash
$ npm run benchmark -w @json2csv/test-performance
```

The command builds the workspace packages first, so measurements always use the
current source rather than stale `dist` output.

Every candidate is checked against a reference result before timing starts. Run
the correctness checks without collecting timings with:

```bash
$ npm test -w @json2csv/test-performance
```

Run one benchmark group by name:

```bash
$ npm run benchmark -w @json2csv/test-performance -- formatter
$ npm run benchmark -w @json2csv/test-performance -- parser
$ npm run benchmark -w @json2csv/test-performance -- fast-join
$ npm run benchmark -w @json2csv/test-performance -- flatten
```

Competitor benchmarks require optional packages:

```bash
$ npm install --no-save json-2-csv json2csv papaparse -w @json2csv/test-performance
$ node packages/test-performance/benchmarks/competitors/default.js
```

Generate a flamegraph:

```bash
$ npm run flamegraph -w @json2csv/test-performance 
```

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
