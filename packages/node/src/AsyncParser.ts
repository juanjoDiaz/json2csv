import { Readable, type TransformOptions } from 'stream';
import type { ParserOptions, StreamParserOptions } from '@json2csv/plainjs';
import JSON2CSVNodeTransform from './Transform.js';

export default class JSON2CSVNodeAsyncParser<
  TRaw extends object,
  T extends object,
> {
  private readonly opts: ParserOptions<TRaw, T>;
  private asyncOpts: StreamParserOptions;
  private readonly transformOpts: TransformOptions;

  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOpts: StreamParserOptions = {},
    transformOpts: TransformOptions = {},
  ) {
    this.opts = opts;
    this.asyncOpts = asyncOpts;
    this.transformOpts = transformOpts;
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
      | ArrayBufferView
      | Iterable<TRaw>
      | AsyncIterable<TRaw>
      | TRaw
      | ReadableStream<TRaw>
      | Readable,
  ) {
    // if (Array.isArray(data)) {
    //   data = Readable.from(data.filter((item) => item !== null));
    // } else if (isIterable(data) || isAsyncIterable(data)) {
    //   data = Readable.from(data, { objectMode: false });
    if (typeof data === 'string' || ArrayBuffer.isView(data)) {
      data = Readable.from(data as Iterable<number>, { objectMode: false });
    } else if (Array.isArray(data)) {
      data = Readable.from(data.filter((item) => item !== null));
    } else if (typeof data === 'object' && !(data instanceof Readable)) {
      data = Readable.from([data]);
    }

    if (!(data instanceof Readable)) {
      throw new Error(
        'Data should be a JSON object, JSON array, typed array, string or stream',
      );
    }
    return data.pipe(
      new JSON2CSVNodeTransform(this.opts, this.asyncOpts, {
        objectMode: data.readableObjectMode,
        ...this.transformOpts,
      }),
    );
  }
}
