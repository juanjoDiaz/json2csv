
# @json2csv/transforms

[![npm version](https://badge.fury.io/js/@json2csv%2Ftransforms.svg)](https://badge.fury.io/js/@json2csv%2Ftransforms)
[![npm monthly downloads](https://img.shields.io/npm/dm/@json2csv/transforms.svg)](https://badge.fury.io/js/@json2csv%2Ftransforms)
[![Node.js CI](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml/badge.svg)](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml)
[![Coverage Status](https://coveralls.io/repos/github/juanjoDiaz/json2csv/badge.svg?branch=main)](https://coveralls.io/github/juanjoDiaz/json2csv?branch=main)
[![license](https://img.shields.io/npm/l/@json2csv/plainjs)](https://raw.githubusercontent.com/juanjoDiaz/json2csv/main/LICENSE.md)

A transform is a function to preprocess data before it is converted into CSV by `json2csv` (in any of its flavours).
Each transform receives each data record, performs some processing and returns a transformed record.

### json2csv ecosystem

There are multiple flavours of json2csv where you can use transforms:

* **[Plainjs](https://www.npmjs.com/package/@json2csv/plainjs):** Includes the `Parser` API and a new `StreamParser` API which doesn't the conversion in a streaming fashion in pure js.
* **[Node](https://www.npmjs.com/package/@json2csv/node):** Includes the `Node Transform` and `Node Async Parser` APIs for Node users.
* **[WHATWG](https://www.npmjs.com/package/@json2csv/whatwg):** Includes the `WHATWG Transform Stream` and `WHATWG Async Parser` APIs for users of WHATWG streams (browser, Node or Deno).
* **[CLI](https://www.npmjs.com/package/@json2csv/cli):** Includes the `CLI` interface.

## Built-in transforms

There is a number of built-in transform provided by this package.

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

###### Programmatic APIs

```js
import { Parser } from '@json2csv/plainjs';
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

###### CLI
At the moment, only built-in transforms are supported by the CLI interface.

```bash
$ json2csv -i data.json --unwind "color"
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

### Programmatic APIs

```js
import { Parser } from '@json2csv/plainjs';
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

### CLI
At the moment, only built-in transforms are supported by the CLI interface.

```bash
$ json2csv -i input.json \
  --unwind "fieldToUnwind","fieldToUnwind.subfieldToUnwind" \
  --unwind-blank \
  --flatten-objects \
  --flatten-arrays \
  --flatten-separator "_"
```

### Complete Documentation

See [https://juanjodiaz.github.io/json2csv/#/advanced-options/transforms](https://juanjodiaz.github.io/json2csv/#/advanced-options/transforms).

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
