# Formatters

A formatter is a function to convert javascript values into plain text before adding it into the CSV as a cell.
Supported formatter tare given by the types returned by `typeof`:
* `undefined`
* `boolean`
* `number`
* `bigint`
* `string`
* `symbol`
* `function`
* `object`
  
And a special type that only applies to headers:
* `headers`

Pay special attention to the `string` formatter since other formatters like the `headers` or `object` formatters, rely on the `string` formatter for the stringification of their value..

## Built-in formatters

There is a number of built-in formatters provided by this package.

### Installation

<!-- tabs:start -->

### **NPM**

You can install json2csv `formatters` as a dependency using NPM.

```bash
$ npm install --save @json2csv/formatters
```

```js
import {
  default as defaultFormatter,
  number as numberFormatter,
  string as stringFormatter,
  stringQuoteOnlyIfNecessary as stringQuoteOnlyIfNecessaryFormatter,
  stringExcel as stringExcelFormatter,
  symbol as symbolFormatter,
  object as objectFormatter,
} from '@json2csv/formatters';
```

### **Yarn**

You can install json2csv `formatters` as a dependency using Yarn.

```bash
$ yarn add --save @json2csv/formatters
```

```js
import {
  default as defaultFormatter,
  number as numberFormatter,
  string as stringFormatter,
  stringQuoteOnlyIfNecessary as stringQuoteOnlyIfNecessaryFormatter,
  stringExcel as stringExcelFormatter,
  symbol as symbolFormatter,
  object as objectFormatter,
} from '@json2csv/formatters';
```

### **CDN**

json2csv `formatters` are packaged as an ES6 modules.
If your browser supports modules, you can load json2csv `formatters` directly on the browser from the CDN.

You can import the latest version:

```html
<script type="module">
  import default from 'https://cdn.jsdelivr.net/npm/@json2csv/formatters';
</script>
```

You can also select a specific version:

```html
<script type="module">
  import default from 'https://cdn.jsdelivr.net/npm/@json2csv/formatters@7.0.6';
</script>
```

<!-- tabs:end -->

### Default

This formatter just relies on standard JavaScript stringification.
This is the default formatter for `undefined`, `boolean`, `number` and `bigint` elements.

It's not a factory but the formatter itself.

```js
{
  undefined: defaultFormatter,
  boolean: defaultFormatter,
  number: defaultFormatter,
  bigint: defaultFormatter,
}
```

### Number

Format numbers with a fixed amount of decimals

The formatter needs to be instantiated and takes an options object as arguments containing:

- `separator` - String, separator to use between integer and decimal digits. Defaults to `.`. It's crucial that the decimal separator is not the same character as the CSV delimiter or the result CSV will be incorrect.
- `decimals` - Number, amount of decimals to keep. Defaults to all the available decimals.

```js
{
  // 2 decimals
  number: numberFormatter(),

  // 3 decimals
  number: numberFormatter(3)
}
```

### String

Format strings quoting them and escaping illegal characters if needed.

The formatter needs to be instantiated and takes an options object as arguments containing:

- `quote` - String, quote around cell values and column names. Defaults to `"`.
- `escapedQuote` - String, the value to replace escaped quotes in strings. Defaults to double-quotes (for example `""`).

This is the default for `string` elements.

```js
{
  // Uses '"' as quote and '""' as escaped quote
  string: stringFormatter(),

  // Use single quotes `'` as quotes and `''` as escaped quote
  string: stringFormatter({ quote: '\'' }),

  // Never use quotes
  string: stringFormatter({ quote: '' }),

  // Use '\"' as escaped quotes
  string: stringFormatter({ escapedQuote: '\"' }),
}
```

### String Quote Only Necessary

The default string formatter quote all strings. This is consistent but it is not mandatory according to the CSV standard. This formatter only quote strings if they don't contain quotes (by default `"`), the CSV separator character (by default `,`) or the end-of-line (by default `\n` or `\r\n` depending on you operating system).

The formatter needs to be instantiated and takes an options object as arguments containing:

- `quote` - String, quote around cell values and column names. Defaults to `"`.
- `escapedQuote` - String, the value to replace escaped quotes in strings. Defaults to 2x`quotes` (for example `""`).
- `eol` - String, overrides the default OS line ending (i.e. `\n` on Unix and `\r\n` on Windows). Ensure that you use the same `eol` here as in the json2csv options.

```js
{
  // Uses '"' as quote, '""' as escaped quote and your OS eol
  string: stringQuoteOnlyIfNecessaryFormatter(),

  // Use single quotes `'` as quotes, `''` as escaped quote and your OS eol
  string: stringQuoteOnlyIfNecessaryFormatter({ quote: '\'' }),

  // Never use quotes
  string: stringQuoteOnlyIfNecessaryFormatter({ quote: '' }),

  // Use '\"' as escaped quotes
  string: stringQuoteOnlyIfNecessaryFormatter({ escapedQuote: '\"' }),

  // Use linux EOL regardless of your OS
  string: stringQuoteOnlyIfNecessaryFormatter({ eol: '\n' }),
}
```

### String Excel

Converts string data into normalized Excel style data after formatting it using the given string formatter.

The formatter needs to be instantiated and takes no arguments.

```js
{
  string: stringExcelFormatter,
}
```

### Symbol

Format the symbol as its string value and then use the given string formatter i.e. `Symbol('My Symbol')` is formatted as `"My Symbol"`.

The formatter needs to be instantiated and takes an options object as arguments containing:

- `stringFormatter` - String formatter to use to stringify the symbol name. Defaults to the built-in `stringFormatter`.

This is the default for `symbol` elements.

```js
{
  // Uses the default string formatter
  symbol: symbolFormatter(),

  // Uses custom string formatter
  // You rarely need to this since the symbol formatter will use the string formatter that you set.
  symbol: symbolFormatter(myStringFormatter()),
}
```

### Object

Format the object using `JSON.stringify` and then the given string formatter.
Some object types likes `Date` or Mongo's `ObjectId` are automatically quoted by `JSON.stringify`. This formatter, remove those quotes and uses the given string formatter for correct quoting and escaping.

The formatter needs to be instantiated and takes an options object as arguments containing:

- `stringFormatter` - tring formatter to use to stringify the symbol name. Defaults to our built-in `stringFormatter`.

This is the default for `function` and `object` elements. `function`'s are formatted as empty ``.

```js
{
  // Uses the default string formatter
  object: objectFormatter(),

  // Uses custom string formatter
  // You rarely need to this since the object formatter will use the string formatter that you set.
  object: objectFormatter(myStringFormatter()),
}
```


## Custom formatters

Users can create their own formatters as simple functions.

```js
function formatType(itemOfType) {
  // format type
  return formattedItem;
}
```

or using ES6

```js
const formatType = (itemOfType) => {
  // format type
  return itemOfType;
};
```

For example, let's format functions as their name or 'unknown'.

```js
const functionNameFormatter = (item) => item.name || 'unknown';
```

Then you can add `{ function: functionNameFormatter }` to the `formatters` object.

A less trivial example would be to ensure that string cells never take more than 20 characters.

```js
const fixedLengthStringFormatter = (stringLength, ellipsis = '...') =>
  (item) =>
    item.length <= stringLength
      ? item
      : `${item.slice(0, stringLength - ellipsis.length)}${ellipsis}`;
```

Then you can add `{ string: fixedLengthStringFormatter(20) }` to the `formatters` object.
Or `fixedLengthStringFormatter(20, '')` to not use the ellipsis and just clip the text.
As with the sample transform in the previous section, the reason to wrap the actual formatter in a factory function is so it can be parameterized easily.

Keep in mind that the above example doesn't quote or escape the string which is problematic. A more realistic example could use our built-in string formatted to do the quoting and escaping like:

```js
import { string as defaultStringFormatter } from '@json2csv/formatters';

const fixedLengthStringFormatter = (stringLength, ellipsis = '...', stringFormatter = defaultStringFormatter()) =>
  (item) =>
    item.length <= stringLength
      ? item
      : stringFormatter(`${item.slice(0, stringLength - ellipsis.length)}${ellipsis})`;
```

## How to use formatters

Formatters are configured in the `formatters` option when creating a parser.

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/plainjs';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';

try {
  const opts = {
    formatters: {
      number: numberFormatter({ decimals: 3, separator: ',' }),
      string: fixedLengthStringFormatter(20)
    }
  };
  const parser = new Parser(opts);
  const csv = parser.parse(myData);
  console.log(csv);
} catch (err) {
  console.error(err);
}
```

#### **Stream Parser**

```js
import { StreamParser } from '@json2csv/plainjs';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';


const opts = {
  formatters: {
    number: numberFormatter({ decimals: 3, separator: ',' }),
    string: fixedLengthStringFormatter(20)
  }
};
const parser = new StreamParser(opts);

let csv = '';
parser.onData = (chunk) => (csv += chunk.toString());
parser.onEnd = () => console.log(csv);
parser.onError = (err) => console.error(err);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser.onHeader = (header) => console.log(header);
parser.onLine = (line) => console.log(line);
```

#### **Node Transform**

```js
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from '@json2csv/ node';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';

const input = createReadStream(inputPath, { encoding: 'utf8' });
const output = createWriteStream(outputPath, { encoding: 'utf8' });
const opts = {
  formatters: {
    number: numberFormatter({ decimals: 3, separator: ',' }),
    string: fixedLengthStringFormatter(20)
  }
};
const parser = new Transform(ops);

const processor = input.pipe(parser).pipe(output);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .on('header', (header) => console.log(header))
  .on('line', (line) => console.log(line));
```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';

const opts = {
  formatters: {
    number: numberFormatter({ decimals: 3, separator: ',' }),
    string: fixedLengthStringFormatter(20)
  }
};
const parser = new AsyncParser(opts);

let csv = await parser.parse(data).promise();
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';

const opts = {
  formatters: {
    number: numberFormatter({ decimals: 3, separator: ',' }),
    string: fixedLengthStringFormatter(20)
  }
};
const parser = new TransformStream(opts);

await sourceStream.pipeThrough(parser).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

#### **WHATWG Async Parser**

```js
import { AsyncParser } from '@json2csv/whatwg';
import { number as numberFormatter } from '@json2csv/formatters';
import { fixedLengthStringFormatter } from './custom-formatters';

const opts = {
  formatters: {
    number: numberFormatter({ decimals: 3, separator: ',' }),
    string: fixedLengthStringFormatter(20)
  }
};
const parser = new AsyncParser(opts);

let csv = await parser.parse(data).promise();
```

#### **CLI**
At the moment, only some options of the `string` built-in formatters are supported by the CLI interface.

```bash
$ json2csv -i input.json --quote '"' --escaped-quote '\"'
```

or if you want to use the `String Excel` instead:

```bash
$ json2csv -i input.json --excel-strings
``` 

<!-- tabs:end -->
