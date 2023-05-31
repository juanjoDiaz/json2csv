# WHATWG Async Parser

To facilitate usage, `WHATWGAsyncParser` wraps `WHATWGTransformStream` exposing a single `parse` method similar to the sync API. This method accepts JSON arrays/objects, TypedArrays, strings and readable streams as input and returns a stream that produces the CSV.

`WHATWGAsyncParser` also exposes a convenience `promise` method which turns the stream into a promise that resolves to the whole CSV.

## Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `WHATWGAsyncParser` as a dependency using NPM.

```bash
$ npm install --save @json2csv/whatwg
```

### **Yarn**

You can install json2csv `WHATWGAsyncParser` as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/whatwg
```

### **CDN**

json2csv `WHATWGAsyncParser` is packaged as an ES6 modules.
If your browser supports modules, you can load json2csv `WHATWGAsyncParser` directly on the browser from the CDN.

You can import the latest version:

```html
<script type="module">
  import Parser from 'https://cdn.jsdelivr.net/npm/@json2csv';
</script>
```

You can also select a specific version:

```html
<script type="module">
  import Parser from 'https://cdn.jsdelivr.net/npm/@json2csv/whatwg@7.0.1';
</script>
```

<!-- tabs:end -->

## Usage

```js
import { AsyncParser } from '@json2csv/whatwg';

const opts = {};
const transformOpts = {};
const asyncOpts = {};
const parser = new AsyncParser(opts, transformOpts, asyncOpts);

const csv = await parser.parse(data).promise();

// The parse method return the stream transform readable side.
// So data can be passed to a writable stream (a file, http request, etc.)
parser.parse(data).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

### Parameters

#### Options

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

#### Async Options

Options used by the underlying parsing library to process the binary or text stream.
Not relevant when running in `objectMode`.
Buffering is only relevant if you expect very large strings/numbers in your JSON.
See [@streamparser/json](https://github.com/juanjoDiaz/streamparser-json#buffering) for more details about buffering.

* `stringBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse strings. Defaults to 0 which means to don't buffer. Min valid value is 4.
* `numberBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse numbers. Defaults to 0 to don't buffer.

#### Writable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Writable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#writablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.

#### Readable Strategy

An object that optionally defines a queuing strategy for the stream.
See [Readable Strategy in MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#readablestrategy) for more details.

* `highWaterMark` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) A non-negative integer. This defines the total number of chunks that can be contained in the internal queue before backpressure is applied.
* `size` [(chunk) => {}]() A method containing a parameter chunk. This indicates the size to use for each chunk, in bytes.
