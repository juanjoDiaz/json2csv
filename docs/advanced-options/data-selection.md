# Data Selection

By default, all top level fields in the input JSON are mapped to CSV columns.

One very important difference between the synchronous and the streaming APIs is that the latter processed JSON objects one by one. In practice, this means that only the fields in the first object of the array are automatically detected and other fields are just ignored. To avoid this, it's advisable to ensure that all the objects contain exactly the same fields or provide the list of fields using the `fields` option when using a streaming API.

The fields option is an array representing all the columns that will result in the CSV.

```js
{
  fields: [
    // Supports a simple field path
    'simplepath', // equivalent to { value: 'simplepath' }
    'path.to.value', // also equivalent to { value: 'path.to.value' }

    // Supports a field path with an optional a label and a default value
    {
      label: 'some label', // (Optional, column will be labeled 'path.to.something' if not defined)
      value: 'path.to.value', // data.path.to.something
      default: 'NULL' // default if value is not found (Optional, overrides `defaultValue` for column)
    },

    // Supports a field getter
    {
      value: (row) => row.arrayField.join(',')
    },

    // Supports a field getter with an optional label and a default value
    {
      label: 'some label', // (Optional, column will be labeled with the function name or empty if the function is anonymous)
      value: (row, field) => row[field.label].toLowerCase() || field.default, // Getter function
      default: 'NULL' // default if value is not found (Optional, overrides `defaultValue` for column)
    }
  ]
}
```

## Examples


### Automatic data selection

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const json2csvParser = new Parser();
const csv = json2csvParser.parse(data);

console.log(csv);
```

#### **Stream Parser**

```js
import { StreamParser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {};
const asyncOpts = { objectMode: true };

const json2csvParser = new StreamParser(opts, asyncOpts);

const csv = '';
json2csvParser.onData = (data) => console.log(csv);
json2csvParser.onError = (err) => console.error(err);
json2csvParser.onEnd = () => console.log(csv);

data.forEach(record => json2csvParser.write(record));
```

#### **Node Transform**

```js
import { Readable } from 'stream';
import { Transform } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = Readable.from(data);

const json2csvParser = new Transform();

const csv = '';
dataStream
  .pipe(json2csvParser)
  .on('data', chunk => (csv += chunk.toString()))
  .on('end', () => console.log(csv))
  .on('error', err => console.error(err));
```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const json2csvParser = new AsyncParser();
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = new ReadableStream({
  start(controller) {
    data.forEach(record => controller.enqueue(record));
    controller.close();
  }
});

const json2csvParser = new TransformStream();

let csv = '';
const toTextStream = new WritableStream({
  write(chunk) {
    csv += chunk;
  }
});

await dataStream.pipeThrough(datajson2csvParserStream).pipeTo(toTextStream);

console.log(csv);
```

#### **WHATWG Async Parser**

```js
import { AsyncParser } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const json2csvParser = new AsyncParser();
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **CLI**

```bash
$ json2csv -i data.json -f carModel,color
```

<!-- tabs:end -->


### Simple data selection

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: ['carModel', 'color']
};

const json2csvParser = new Parser(opts);
const csv = json2csvParser.parse(data);

console.log(csv);
```

#### **Stream Parser**

```js
import { StreamParser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: ['carModel', 'color']
};

const asyncOpts = { objectMode: true };

const json2csvParser = new StreamParser(opts, asyncOpts);

const csv = '';
json2csvParser.onData = (data) => console.log(csv);
json2csvParser.onError = (err) => console.error(err);
json2csvParser.onEnd = () => console.log(csv);

data.forEach(record => json2csvParser.write(record));
```

#### **Node Transform**

```js
import { Readable } from 'stream';
import { Transform } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = Readable.from(data);

const opts = {
  fields: ['carModel', 'color']
};

const json2csvParser = new Transform(opts);

const csv = '';
dataStream
  .pipe(json2csvParser)
  .on('data', chunk => (csv += chunk.toString()))
  .on('end', () => console.log(csv))
  .on('error', err => console.error(err));
```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: ['carModel', 'color']
};

const json2csvParser = new AsyncParser(opts);
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = new ReadableStream({
  start(controller) {
    data.forEach(record => controller.enqueue(record));
    controller.close();
  }
});

const opts = {
  fields: ['carModel', 'color']
};

const json2csvParser = new TransformStream(opts);

let csv = '';
const toTextStream = new WritableStream({
  write(chunk) {
    csv += chunk;
  }
});

await dataStream.pipeThrough(datajson2csvParserStream).pipeTo(toTextStream);

console.log(csv);
```

#### **WHATWG Async Parser**

```js
import { AsyncParser } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: ['carModel', 'color']
};

const json2csvParser = new AsyncParser(opts);
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **CLI**

```bash
$ json2csv -i data.json -f carModel,color
```

<!-- tabs:end -->

### Advance data selection

<!-- tabs:start -->

#### **Parser**

```js
import { Parser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const json2csvParser = new Parser(opts);
const csv = json2csvParser.parse(data);

console.log(csv);
```

#### **Stream Parser**

```js
import { StreamParser } from '@json2csv/plainjs';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const asyncOpts = { objectMode: true };

const json2csvParser = new StreamParser(opts, asyncOpts);

const csv = '';
json2csvParser.onData = (data) => console.log(csv);
json2csvParser.onError = (err) => console.error(err);
json2csvParser.onEnd = () => console.log(csv);

data.forEach(record => json2csvParser.write(record));
```

#### **Node Transform**

```js
import { Readable } from 'stream';
import { Transform } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = Readable.from(data);

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const json2csvParser = new Transform(opts);

const csv = '';
dataStream
  .pipe(json2csvParser)
  .on('data', chunk => (csv += chunk.toString()))
  .on('end', () => console.log(csv))
  .on('error', err => console.error(err));
```

#### **Node Async Parser**

```js
import { AsyncParser } from '@json2csv/node';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const json2csvParser = new AsyncParser(opts);
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **WHATWG Transform Stream**

```js
import { TransformStream } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const dataStream = new ReadableStream({
  start(controller) {
    data.forEach(record => controller.enqueue(record));
    controller.close();
  }
});

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const json2csvParser = new TransformStream(opts);

let csv = '';
const toTextStream = new WritableStream({
  write(chunk) {
    csv += chunk;
  }
});

await dataStream.pipeThrough(datajson2csvParserStream).pipeTo(toTextStream);

console.log(csv);
```

#### **WHATWG Async Parser**

```js
import { AsyncParser } from '@json2csv/whatwg';

const data = [
  { "carModel": "Audi", "price": 0, "color": "blue" },
  { "carModel": "BMW", "price": 15000, "color": "red", "manual": true },
  { "carModel": "Mercedes", "price": 20000, "color": "yellow" },
  { "carModel": "Porsche", "price": 30000, "color": "green" }
];

const opts = {
  fields: [
    {
      label: 'Car Model',
      value: 'carModel'
    },
    {
      label: 'Price',
      value: (record) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(record.price)
    },
    {
      label: 'Color',
      value: 'color'
    },
    {
      label: 'Manual',
      value: 'manual',
      default: false
    }
  ]
};

const json2csvParser = new AsyncParser(opts);
const csv = await json2csvParser.parse(data).promise();

console.log(csv);
```

#### **CLI**

Complex data selection can only be achieved in the CLI using the `-c` option and passing the fields in the config file.

<!-- tabs:end -->
