
# Stream Parser

The synchronous API has the downside of loading the entire JSON array in memory and blocking JavaScript's event loop while processing the data. This means that your server won't be able to process more request or your UI will become irresponsive while data is being processed. For those reasons, it is rarely a good reason to use it unless your data is very small or your application doesn't do anything else.

`StreamParser` processes the data as a it comes in so you don't need the entire input data set loaded in memory and you can avoid blocking the event loop for too long. Thus, it's better suited for large datasets or system with high concurrency.

The streaming API takes a second options argument to configure `objectMode` and `ndjson` mode. These options also support fine-tunning the underlying [JSON parser](https://github.com/juanjoDiaz/streamparser-json).

The streaming API support multiple callbacks to get the resulting CSV, errors, etc.

## Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `StreamParser` as a dependency using NPM.

```bash
$ npm install --save @json2csv/plainjs
```

### **Yarn**

You can install json2csv `StreamParser` as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/plainjs
```

### **CDN**

json2csv `StreamParser` is packaged as an ES6 modules.
If your browser supports modules, you can load json2csv `StreamParser` directly on the browser from the CDN.

You can import the latest version:

```html
<script type="module">
  import Parser from 'https://cdn.jsdelivr.net/npm/@json2csv/plainjs';
</script>
```

You can also select a specific version:

```html
<script type="module">
  import Parser from 'https://cdn.jsdelivr.net/npm/@json2csv/plainjs@7.0.1';
</script>
```

<!-- tabs:end -->

## Usage

```js
import { StreamParser } from '@json2csv/plainjs';

const opts = {};
const asyncOpts = {};
const parser = new StreamParser(opts, asyncOpts);

let csv = '';
parser.onData = (chunk) => (csv += chunk.toString());
parser.onEnd = () => console.log(csv);
parser.onError = (err) => console.error(err);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser.onHeader = (header) => console.log(header);
parser.onLine = (line) => console.log(line);
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
