import os from 'os';
import {
  Transform,
  type TransformOptions,
  type TransformCallback,
} from 'stream';
import {
  type ParserOptions,
  StreamParser,
  type StreamParserOptions,
} from '@json2csv/plainjs';

export default class JSON2CSVNodeTransform<
  TRaw extends object,
  T extends object,
> extends Transform {
  private streamParser: StreamParser<TRaw, T>;

  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOptions: StreamParserOptions = {},
    transformOpts: TransformOptions = {},
  ) {
    super(transformOpts);
    this.streamParser = new StreamParser(
      {
        ...opts,
        eol: opts.eol || os.EOL,
      },
      {
        ...asyncOptions,
        objectMode:
          transformOpts.objectMode || transformOpts.readableObjectMode,
      },
    );

    this.streamParser.onHeader = (header) => this.emit('header', header);
    this.streamParser.onLine = (line) => this.emit('line', line);
    this.streamParser.onData = (data) => this.push(data);
    this.streamParser.onError = (err) => {
      throw err;
    };
    this.streamParser.onEnd = () => {
      if (!this.writableEnded) this.end();
    };
  }

  /**
   * Main function that send data to the parse to be processed.
   *
   * @param {Buffer} chunk Incoming data
   * @param {String} encoding Encoding of the incoming data. Defaults to 'utf8'
   * @param {Function} done Called when the proceesing of the supplied chunk is done
   */
  override _transform(
    chunk: any,
    encoding: BufferEncoding,
    done: TransformCallback,
  ) {
    try {
      this.streamParser.write(chunk);
      done();
    } catch (err: unknown) {
      done(err as Error);
    }
  }

  override _final(done: any) {
    try {
      this.streamParser.end();
      done();
    } catch (err: unknown) {
      done(err);
    }
  }

  promise(): Promise<string> {
    return new Promise((resolve, reject) => {
      const csvBuffer: Array<string> = [];
      this.on('data', (chunk) => csvBuffer.push(chunk.toString()))
        .on('finish', () => resolve(csvBuffer.join('')))
        .on('error', (err) => reject(err));
    });
  }
}
