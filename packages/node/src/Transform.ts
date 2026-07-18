import os from 'node:os';
import {
  Transform,
  type TransformCallback,
  type TransformOptions,
} from 'node:stream';
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
  // Rows produced while processing a single input chunk are coalesced into
  // one pushed chunk, instead of one push() per CSV row.
  private outputBuffer = '';

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
    this.streamParser.onData = (data) => {
      this.outputBuffer += data;
    };
    this.streamParser.onError = (err) => {
      throw err;
    };
    this.streamParser.onEnd = () => {
      if (!this.writableEnded) this.end();
    };
  }

  private flushOutputBuffer() {
    if (!this.outputBuffer) return;
    const data = this.outputBuffer;
    this.outputBuffer = '';
    this.push(data);
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
    _encoding: BufferEncoding,
    done: TransformCallback,
  ) {
    try {
      this.streamParser.write(chunk);
      this.flushOutputBuffer();
      done();
    } catch (err: unknown) {
      this.flushOutputBuffer();
      done(err as Error);
    }
  }

  override _final(done: any) {
    try {
      this.streamParser.end();
      this.flushOutputBuffer();
      done();
    } catch (err: unknown) {
      this.flushOutputBuffer();
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
