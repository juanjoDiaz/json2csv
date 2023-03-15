# Quick start

## Types of JSON2CSV parsers

json2csv parsers are offered in various flavours:

* **[Parser](parsers/parser.md):** Pure Javascript synchronous parser. High-performant and runs both node.js and the browser. It´s the fastest but loads both the JSON and the resulting CSV in memory, and block the event loop while processing. Not recommended unless the JSON data is small.
* **[Stream Parser](parsers/stream-parser.md):** Pure Javascript stream parser. High-performant and runs both node.js and the browser. It keeps a consistent memory footprint and doesn't block the event loop. It's the base of all other parsers. Recommended to build your own parser.
* **[Node Transform](parsers/node-transform.md):** Wraps the `Stream Parser` in a Node.js Transform Stream. Recommended for Node.js users using stream.
* **[Node Async Parser](parsers/node-async-parser.md):** Wraps the `Node Transform` to offer a friendly promise-based API similar to the synchronous `Parser`. Recommended for Node.js users that want a higher abstraction level.
* **[WHATWG Transform Stream](parsers/whatwg-transform-stream.md):** Wraps the `Stream Parser` in a WHATWG Transform Stream. Recommended for browser users using web streams.
* **[WHATWG Async Parser](parsers/whatwg-async-parser.md):** Wraps the `WHATWG Transform Stream` to offer a friendly promise-based API similar to the synchronous `Parser`. Recommended for browser users that want a higher abstraction level.
* **[CLI](parsers/cli.md):** Makes the node.js interfaces accesible through the command line. Recommended from CLI (sh/bash/zsh/...) users and CLI scripts.

## Basic usage

Out of the box, json2csv will infer the fields from the data and parse all your data with the default settings. 

<!-- tabs:start -->

#### **Parser**

`json2csv` can be used programmatically as a synchronous converter.

This loads the entire JSON in memory and do the whole processing in-memory while blocking Javascript event loop. For that reason is rarely a good reason to use it until your data is very small or your application doesn't do anything else.

#### Installation

```bash
$ npm install --save @json2csv/plainjs
```

#### Usage

```js
import { Parser } from '@json2csv/plainjs';

try {
  const parser = new Parser();
  const csv = parser.parse(myData);
  console.log(csv);
} catch (err) {
  console.error(err);
}
```

#### **Stream Parser**

The synchronous API has the downside of loading the entire JSON array in memory and blocking JavaScript's event loop while processing the data. This means that your server won't be able to process more request or your UI will become irresponsive while data is being processed. For those reasons, it is rarely a good reason to use it unless your data is very small or your application doesn't do anything else.

The async parser processes the data as a it comes in so you don't need the entire input data set loaded in memory and you can avoid blocking the event loop for too long. Thus, it's better suited for large datasets or system with high concurrency.

The streaming API takes a second options argument to configure `objectMode` and `ndjson` mode. These options also support fine-tunning the underlying [JSON parser](https://github.com/juanjoDiaz/streamparser-json).

The streaming API support multiple callbacks to get the resulting CSV, errors, etc.

#### Installation

```bash
$ npm install --save @json2csv/plainjs
```

#### Usage

```js
import { StreamParser } from '@json2csv/plainjs';

const parser = new StreamParser();

let csv = '';
parser.onData = (chunk) => (csv += chunk.toString());
parser.onEnd = () => console.log(csv);
parser.onError = (err) => console.error(err);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser.onHeader = (header) => console.log(header);
parser.onLine = (line) => console.log(line);
```

#### **Node Transform**

For Node.js users, the Streaming API is wrapped in a Node.js Stream Transform. This approach ensures a consistent memory footprint and avoids blocking JavaScript's event loop.

The async API takes a second options arguments that is directly passed to the underlying streams and accepts the same options as the standard [Node.js streams](https://nodejs.org/api/stream.html#stream_new_stream_duplex_options), plus the options supported by the `Stream Parser`.

This Transform uses the `StreamParser` under the hood and support similar events.

#### Installation

```bash
$ npm install --save @json2csv/node
```

#### Usage

```js
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from '@json2csv/node';

const input = createReadStream(inputPath, { encoding: 'utf8' });
const output = createWriteStream(outputPath, { encoding: 'utf8' });
const parser = new Transform();

const processor = input.pipe(parser).pipe(output);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .on('header', (header) => console.log(header))
  .on('line', (line) => console.log(line));
```

#### **Node Async Parser**

To facilitate usage, `NodeAsyncParser` wraps `NodeTransform` exposing a single `parse` method similar to the sync API. This method accepts JSON arrays/objects, TypedArrays, strings and readable streams as input and returns a stream that produces the CSV.

`NodeAsyncParser` also exposes a convenience `promise` method which turns the stream into a promise that resolves to the whole CSV.

#### Installation

```bash
$ npm install --save @json2csv/node
```

#### Usage

```js
import { AsyncParser } from '@json2csv/node';

const parser = new AsyncParser();

const csv = await parser.parse(data).promise();
```

#### **WHATWG Transform Stream**

For browser users, the Streaming API is wrapped in a WHATWG Transform Stream. This approach ensures a consistent memory footprint and avoids blocking JavaScript's event loop.

The async API takes a second options arguments that is directly passed to the underlying streams accepts the same options as the `Stream Parser`. It also support a third and fourth options equivalent to the `writableStrategy` and 
`readableStrategy` of a [WHATWG Transform Stream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream) respectively.

This Transform uses the `StreamParser` under the hood and support similar events.

#### Installation

```bash
$ npm install --save @json2csv/whatwg
```

#### Usage

```js
import { TransformStream } from '@json2csv/whatwg';

const parser = new TransformStream();

const response = await fetch('./my-file.json');

await response.body.pipeThrough(parser).pipeTo(writableStream);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
parser
  .addEventListener('header', (header) => console.log(header))
  .addEventListener('line', (line) => console.log(line));
```

#### **WHATWG Async Parser**

To facilitate usage, `WHATWGAsyncParser` wraps `WHATWGTransform` exposing a single `parse` method similar to the sync API. This method accepts JSON arrays/objects, TypedArrays, strings and readable streams as input and returns a stream that produces the CSV.

`WHATWGAsyncParser` also exposes a convenience `promise` method which turns the stream into a promise that resolves to the whole CSV.

#### Installation

```bash
$ npm install --save @json2csv/whatwg
```

#### Usage

```js
const { AsyncParser } from '@json2csv/whatwg';

const parser = new AsyncParser();

const csv = await parser.parse(data).promise();
```

#### **CLI**

`json2csv` can be called from the command line if installed globally (using the `-g` flag).

#### Installation

```bash
$ npm install -g @json2csv/cli
```

#### Usage

```bash
$ json2csv -i input.json
```

<!-- tabs:end -->
