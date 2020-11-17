const JSON2CSVNewAsyncParser = require('./JSON2CSVNewAsyncParser');
const { fakeInherit } = require('./utils');

class HeaderEvent extends Event {
  constructor(header) {
    super('header');
    this.header = header;
  }
}

class LineEvent extends Event {
  constructor(line) {
    super('line');
    this.line = line;
  }
}

class DataEvent extends Event {
  constructor(data) {
    super('data');
    this.data = data;
  }
}

class EndEvent extends Event {
  constructor() {
    super('end');
  }
}

class Transformer extends EventTarget {
  constructor(opts, transformOpts = {}, asyncOptions = {}) {
    super(transformOpts);
    fakeInherit(this, JSON2CSVNewAsyncParser);
    this.opts = this.preprocessOpts(opts);
    this.initTokenizer(opts, { ...asyncOptions, objectMode: transformOpts.objectMode || transformOpts.readableObjectMode });
    if (this.opts.fields) this.preprocessFieldsInfo(this.opts.fields);
    this.onHeader = (header) => this.dispatchEvent(new HeaderEvent(header));
    this.onLine = (line) => this.dispatchEvent(new LineEvent(line));
    this.onData = (data) => {
      this.controller.enqueue(data);
      this.dispatchEvent(new DataEvent(data));
    };
    this.onEnd = () => this.controller.close();
  }

  onHeader(header) {
    this.dispatchEvent(new HeaderEvent(header));
  }

  onLine(line) {
    this.dispatchEvent(new LineEvent(line));
  }

  onData(data) {
    this.controller.enqueue(data);
    this.dispatchEvent(new DataEvent(data));
  }

  onEnd() {
    this.controller.close();
  }

  start(controller) {
    this.controller = controller;
  }

  transform(chunk, controller) {
    try {
      this.tokenizer.write(chunk);
    } catch (err) {
      controller.error(err);
    }
  }
  
  flush(controller) {
    try {
      this.onEnd = () => this.dispatchEvent(new EndEvent());
      this.end();
    } catch (err) {
      controller.error(err);
    }
  }

  static promisify(stream) {
    const csvBuffer = [];
    const reader = stream.getReader();
    // This is to avoid runtime generators
    const readNext = () => {
      return reader.read().then(({ done, value }) => {
        csvBuffer.push(value);
        if (!done) return readNext();
        return csvBuffer.join('');
      });
    }
    return readNext();
  }
}

module.exports = Transformer;