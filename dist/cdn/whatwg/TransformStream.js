// packages/whatwg/src/TransformStream.ts
import {
  StreamParser
} from "../plainjs/index.js";
var JSON2CSVWHATWGTransformer = class extends StreamParser {
  constructor(opts = {}, asyncOpts = {}) {
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
};
var JSON2CSVWHATWGTransformStream = class extends TransformStream {
  // TODO should be (event: Event): boolean
  constructor(opts = {}, asyncOpts = {}, writableStrategy, readableStrategy) {
    const transformer = new JSON2CSVWHATWGTransformer(opts, asyncOpts);
    super(transformer, writableStrategy, readableStrategy);
    if (typeof document === "object") {
      this.delegate = document.createDocumentFragment();
      transformer.onHeader = (header) => this.dispatchEvent(new CustomEvent("header", { detail: header }));
      transformer.onLine = (line) => this.dispatchEvent(new CustomEvent("line", { detail: line }));
      const origOnData = transformer.onData.bind(transformer);
      transformer.onData = (data) => {
        origOnData(data);
        this.dispatchEvent(new CustomEvent("data", { detail: data }));
      };
    }
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
    var _a;
    (_a = this.delegate) == null ? void 0 : _a.addEventListener(type, callback, options);
  }
  dispatchEvent(event) {
    var _a, _b;
    return (_b = (_a = this.delegate) == null ? void 0 : _a.dispatchEvent(event)) != null ? _b : false;
  }
  removeEventListener(type, callback, options) {
    var _a;
    (_a = this.delegate) == null ? void 0 : _a.removeEventListener(type, callback, options);
  }
};
export {
  JSON2CSVWHATWGTransformStream as default
};
