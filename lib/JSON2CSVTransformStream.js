'use strict';
const JSON2CSVTransformBase = require('./JSON2CSVTransformBase');

const stringModeTransformer = {
  start(controller) {
    this._hasWritten = false;
    this.parser.onValue = function (value) {
      if (this.stack.length !== this.depthToEmit) return;

      const processedData = this.preprocessRow(data);
      
      if (!this._hasWritten) {
        this.opts.fields = this.opts.fields || this.preprocessFieldsInfo(Object.keys(processedData[0]));
        controller.enqueue(this.getHeader());
        this._hasWritten = true;
      }

      processedData.forEach(row => {
        const line = this.processRow(row, this.opts);
        if (line === undefined) return;
        controller.enqueue(this._hasWritten ? this.opts.eol + line : line);
        this._hasWritten = true;
      });
    }

    if (this.opts.withBOM) {
      controller.enqueue('\ufeff');
    }

    if (this.opts.fields) {
      this.opts.fields = this.preprocessFieldsInfo(this.opts.fields);
      if (this.opts.header) {
        controller.enqueue(this.getHeader());
        this._hasWritten = true;
      }
    }
  }, // required.
  async transform(chunk, controller) {
    if (chunk === null) controller.terminate();
    this.parser.write(chunk);
  },
  flush(controller) {
    // Any clean up?
  },
}

class JSON2CSVStreamTransform extends TransformStream {
  constructor(opts, writableStrategy, readableStrategy) {
    super(stringModeTransformer, writableStrategy, readableStrategy);

    // Inherit methods from JSON2CSVBase since extends doesn't
    // allow multiple inheritance and manually preprocess opts
    fakeInherit(this, JSON2CSVTransformBase);
    this.opts = this.preprocessOpts(opts);
  }
}

module.exports = JSON2CSVStreamTransform;
