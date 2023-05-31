
# Parser

`json2csv` can be used programmatically as a synchronous converter.

This loads the entire JSON in memory and do the whole processing in-memory while blocking Javascript event loop. For that reason is rarely a good reason to use it until your data is very small or your application doesn't do anything else.

## Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `parser` as a dependency using NPM.

```bash
$ npm install --save @json2csv/plainjs
```

### **Yarn**

You can install json2csv `parser` as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/plainjs
```

### **CDN**

json2csv `parser` is packaged as an ES6 modules.
If your browser supports modules, you can load json2csv `parser` directly on the browser from the CDN.

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
import { Parser } from '@json2csv/plainjs';

try {
  const opts = {};
  const parser = new Parser(opts);
  const csv = parser.parse(myData);
  console.log(csv);
} catch (err) {
  console.error(err);
}
```

### Parameters

#### Options

* `fields` [&lt;DataSelector[]&gt;](advanced-options/data-selection.md)) Defaults to toplevel JSON attributes. See 
* `transforms` [&lt;Transform[]&gt;](advanced-options/transforms.md) Array of transforms to apply to the data. A transform is a function that receives a data recod and returns a transformed record. Transforms are executed in order.
* `formatters` [&lt;Formatters&gt;](advanced-options/formatters.md) Object where the each key is a Javascript data type and its associated value is a formatters for the given type.
* `defaultValue` [&lt;Any&gt;]() value to use when missing data. Defaults to `<empty>` if not specified. (Overridden by `fields[].default`)
* `delimiter` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  delimiter of columns. Defaults to `,` if not specified.
* `eol` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  overrides the default OS line ending (i.e. `\n` on Unix and `\r\n` on Windows).
* `header` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  determines whether or not CSV file will contain a title column. Defaults to `true` if not specified.
* `includeEmptyRows` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  includes empty rows. Defaults to `false`.
* `withBOM` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  with BOM character. Defaults to `false`.
