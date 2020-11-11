'use strict';

const { Readable, Transform, pipeline } = require('stream');
const { promisify } = require('promisify');
const pipeline = promisify(pipeline);
const JSON2CSVTransform = require('./JSON2CSVTransform');

class JSON2CSVAsyncParser {
  constructor(opts, transformOpts) {
    this.opts = opts;
    this.transformOpts = transformOpts;
  }

  parse(data) {
    const transform = new JSON2CSVTransform(this.opts, (data instanceof Readable) ? this.transformOpts : { ...this.transformOpts, objectMode: true });
    const csvBuffer = [];
    transform.on('data', chunk => csvBuffer.push(chunk.toString()));
    let processingPipeline;

    if (data instanceof Readable) { 
      processingPipeline = pipeline(data, transform);
    } else {
      const input = new Transform();
      input._read = () => {};

      processingPipeline = pipeline(input, this.transform);

      if (Array.isArray(data)) {
        data.forEach(item => this.input.push(JSON.stringify(item)));
      } else {
        this.input.push(data);
      }
      this.input.push(null);
    }

    await processingPipeline;
    return csvBuffer.join();
  }
}

module.exports = JSON2CSVAsyncParser