# @json2csv/whatwg

[![npm version](https://badge.fury.io/js/json2csv.svg)](http://badge.fury.io/js/json2csv)
[![Node.js CI](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml/badge.svg)](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml)
[![Coverage Status](https://coveralls.io/repos/github/juanjoDiaz/json2csv/badge.svg?branch=main)](https://coveralls.io/github/juanjoDiaz/json2csv?branch=main)

Fast and highly configurable JSON to CSV converter.
It fully support conversion following the [RFC4180](https://datatracker.ietf.org/doc/html/rfc4180) specification as well as other similar text delimited formats as TSV.

`@json2csv/test-performnance` include utilities to run performance tests around `json2csv`.

## Requirements

- Node v16+

## Usage

Install libraries to benchmark against

```bash
$ npm install --no-save json-2-csv json2csv papaparse -w @json2csv/test-performance
```

Run benchmark:
```bash
$ npm run benchmark -w @json2csv/test-performance -- <benchmark_inside_benchmark_folder> 
```

Or generate a flamegraph:
```bash
$ npm run flamegraph -w @json2csv/test-performance 
```

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
