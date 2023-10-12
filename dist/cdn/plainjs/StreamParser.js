// packages/plainjs/src/StreamParser.ts
import {
  Tokenizer,
  TokenParser,
  TokenType,
  TokenizerError
} from "https://cdn.jsdelivr.net/npm/@streamparser/json@^0.0.17/dist/mjs/index.js";
import JSON2CSVBase from "./BaseParser.js";
var JSON2CSVStreamParser = class extends JSON2CSVBase {
  constructor(opts, asyncOpts) {
    super(opts);
    this._hasWritten = false;
    if (this.opts.fields)
      this.preprocessFieldsInfo(this.opts.fields, this.opts.defaultValue);
    this.initTokenizer(this.opts, asyncOpts);
  }
  initTokenizer(opts, asyncOpts = {}) {
    if (asyncOpts.objectMode) {
      this.tokenizer = this.getObjectModeTokenizer();
      return;
    }
    if (opts.ndjson) {
      this.tokenizer = this.getNdJsonTokenizer(asyncOpts);
      return;
    }
    this.tokenizer = this.getBinaryModeTokenizer(asyncOpts);
    return;
  }
  getObjectModeTokenizer() {
    return {
      write: (data) => this.pushLine(data),
      end: () => {
        this.pushHeaderIfNotWritten();
        this.onEnd();
      }
    };
  }
  configureCallbacks(tokenizer, tokenParser) {
    tokenizer.onToken = tokenParser.write.bind(this.tokenParser);
    tokenizer.onError = (err) => this.onError(err);
    tokenizer.onEnd = () => {
      if (!this.tokenParser.isEnded)
        this.tokenParser.end();
    };
    tokenParser.onValue = ({ value }) => this.pushLine(value);
    tokenParser.onError = (err) => this.onError(err);
    tokenParser.onEnd = () => {
      this.pushHeaderIfNotWritten();
      this.onEnd();
    };
  }
  getNdJsonTokenizer(asyncOpts) {
    const tokenizer = new Tokenizer({ ...asyncOpts, separator: this.opts.eol });
    this.tokenParser = new TokenParser({
      paths: ["$"],
      keepStack: false,
      separator: this.opts.eol
    });
    this.configureCallbacks(tokenizer, this.tokenParser);
    return tokenizer;
  }
  getBinaryModeTokenizer(asyncOpts) {
    const tokenizer = new Tokenizer(asyncOpts);
    tokenizer.onToken = ({ token, value }) => {
      if (token === TokenType.LEFT_BRACKET) {
        this.tokenParser = new TokenParser({
          paths: ["$.*"],
          keepStack: false
        });
      } else if (token === TokenType.LEFT_BRACE) {
        this.tokenParser = new TokenParser({ paths: ["$"], keepStack: false });
      } else {
        this.onError(
          new Error(
            'Data items should be objects or the "fields" option should be included'
          )
        );
        return;
      }
      this.configureCallbacks(tokenizer, this.tokenParser);
      this.tokenParser.write({ token, value });
    };
    tokenizer.onError = (err) => this.onError(
      err instanceof TokenizerError ? new Error("Data should be a valid JSON object or array") : err
    );
    tokenizer.onEnd = () => {
      this.pushHeaderIfNotWritten();
      this.onEnd();
    };
    return tokenizer;
  }
  // TODO this should be narrowed based on options
  write(data) {
    this.tokenizer.write(data);
  }
  end() {
    if (this.tokenizer && !this.tokenizer.isEnded)
      this.tokenizer.end();
  }
  pushHeaderIfNotWritten() {
    if (this._hasWritten)
      return;
    if (!this.opts.fields) {
      this.onError(
        new Error(
          'Data should not be empty or the "fields" option should be included'
        )
      );
      return;
    }
    this.pushHeader();
  }
  /**
   * Generate the csv header and pushes it downstream.
   */
  pushHeader() {
    if (this.opts.withBOM) {
      this.onData("\uFEFF");
    }
    if (this.opts.header) {
      const header = this.getHeader();
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
      if (!this.opts.fields) {
        if (typeof processedData[0] !== "object") {
          throw new Error(
            'Data items should be objects or the "fields" option should be included'
          );
        }
        this.opts.fields = this.preprocessFieldsInfo(
          Object.keys(processedData[0]),
          this.opts.defaultValue
        );
      }
      this.pushHeader();
    }
    processedData.forEach((row) => {
      const line = this.processRow(row);
      if (line === void 0)
        return;
      this.onLine(line);
      this.onData(this._hasWritten ? this.opts.eol + line : line);
      this._hasWritten = true;
    });
  }
  // No idea why eslint doesn't detect the usage of these
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* c8 ignore start */
  onHeader(header) {
  }
  onLine(line) {
  }
  onData(data) {
  }
  onError(err) {
  }
  onEnd() {
  }
  /* c8 ignore stop */
  /* eslint-enable @typescript-eslint/no-unused-vars */
};
export {
  JSON2CSVStreamParser as default
};
