import type { ParserOptions, StreamParserOptions } from '@json2csv/plainjs';
import JSON2CSVWHATWGTransformStream, {
  type AwaitableReadableStream,
} from './TransformStream.js';

export default class JSON2CSVNodeAsyncParser<
  TRaw extends object,
  T extends object,
> {
  private opts: ParserOptions<TRaw, T>;
  private asyncOpts: StreamParserOptions;
  private writableStrategy?: QueuingStrategy<TRaw>;
  private readableStrategy?: QueuingStrategy<string>;
  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOpts: StreamParserOptions = {},
    writableStrategy?: QueuingStrategy<TRaw>,
    readableStrategy?: QueuingStrategy<string>,
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
      | ReadableStream<TRaw>,
  ): AwaitableReadableStream<string> {
    let asyncOpts = this.asyncOpts;
    if (typeof data === 'string' || ArrayBuffer.isView(data)) {
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data as TRaw);
          controller.close();
        },
      });
    } else if (Array.isArray(data)) {
      asyncOpts = { ...this.asyncOpts, objectMode: true };
      const items = data as Array<TRaw>;
      let index = 0;
      data = new ReadableStream({
        pull(controller) {
          while (index < items.length) {
            const item = items[index++];
            if (item !== null) {
              controller.enqueue(item);
              return;
            }
          }
          controller.close();
        },
      });
    } else if (typeof data === 'object' && !(data instanceof ReadableStream)) {
      asyncOpts = { ...this.asyncOpts, objectMode: true };
      data = new ReadableStream({
        start(controller) {
          controller.enqueue(data as TRaw);
          controller.close();
        },
      });
    }

    if (!(data instanceof ReadableStream)) {
      throw new Error(
        'Data should be a JSON object, JSON array, typed array, string or stream',
      );
    }

    const transform = new JSON2CSVWHATWGTransformStream(
      this.opts,
      asyncOpts,
      this.writableStrategy,
      this.readableStrategy,
    );
    return data.pipeThrough(transform) as AwaitableReadableStream<string>;
  }
}
