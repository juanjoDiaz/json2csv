# json2csv

[![npm version](https://badge.fury.io/js/json2csv.svg)](http://badge.fury.io/js/json2csv)
[![Node.js CI](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml/badge.svg)](https://github.com/juanjoDiaz/json2csv/actions/workflows/on-push.yaml)
[![Coverage Status](https://coveralls.io/repos/github/juanjoDiaz/json2csv/badge.svg?branch=main)](https://coveralls.io/github/juanjoDiaz/json2csv?branch=main)

Fast and highly configurable JSON to CSV converter. 

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

## Types of JSON2CSV parsers

json2csv parsers are offered in vorious flavours:

* **[Parser](packages/plainjs/README.md#parser):** Pure Javascript synchronous parser. High-performant and runs both node.js and the browser. It´s the fastes but loads both the JSON and the resulting CSV in memory, and block the event loop while processing. Not recommended unless the JSON data is small.
* **[Stream Parser](packages/plainjs/README.md#stream-parser):** Pure Javascript stream parser. High-performant and runs both node.js and the browser. It keeps a consistent memory footprint and doesn't block the event loop. It's the base of all other parsers. Recommended to build your own parser.
* **[Node Transform](packages/node/README.md#node-transform):** Wraps the `Stream Parser` in a Node.js Transform Stream. Recommended for Node.js users using stream.
* **[Node Async Parser](packages/node/README.md#node-async-parser):** Wraps the `Node Transform` to offer a friendly promise-based API similar to the synchronous `Parser`. Recommended for Node.js users that want a higher abstraction level.
* **[WHATWG Transform Stream](packages/whatwg/README.md#whatwg-transform-stream):** Wraps the `Stream Parser` in a WHATWG Transform Stream. Recommended for browser users using web streams.
* **[WHATWG Async Parser](packages/whatwg/README.md#whatwg-async-parser):** Wraps the `WHATWG Transform Stream` to offer a friendly promise-based API similar to the synchronous `Parser`. Recommended for browser users that want a higher abstraction level.
* **[CLI](packages/cli/README.md):** Makes the node.js interfaces accesible through the command line. Recommended from CLI (sh/bash/zsh/...) users and CLI scripts.

## Documentation

See [https://juanjodiaz.github.io/json2csv](https://juanjodiaz.github.io/json2csv).

## License

See [LICENSE.md](https://github.com/juanjoDiaz/json2csv/blob/main/LICENSE.md).
