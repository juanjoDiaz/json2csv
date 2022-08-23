# @json2csv/CLI

[![npm version](https://badge.fury.io/js/@json2csv%2Fcli.svg)](https://badge.fury.io/js/@json2csv%2Fcli)
[![npm monthly downloads](https://img.shields.io/npm/dm/@json2csv/cli.svg)](https://badge.fury.io/js/@json2csv%2Fcli)
[![Node.js CI](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml/badge.svg)](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml)
[![Coverage Status](https://coveralls.io/repos/github/juanjoDiaz/json2csv/badge.svg?branch=main)](https://coveralls.io/github/juanjoDiaz/json2csv?branch=main)
[![license](https://img.shields.io/npm/l/@json2csv/plainjs)](https://raw.githubusercontent.com/juanjoDiaz/json2csv/main/LICENSE.md)

Fast and highly configurable JSON to CSV converter.
It fully support conversion following the [RFC4180](https://datatracker.ietf.org/doc/html/rfc4180) specification as well as other similar text delimited formats as TSV.

`@json2csv/cli` makes `json2csv` usable as a command line tool.

### Features

- Fast and lightweight
- Support for standard JSON as well as NDJSON
- Scalable to infinitely large datasets (using stream processing)
- Advanced data selection (automatic field discovery, underscore-like selectors, custom data getters, default values for missing fields, ...)
- Support for custom input data transformation
- Support for custom csv cell formatting.
- Highly customizable (supportting custom quotation marks, delimiters, eol values, etc.)
- Automatic escaping (preserving new lines, quotes, etc.)
- Optional headers
- Unicode encoding support
- Pretty printing in table format to stdout

### Other json2csv packages

There are multiple flavours of json2csv:

* **[Plainjs](https://www.npmjs.com/package/@json2csv/plainjs):** Includes the `Parser` API and a new `StreamParser` API which doesn't the conversion in a streaming fashion in pure js.
* **[Node](https://www.npmjs.com/package/@json2csv/node):** Includes the `Node Transform` and `Node Async Parser` APIs for Node users.
* **[WHATWG](https://www.npmjs.com/package/@json2csv/whatwg):** Includes the `WHATWG Transform Stream` and `WHATWG Async Parser` APIs for users of WHATWG streams (browser, Node or Deno).
* **[CLI](https://www.npmjs.com/package/@json2csv/cli):** Includes the `CLI` interface.

And a couple of libraries that enable additional configurations:

* **[Transforms](https://www.npmjs.com/package/@json2csv/transforms):** Includes the built-in `transforms` for json2csv (unwind and flatten) allowing the using to transform data before is parsed.
* **[Formatters](https://www.npmjs.com/package/@json2csv/formatters):** Includes the built-in `formatters` for json2csv (one for each data type, an excel-specific one, etc.). Formatters convert JSON data types into CSV-compatible strings.

## Requirements

- Node v16+

## Installation

### **NPM**

You can install json2csv as a dependency using NPM.

It's advisable to install it as a global dependency so it can be called from anywhere.

```bash
$ npm install -g @json2csv/cli
```

### **Yarn**

You can install json2csv using Yarn.

It's advisable to install it as a global dependency so it can be called from anywhere.

```bash
$ yarn global add @json2csv/cli
```

## Usage

```bash
$ json2csv -i input.json
```

### Parameters

```bash
Usage: json2csv [options]

Options:
  -V, --version                       output the version number
  -i, --input <input>                 Path and name of the incoming json file. Defaults to stdin.
  -o, --output <output>               Path and name of the resulting csv file. Defaults to stdout.
  -c, --config <path>                 Specify a file with a valid JSON configuration.
  -n, --ndjson                        Treat the input as NewLine-Delimited JSON.
  -s, --no-streaming                  Process the whole JSON array in memory instead of doing it line by line.
  -f, --fields <fields>               List of fields to process. Defaults to field auto-detection.
  -v, --default-value <defaultValue>  Default value to use for missing fields.
  -q, --quote <quote>                 Character(s) to use as quote mark. Defaults to '"'.
  -Q, --escaped-quote <escapedQuote>  Character(s) to use as a escaped quote. Defaults to a double `quote`, '""'.
  -d, --delimiter <delimiter>         Character(s) to use as delimiter. Defaults to ','. (default: ",")
  -e, --eol <eol>                     Character(s) to use as End-of-Line for separating rows. Defaults to '\n'. (default: "\n")
  -E, --excel-strings                 Wraps string data to force Excel to interpret it as string even if it contains a number.
  -H, --no-header                     Disable the column name header.
  -a, --include-empty-rows            Includes empty rows in the resulting CSV output.
  -b, --with-bom                      Includes BOM character at the beginning of the CSV.
  -p, --pretty                        Print output as a pretty table. Use only when printing to console.
  --unwind [paths]                    Creates multiple rows from a single JSON document similar to MongoDB unwind.
  --unwind-blank                      When unwinding, blank out instead of repeating data. Defaults to false. (default: false)
  --flatten-objects                   Flatten nested objects. Defaults to false. (default: false)
  --flatten-arrays                    Flatten nested arrays. Defaults to false. (default: false)
  --flatten-separator <separator>     Flattened keys separator. Defaults to '.'. (default: ".")
  -h, --help                          output usage information
```

### Examples

#### Input file, data selection and output to stdout

```bash
$ json2csv -i input.json -f carModel,price,color

carModel,price,color
"Audi",10000,"blue"
"BMW",15000,"red"
"Mercedes",20000,"yellow"
"Porsche",30000,"green"
```

#### Input file, data selection and pretty output to stdout

```bash
$ json2csv -i input.json -f carModel,price,color -p

┌────────────────────┬───────────────┬───────────────┐
│ "carModel"         │ "price"       │ "color"       │
├────────────────────┼───────────────┼───────────────┤
│ "Audi"             │ 10000         │ "blue"        │
├────────────────────┼───────────────┼───────────────┤
│ "BMW"              │ 15000         │ "red"         │
├────────────────────┼───────────────┼───────────────┤
│ "Mercedes"         │ 20000         │ "yellow"      │
├────────────────────┼───────────────┼───────────────┤
│ "Porsche"          │ 30000         │ "green"       │
└────────────────────┴───────────────┴───────────────┘
```

#### Input file, data selection and output to file

```bash
$ json2csv -i input.json -f carModel,price,color -o out.csv

$ cat out.csv

carModel,price,color
"Audi",10000,"blue"
"BMW",15000,"red"
"Mercedes",20000,"yellow"
"Porsche",30000,"green"
```

Same result will be obtained passing the fields config as a file.

```bash
$ json2csv -i input.json -c config.json -o out.csv
```

where the file `config.json` contains

```json
{ "fields": ["carModel", "price", "color"] }
```

#### Input from stdin, data selection and output to stdout

```bash
$ json2csv -f price

[{"price":1000},{"price":2000}]
```

Hit <kbd>Enter</kbd> and afterwards <kbd>CTRL</kbd> + <kbd>D</kbd> to end reading from stdin. The terminal should show

```bash
price
1000
2000
```

#### Input file, data selection and output to file of multiple json files

Sometimes you want to add some additional rows with the same columns.
This is how you can do that.

```bash
# Initial creation of csv with headings
$ json2csv -i test.json -f name,version > test.csv
# Append additional rows
$ json2csv -i test2.json -f name,version --no-header >> test.csv
```

## Complete Documentation

See [https://juanjodiaz.github.io/json2csv/#/parsers/cli](https://juanjodiaz.github.io/json2csv/#/parsers/cli).

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
