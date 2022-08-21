# @json2csv/whatwg

[![npm version](https://badge.fury.io/js/json2csv.svg)](http://badge.fury.io/js/json2csv)
[![Node.js CI](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml/badge.svg)](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml)
[![Coverage Status](https://coveralls.io/repos/github/juanjoDiaz/json2csv/badge.svg?branch=main)](https://coveralls.io/github/juanjoDiaz/json2csv?branch=main)

Fast and highly configurable JSON to CSV converter.
It fully support conversion following the [RFC4180](https://datatracker.ietf.org/doc/html/rfc4180) specification as well as other similar text delimited formats as TSV.

`@json2csv/whatwg` exposes two modules to integrate `json2csv` with the WHATWG Stream API for stream processing of JSON data.

## Requirements

- None

## Features

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

## Installation

### **NPM**

You can install json2csv as a dependency using NPM.

```bash
$ npm install --save @json2csv/whatwg
```

### **Yarn**

You can install json2csv as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/whatwg
```

### **CDN**

json2csv WHATWG modules are packaged as ES6 modules.
If your browser supports modules, you can load json2csv WHATWG modules directly on the browser from the CDN.

You can import the latest version:

```html
<script type="module">
  import AsyncParser from 'https://cdn.jsdelivr.net/npm/@json2csv/whatwg/src/AsyncParser.js';
  import TransformStream from 'https://cdn.jsdelivr.net/npm/@json2csv/whatwg/src/TransformStream.js';
</script>
```

You can also select a specific version:

```html
<script type="module">
  import AsyncParser from 'https://cdn.jsdelivr.net/npm/@json2csv/whatwg@6.0.0/src/AsyncParser.js';
  import TransformStream from 'https://cdn.jsdelivr.net/npm/@json2csv/whatwg@6.0.0/src/TransformStream.js';
</script>
```

## WHATWG Transform Stream

For browser users, the Streaming API is wrapped in a WHATWG Transform Stream. This approach ensures a consistent memory footprint and avoids blocking JavaScript's event loop.

The async API takes a second options arguments that is directly passed to the underlying streams accepts the same options as the `Stream Parser`. It also support a third and fourth options equivalent to the `writableStrategy` and 
`readableStrategy` of a [WHATWG Transform Stream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream) respectively.

This Transform uses the `StreamParser` under the hood and support similar events.

### Usage

```js
import { TransformStream } from '@json2csv/whatwg';

const opts = {};
const asyncOpts = {};
const writableStrategy = {};
const readableStrategy = {};
const parser = new TransformStream(opts, asyncOpts, writableStrategy, readableStrategy);

const response = await fetch('./my-file.json');

await response.body.pipeThrough(parser).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

#### Parameters

##### Options

* `ndjson` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) indicates that the data is in NDJSON format. Only effective when using the streaming API and not in object mode.
* `fields` [&lt;DataSelector[]&gt;](advanced-options/data-selection.md)) Defaults to toplevel JSON attributes.
* `transforms` [&lt;Transform[]&gt;](advanced-options/transforms.md) Array of transforms to apply to the data. A transform is a function that receives a data recod and returns a transformed record. Transforms are executed in order.
* `formatters` [&lt;Formatters&gt;](advanced-options/formatters.md) Object where the each key is a Javascript data type and its associated value is a formatters for the given type.
* `defaultValue` [&lt;Any&gt;]() value to use when missing data. Defaults to `<empty>` if not specified. (Overridden by `fields[].default`)
* `delimiter` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  delimiter of columns. Defaults to `,` if not specified.
* `eol` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  overrides the default OS line ending (i.e. `\n` on Unix and `\r\n` on Windows).
* `header` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  determines whether or not CSV file will contain a title column. Defaults to `true` if not specified.
* `includeEmptyRows` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) includes empty rows. Defaults to `false`.
* `withBOM` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) with BOM character. Defaults to `false`.

##### Async Options

Options used by the underlying parsing library to process the binary or text stream.
Not relevant when running in `objectMode`.
Buffering is only relevant if you expect very large strings/numbers in your JSON.
See [@streamparser/json](https://github.com/juanjoDiaz/streamparser-json#buffering) for more details about buffering.

* `stringBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse strings. Defaults to 0 which means to don't buffer. Min valid value is 4.
* `numberBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse numbers. Defaults to 0 to don't buffer.

##### Writable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Writable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#writablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.

##### Readable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Readable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#readablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.

### Complete Documentation

See [https://juanjodiaz.github.io/json2csv/#/parsers/whatwg-transform-stream](https://juanjodiaz.github.io/json2csv/#/parsers/whatwg-transform-stream).

## WHATWG Async Parser

To facilitate usage, `WHATWGAsyncParser` wraps `WHATWGTransformStream` exposing a single `parse` method similar to the sync API. This method accepts JSON arrays/objects, TypedArrays, strings and readable streams as input and returns a stream that produces the CSV.

`WHATWGAsyncParser` also exposes a convenience `promise` method which turns the stream into a promise that resolves to the whole CSV.

### Usage

```js
import { TransformStream } from '@json2csv/whatwg';

const opts = {};
const asyncOpts = {};
const writableStrategy = {};
const readableStrategy = {};
const parser = new TransformStream(opts, asyncOpts, writableStrategy, readableStrategy);

const response = await fetch('./my-file.json');

await response.body.pipeThrough(parser).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

#### Parameters

##### Options

* `ndjson` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) indicates that the data is in NDJSON format. Only effective when using the streaming API and not in object mode.
* `fields` [&lt;DataSelector[]&gt;](advanced-options/data-selection.md)) Defaults to toplevel JSON attributes.
* `transforms` [&lt;Transform[]&gt;](advanced-options/transforms.md) Array of transforms to apply to the data. A transform is a function that receives a data recod and returns a transformed record. Transforms are executed in order.
* `formatters` [&lt;Formatters&gt;](advanced-options/formatters.md) Object where the each key is a Javascript data type and its associated value is a formatters for the given type.
* `defaultValue` [&lt;Any&gt;]() value to use when missing data. Defaults to `<empty>` if not specified. (Overridden by `fields[].default`)
* `delimiter` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  delimiter of columns. Defaults to `,` if not specified.
* `eol` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  overrides the default OS line ending (i.e. `\n` on Unix and `\r\n` on Windows).
* `header` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  determines whether or not CSV file will contain a title column. Defaults to `true` if not specified.
* `includeEmptyRows` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) includes empty rows. Defaults to `false`.
* `withBOM` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) with BOM character. Defaults to `false`.

##### Async Options

Options used by the underlying parsing library to process the binary or text stream.
Not relevant when running in `objectMode`.
Buffering is only relevant if you expect very large strings/numbers in your JSON.
See [@streamparser/json](https://github.com/juanjoDiaz/streamparser-json#buffering) for more details about buffering.

* `stringBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse strings. Defaults to 0 which means to don't buffer. Min valid value is 4.
* `numberBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse numbers. Defaults to 0 to don't buffer.

##### Writable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Writable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#writablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.

##### Readable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Readable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#readablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.

### Complete Documentation

See [https://juanjodiaz.github.io/json2csv/#/parsers/whatwg-async-parser](https://juanjodiaz.github.io/json2csv/#/parsers/whatwg-async-parser).

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
