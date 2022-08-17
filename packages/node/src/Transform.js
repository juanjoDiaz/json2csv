import os from 'os';
import { Transform } from 'stream';
import { StreamParser } from '@json2csv/plainjs';
import { fakeInherit } from './utils.js';

export default class JSON2CSVNodeTransform extends Transform {
  constructor(opts = {}, transformOpts = {}, asyncOptions = {}) {
    super(transformOpts);
    fakeInherit(this, StreamParser);
    // To don't override the stream end method.
    this.endUnderlayingParser = StreamParser.prototype.end;
    this.opts = this.preprocessOpts({
      ...opts,
      eol: opts.eol || os.EOL,
    });
    this.initTokenizer(opts, {
      ...asyncOptions,
      objectMode: transformOpts.objectMode || transformOpts.readableObjectMode,
    });
    if (this.opts.fields) this.preprocessFieldsInfo(this.opts.fields);
  }

  onHeader(header) {
    this.emit('header', header);
  }

  onLine(line) {
    this.emit('line', line);
  }

  onData(data) {
    this.push(data);
  }

  onError(err) {
    throw err;
  }

  onEnd() {
    if (!this.writableEnded) this.end();
  }

  /**
   * Main function that send data to the parse to be processed.
   *
   * @param {Buffer} chunk Incoming data
   * @param {String} encoding Encoding of the incoming data. Defaults to 'utf8'
   * @param {Function} done Called when the proceesing of the supplied chunk is done
   */
  _transform(chunk, encoding, done) {
    try {
      this.tokenizer.write(chunk);
      done();
    } catch (err) {
      done(err);
    }
  }

  _final(done) {
    try {
      this.endUnderlayingParser();
      done();
    } catch (err) {
      done(err);
    }
  }

  promise() {
    return new Promise((resolve, reject) => {
      const csvBuffer = [];
      this.on('data', (chunk) => csvBuffer.push(chunk.toString()))
        .on('finish', () => resolve(csvBuffer.join('')))
        .on('error', (err) => reject(err));
    });
  }
}
