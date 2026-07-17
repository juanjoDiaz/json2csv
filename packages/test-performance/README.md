# @json2csv Performance tests

## Requirements

- Node v20+

## Usage

Run all optimization benchmarks in Node:

```bash
$ npm run benchmark:node -w @json2csv/test-performance
```

The command builds the workspace packages first, so measurements always use the
current source rather than stale `dist` output.

Run the same benchmarks in Playwright's Chrome for Testing, Firefox, and WebKit
(the Safari engine proxy):

```bash
$ npx playwright install chromium firefox webkit
$ npm run benchmark:browser -w @json2csv/test-performance
```

Run Node and all three browser engines sequentially:

```bash
$ npm run benchmark:all -w @json2csv/test-performance
```

Every candidate is checked against a reference result before timing starts. Run
the correctness checks without collecting timings with:

```bash
$ npm run test:node -w @json2csv/test-performance
$ npm run test:browser -w @json2csv/test-performance
$ npm run test:all -w @json2csv/test-performance
```

Run one benchmark group by name:

```bash
$ npm run benchmark:node -w @json2csv/test-performance -- formatter
$ npm run benchmark:node -w @json2csv/test-performance -- parser
$ npm run benchmark:node -w @json2csv/test-performance -- fast-join
$ npm run benchmark:node -w @json2csv/test-performance -- flatten
$ npm run benchmark:browser -w @json2csv/test-performance -- parser
```

Run a single browser with `--browser=chrome`, `--browser=firefox`, or
`--browser=webkit`. WebKit exercises the browser engine used by Safari; it does
not launch the branded Safari application.

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
