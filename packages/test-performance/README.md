# @json2csv Performance tests

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
