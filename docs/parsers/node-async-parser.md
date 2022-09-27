
# Node Async Parser

To facilitate usage, `NodeAsyncParser` wraps `NodeTransform` exposing a single `parse` method similar to the sync API. This method accepts JSON arrays/objects, TypedArrays, strings and readable streams as input and returns a stream that produces the CSV.

`NodeAsyncParser` also exposes a convenience `promise` method which turns the stream into a promise that resolves to the whole CSV.

## Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `NodeAsyncParser` as a dependency using NPM.

```bash
$ npm install --save @json2csv/node
```

### **Yarn**

You can install json2csv `NodeAsyncParser` as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/node
```

<!-- tabs:end -->

## Usage

```js
import { AsyncParser } from '@json2csv/node';

const opts = {};
const transformOpts = {};
const asyncOpts = {};
const parser = new AsyncParser(opts, transformOpts, asyncOpts);

const csv = await parser.parse(data).promise();

// The parse method return the transform stream.
// So data can be passed to a writable stream (a file, http request, etc.)
parser.parse(data).pipe(writableStream);
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

#### Transform Options

See the [Duplex stream options](https://nodejs.org/api/stream.html#new-streamduplexoptions) for more details.

#### Async Options

Options used by the underlying parsing library to process the binary or text stream.
Not relevant when running in `objectMode`.
Buffering is only relevant if you expect very large strings/numbers in your JSON.
See [@streamparser/json](https://github.com/juanjoDiaz/streamparser-json#buffering) for more details about buffering.

* `stringBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse strings. Defaults to 0 which means to don't buffer. Min valid value is 4.
* `numberBufferSize` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) Size of the buffer used to parse numbers. Defaults to 0 to don't buffer.