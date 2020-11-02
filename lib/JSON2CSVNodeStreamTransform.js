'use strict';

const { Transform, pipeline } = require('stream');
const { promisify } = require('util');
const JSON2CSVTransformBase = require('./JSON2CSVTransformBase');
const { fakeInherit } = require('./utils');

const pipelineAsync = promisify(pipeline);

class JSON2CSVNodeStreamTransform extends Transform {
  constructor(opts, transformOpts = {}) {
    super(transformOpts);

    // Inherit methods from JSON2CSVBase since extends doesn't
    // allow multiple inheritance and manually preprocess opts
    fakeInherit(this, JSON2CSVTransformBase);
    this.opts = this.preprocessOpts(opts);
    this.init({ objectMode: this.readableObjectMode });
  }

  // emit(eventType, data) {
  //   this.dispatchEvent( new events[eventType], data);
  // }

  // push(data) {
  //   this.controller.enqueue(data);
  // }

  /**
   * Main function that send data to the parse to be processed.
   *
   * @param {Buffer} chunk Incoming data
   * @param {String} encoding Encoding of the incoming data. Defaults to 'utf8'
   * @param {Function} done Called when the proceesing of the supplied chunk is done
   */
  _transform(chunk, encoding, done) {
    this.parser.write(chunk);
    done();
  }

  _flush(done) {
    if (this.parser.getPendingData()) {
      done(new Error('Invalid data received from stdin', this.parser.getPendingData()));
    }

    done();
  }

  promise() {
    return new Promise((resolve, reject) => {
      const csvBuffer = [];
      this
        .on('data', chunk => csvBuffer.push(chunk.toString()))
        .on('finish', () => resolve(csvBuffer.join('')))
        .on('error', err => reject(err));
    });
  }
}

module.exports = JSON2CSVNodeStreamTransform;
