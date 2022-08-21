# CLI

`@json2csv/cli` makes `json2csv` usable as a command line tool.

## Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `CLI` as a dependency using NPM.

It's advisable to install it as a global dependency so it can be called from anywhere.

```bash
$ npm install -g @json2csv/cli
```

### **Yarn**

You can install json2csv `CLI` using Yarn.

It's advisable to install it as a global dependency so it can be called from anywhere.

```bash
$ yarn global add @json2csv/cli
```

<!-- tabs:end -->

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
│ "carModel"             │ "price"          │ "color"          │
├────────────────────┼───────────────┼───────────────┤
│ "Audi"                 │ 10000            │ "blue"           │
├────────────────────┼───────────────┼───────────────┤
│ "BMW"                  │ 15000            │ "red"            │
├────────────────────┼───────────────┼───────────────┤
│ "Mercedes"             │ 20000            │ "yellow"         │
├────────────────────┼───────────────┼───────────────┤
│ "Porsche"              │ 30000            │ "green"          │
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
