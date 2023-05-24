import type { ParserOptions, StreamParserOptions } from '@json2csv/plainjs';
import JSON2CSVWHATWGTransformStream from './TransformStream.js';

export default class JSON2CSVNodeAsyncParser<
  TRaw extends object,
  T extends object
> {
  private opts: ParserOptions<TRaw, T>;
  private asyncOpts: StreamParserOptions;
  private writableStrategy?: QueuingStrategy<TRaw>;
  private readableStrategy?: QueuingStrategy<string>;
  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOpts: StreamParserOptions = {},
    writableStrategy?: QueuingStrategy<TRaw>,
    readableStrategy?: QueuingStrategy<string>
  ) {
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
  parse(
    data:
      | string
      | string
      | ArrayBufferView
      | Iterable<TRaw>
      | AsyncIterable<TRaw>
      | TRaw
      | ReadableStream<TRaw>
  ) {
    if (typeof data === 'string' || ArrayBuffer.isView(data)) {
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data as TRaw);
          controller.close();
        },
      });
    } else if (Array.isArray(data)) {
      this.asyncOpts.objectMode = true;
      data = new ReadableStream({
        start(controller) {
          (data as Array<TRaw>)
            .filter((item) => item !== null)
            .forEach((item) => controller.enqueue(item));
          controller.close();
        },
      });
    } else if (typeof data === 'object' && !(data instanceof ReadableStream)) {
      this.asyncOpts.objectMode = true;
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data as TRaw);
          controller.close();
        },
      });
    }

    if (!(data instanceof ReadableStream)) {
      throw new Error(
        'Data should be a JSON object, JSON array, typed array, string or stream'
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
}
