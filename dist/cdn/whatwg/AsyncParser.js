// packages/whatwg/src/AsyncParser.ts
import JSON2CSVWHATWGTransformStream from "./TransformStream.js";
var JSON2CSVNodeAsyncParser = class {
  constructor(opts = {}, asyncOpts = {}, writableStrategy, readableStrategy) {
    this.opts = opts;
    this.asyncOpts = asyncOpts;
    this.writableStrategy = writableStrategy;
    this.readableStrategy = readableStrategy;
  }
  /**
   * Main function that converts json to csv.
   *
   * @param {Stream|Array|Object} data Array of JSON objects to be converted to CSV
   * @returns {Stream} A stream producing the CSV formated data as a string
   */
  parse(data) {
    if (typeof data === "string" || ArrayBuffer.isView(data)) {
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data);
          controller.close();
        }
      });
    } else if (Array.isArray(data)) {
      this.asyncOpts.objectMode = true;
      data = new ReadableStream({
        start(controller) {
          data.filter((item) => item !== null).forEach((item) => controller.enqueue(item));
          controller.close();
        }
      });
    } else if (typeof data === "object" && !(data instanceof ReadableStream)) {
      this.asyncOpts.objectMode = true;
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data);
          controller.close();
        }
      });
    }
    if (!(data instanceof ReadableStream)) {
      throw new Error(
        "Data should be a JSON object, JSON array, typed array, string or stream"
      );
    }
    const transform = new JSON2CSVWHATWGTransformStream(
      this.opts,
      this.asyncOpts,
      this.writableStrategy,
      this.readableStrategy
    );
    return data.pipeThrough(transform);
  }
};
export {
  JSON2CSVNodeAsyncParser as default
};
