
# Transforms

A transform is a function to preprocess data before it is converted into CSV.
Each transformer receives each data record, performs some processing and returns a transformed record.

## Built-in transforms

There is a number of built-in transform provider by the library.

```js
import { unwind, flatten } from '@json2csv/transforms';
```

### Unwind

The `unwind` transform deconstructs an array field from the input item to output a row for each element. It's similar to MongoDB's \$unwind aggregation.

The transform needs to be instantiated and takes an options object as arguments containing:

* `paths` [&lt;String[]&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) List of the paths to the fields to be unwound. It's mandatory and should not be empty.
* `blankOut` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Flag indicating whether to unwind using blank values instead of repeating data or not. Defaults to `false`.


#### Examples

##### Simple unwind

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/parsers';
import { unwind } from '@json2csv/transforms';

const data = [
  { "carModel": "Audi", "price": 0, "colors": ["blue","green","yellow"] },
  { "carModel": "BMW", "price": 15000, "colors": ["red","blue"] },
  { "carModel": "Mercedes", "price": 20000, "colors": "yellow" },
  { "carModel": "Porsche", "price": 30000, "colors": ["green","teal","aqua"] },
  { "carModel": "Tesla", "price": 50000, "colors": []}
];

try {
  const opts = {
    transforms: [
      unwind({ paths: ['colors'] })
    ]
  };
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  console.log(csv);
} catch (err) {
  console.error(err);
}
```

#### **Stream Parser**

```js
import { StreamParser } from '@json2csv/parsers';
import { unwind } from '@json2csv/transforms';

const data = [
  { "carModel": "Audi", "price": 0, "colors": ["blue","green","yellow"] },
  { "carModel": "BMW", "price": 15000, "colors": ["red","blue"] },
  { "carModel": "Mercedes", "price": 20000, "colors": "yellow" },
  { "carModel": "Porsche", "price": 30000, "colors": ["green","teal","aqua"] },
  { "carModel": "Tesla", "price": 50000, "colors": []}
];

const opts = {
  transforms: [
    unwind({ paths: ['colors'] })
  ]
};
const parser = new StreamParser(opts, { objectMode: true });

let csv = '';
parser.onData = (chunk) => (csv += chunk.toString()));
parser.onEnd = () => console.log(csv));
parser.onError = (err) => console.error(err));

data.forEach(record => parser.push(record));
```

#### **Node Transform**

```js
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from '@json2csv/node';
import { unwind } from '@json2csv/transforms';

const data = [
  { "carModel": "Audi", "price": 0, "colors": ["blue","green","yellow"] },
  { "carModel": "BMW", "price": 15000, "colors": ["red","blue"] },
  { "carModel": "Mercedes", "price": 20000, "colors": "yellow" },
  { "carModel": "Porsche", "price": 30000, "colors": ["green","teal","aqua"] },
  { "carModel": "Tesla", "price": 50000, "colors": []}
];

const input = createReadStream(inputPath, { encoding: 'utf8' });
const output = createWriteStream(outputPath, { encoding: 'utf8' });
const opts = {
  transforms: [
    unwind({ paths: ['colors'] })
  ]
};
const parser = new Transform(ops);

const processor = input.pipe(parser).pipe(output);

```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';
import { unwind } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

const opts = {
  transforms: [
    unwind({ paths: ['colors'] })
  ]
};
const parser = new AsyncParser(opts);

let csv = await parser.parse(data).promise();
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';
import { unwind } from '@json2csv/transforms';

const opts = {
  transforms: [
    unwind({ paths: ['colors'] })
  ]
};
const parser = new TransformStream(opts);

await sourceStream.pipeThrough(parser).pipeTo(writableStream);
```

#### **CLI**
At the moment, only built-in transforms are supported by the CLI interface.

```bash
$ json2csv -i data.json --unwind "color"
```

<!-- tabs:end -->

```js
// Unwind a single field
unwind({ paths: ['fieldToUnwind'] });

// Unwind a single field and blank out repeated data
unwind({ paths: ['fieldToUnwind'], blankOut: true });
```

### Flatten

Flatten nested JavaScript objects into a single level object.

The transform needs to be instantiated and takes an options object as arguments containing:

* `objects` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Flag indicating whether to flatten JSON objects or not. Defaults to `true`.
* `arrays`[&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Flag indicating whether to flatten Arrays or not. Defaults to `false`.
* `separator` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) Separator to use between the keys of the nested JSON properties being flattened. Defaults to `.`.

```js
// Default
flatten();

// Custom separator '__'
flatten({ separator: '_' });

// Flatten only arrays
flatten({ objects: false, arrays: true });
```

## Custom transforms

Users can create their own transforms as simple functions.

```js
function doNothing(item) {
  // apply tranformations or create new object
  return transformedItem;
}
```

or using ES6

```js
const doNothing = (item) => {
  // apply tranformations or create new object
  return transformedItem;
};
```

For example, let's add a line counter to our CSV, capitalize the car field and change the price to be in Ks (1000s).

```js
function addCounter() {
  let counter = 1;
  return (item) => ({
    counter: counter++,
    ...item,
    car: item.car.toUpperCase(),
    price: item.price / 1000,
  });
}
```

The reason to wrap the actual transform in a factory function is so the counter always starts from one and you can reuse it. But it's not strictly necessary.

## How to use transforms

Transforms are added to the `transforms` option when creating a parser.
They are applied in the order in which they are declared.

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/parsers';
import { unwind, flatten } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

try {
  const opts = {
    transforms: [
      unwind({ paths: ['fieldToUnwind','fieldToUnwind.subfieldToUnwind'], blankOut: true }),
      flatten({ object: true, array: true, separator: '_'}),
      addCounter()
    ]
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
import { StreamParser } from '@json2csv/parsers';
import { unwind, flatten } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

const opts = {
  transforms: [
    unwind({ paths: ['fieldToUnwind','fieldToUnwind.subfieldToUnwind'], blankOut: true }),
    flatten({ object: true, array: true, separator: '_'}),
    addCounter()
  ]
};
const parser = new StreamParser(opts);

let csv = '';
parser.onData = (chunk) => (csv += chunk.toString()));
parser.onEnd = () => console.log(csv));
parser.onError = (err) => console.error(err));

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser.onHeader = (header) => console.log(header));
parser.onLine = (line) => console.log(line));
```

#### **Node Transform**

```js
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from '@json2csv/node';
import { unwind, flatten } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

const input = createReadStream(inputPath, { encoding: 'utf8' });
const output = createWriteStream(outputPath, { encoding: 'utf8' });
const opts = {
  transforms: [
    unwind({ paths: ['fieldToUnwind','fieldToUnwind.subfieldToUnwind'], blankOut: true }),
    flatten({ object: true, array: true, separator: '_'}),
    addCounter()
  ]
};
const parser = new Transform(ops);

const processor = input.pipe(parser).pipe(output);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
json2csv
  .on('header', (header) => console.log(header))
  .on('line', (line) => console.log(line));
```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';
import { unwind, flatten } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

const opts = {
  transforms: [
    unwind({ paths: ['fieldToUnwind','fieldToUnwind.subfieldToUnwind'], blankOut: true }),
    flatten({ object: true, array: true, separator: '_'}),
    addCounter()
  ]
};
const parser = new AsyncParser(opts);

let csv = await parser.parse(data).promise();
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';
import { unwind, flatten } from '@json2csv/transforms';
import { addCounter } from './custom-transforms';

const opts = {
  transforms: [
    unwind({ paths: ['fieldToUnwind','fieldToUnwind.subfieldToUnwind'], blankOut: true }),
    flatten({ object: true, array: true, separator: '_'}),
    addCounter()
  ]
};
const parser = new TransformStream(opts);

await sourceStream.pipeThrough(parser).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

#### **CLI**
At the moment, only built-in transforms are supported by the CLI interface.

```bash
$ json2csv -i input.json \
  --unwind "fieldToUnwind","fieldToUnwind.subfieldToUnwind" \
  --unwind-blank \
  --flatten-objects \
  --flatten-arrays \
  --flatten-separator "_"
```

<!-- tabs:end -->
