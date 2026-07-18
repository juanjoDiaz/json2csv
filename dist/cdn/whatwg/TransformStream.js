// packages/whatwg/src/TransformStream.ts
import {
  StreamParser
} from "../plainjs/index.js";
var JSON2CSVWHATWGTransformer = class extends StreamParser {
  constructor(opts = {}, asyncOpts = {}) {
    super(opts, asyncOpts);
    // Rows produced while processing a single input chunk are coalesced into
    // one enqueued chunk, instead of one enqueue() per CSV row.
    this.outputBuffer = "";
  }
  onData(data) {
    this.outputBuffer += data;
  }
  onError(err) {
    this.flushOutputBuffer();
    this.controller.error(err);
  }
  onEnd() {
    this.flushOutputBuffer();
    this.controller.terminate();
  }
  start(controller) {
    this.controller = controller;
  }
  flushOutputBuffer() {
    if (!this.outputBuffer) return;
    const data = this.outputBuffer;
    this.outputBuffer = "";
    this.controller.enqueue(data);
  }
  transform(chunk) {
    this.tokenizer.write(chunk);
    this.flushOutputBuffer();
  }
  flush() {
    this.end();
  }
};
var JSON2CSVWHATWGTransformStream = class extends TransformStream {
  constructor(opts = {}, asyncOpts = {}, writableStrategy, readableStrategy) {
    const transformer = new JSON2CSVWHATWGTransformer(opts, asyncOpts);
    super(transformer, writableStrategy, readableStrategy);
    this.delegate = new EventTarget();
    transformer.onHeader = (header) => this.dispatchEvent(new CustomEvent("header", { detail: header }));
    transformer.onLine = (line) => this.dispatchEvent(new CustomEvent("line", { detail: line }));
    const origOnData = transformer.onData.bind(transformer);
    transformer.onData = (data) => {
      origOnData(data);
      this.dispatchEvent(new CustomEvent("data", { detail: data }));
    };
    this.readable.promise = async () => {
      let csv = "";
      const outputStream = new WritableStream({
        write(chunk) {
          csv += chunk;
        }
      });
      await this.readable.pipeTo(outputStream);
      return csv;
    };
  }
  addEventListener(type, callback, options) {
    this.delegate.addEventListener(type, callback, options);
    return this;
  }
  dispatchEvent(event) {
    return this.delegate.dispatchEvent(event);
  }
  removeEventListener(type, callback, options) {
    this.delegate.removeEventListener(type, callback, options);
    return this;
  }
};
export {
  JSON2CSVWHATWGTransformStream as default
};
