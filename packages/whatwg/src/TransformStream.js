/* global TransformStream */

import { StreamParser } from '@json2csv/plainjs';

class Transformer extends StreamParser {
  constructor(opts, asyncOpts) {
    super(opts, asyncOpts);
  }

  onData(data) {
    this.controller.enqueue(data);
  }

  onError(err) {
    this.controller.error(err);
  }

  onEnd() {
    this.controller.terminate();
  }

  start(controller) {
    this.controller = controller;
  }

  transform(chunk) {
    this.tokenizer.write(chunk);
  }

  flush() {
    this.end();
  }
}

export default class JSON2CSVWHATWGTransformStream extends TransformStream {
  constructor(opts, asyncOpts, writableStrategy, readableStrategy) {
    const transformer = new Transformer(opts, asyncOpts);
    super(transformer, writableStrategy, readableStrategy);

    // Implement the EventTarget interface when running on a browser
    if (typeof document === 'object') {
      const delegate = document.createDocumentFragment();
      ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(
        (f) => (this[f] = (...args) => delegate[f](...args))
      );

      transformer.onHeader = (header) => this.dispatchEvent('header', header);
      transformer.onLine = (line) => this.dispatchEvent('line', line);
      const origOnData = transformer.onData.bind(transformer);
      transformer.onData = (data) => {
        origOnData(data);
        this.dispatchEvent('data', data);
      };
    }

    this.readable.promise = async () => {
      let csv = '';
      const outputStream = new WritableStream({
        write(chunk) {
          csv += chunk;
        },
      });

      await this.readable.pipeTo(outputStream);
      return csv;
    };
  }
}
