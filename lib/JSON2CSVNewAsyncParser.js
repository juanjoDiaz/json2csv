const JSON2CSVBase = require("./JSON2CSVBase");
const { Tokenizer, Parser, TokenType } = require('@streamparser/json');

class NewAsyncParser extends JSON2CSVBase {
  constructor(opts, asyncOpts) {
    super(opts);
    this.opts = this.preprocessOpts(opts);
    this.initTokenizer(asyncOpts);
    if (this.opts.fields) this.preprocessFieldsInfo(this.opts.fields);
  }

  initTokenizer(opts = {}, asyncOpts = {}) {
    this.tokenizer = asyncOpts.objectMode
      ? this.getObjectModeTokenizer()
      : this.getStandardModeTokenizer(opts, asyncOpts);
  }

  getObjectModeTokenizer() {
    return {
      write: (data) => this.pushLine(data),
      end: () => {},
    };
  }

  getStandardModeTokenizer(opts, asyncOpts) {
    const tokenizer = new Tokenizer(asyncOpts);
    tokenizer.onToken = (token, value, offset) => {
      if (!this.tokenParser) {
        if (token === TokenType.LEFT_BRACKET) {
          this.tokenParser = new Parser({ paths: ['$', '$.*'], keepStack: false });
          this.tokenParser.onValue = (value, _, parent) => {
            if (!parent) {
              this.end();
              return;
            }

            this.pushLine(value);
          };
        } else if (token === TokenType.LEFT_BRACE) {
          this.tokenParser = new Parser({ paths: ['$'], keepStack: false });
          this.tokenParser.onValue = (value) => this.pushLine(value);
        } else {
          throw new Error('Data should not be empty or the "fields" option should be included');
        }

        tokenizer.onToken = this.tokenParser.write.bind(this.tokenParser);
      }

      this.tokenParser.write(token, value, offset);
    };
  
    return tokenizer;
  }

  write(data) {
    this.tokenizer.write(data);
  }

  end() {
    if (this.tokenParser) {
      this.tokenParser.end();
    }
    this.tokenizer.end();
    this.onEnd();

    if (!this._hasWritten) {
      if (!this.opts.fields) {
        throw new Error('Data should not be empty or the "fields" option should be included');
      }

      this.pushHeader();
    }
  }

  /**
   * Generate the csv header and pushes it downstream.
   */
  pushHeader() {
    if (this.opts.withBOM) {
      this.push('\ufeff');
    }
  
    if (this.opts.header) {
      const header = this.getHeader(this.opts.fields);
      this.onHeader(header);
      this.onData(header);
      this._hasWritten = true;
    }
  }

  /**
   * Transforms an incoming json data to csv and pushes it downstream.
   *
   * @param {Object} data JSON object to be converted in a CSV row
   */
  pushLine(data) {
    const processedData = this.preprocessRow(data);
    
    if (!this._hasWritten) {
      this.opts.fields = this.preprocessFieldsInfo(this.opts.fields || Object.keys(processedData[0]));
      this.pushHeader(this.opts.fields);
    }

    processedData.forEach(row => {
      const line = this.processRow(row, this.opts.fields);
      if (line === undefined) return;
      this.onLine(line);
      this.onData(this._hasWritten ? this.opts.eol + line : line);
      this._hasWritten = true;
    });
  }

  onHeader(header) {}
  onLine(line) {}
  onData(data) {}
  onEnd() {}
}

module.exports = NewAsyncParser;
