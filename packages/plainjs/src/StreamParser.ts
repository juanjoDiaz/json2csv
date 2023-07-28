import {
  Tokenizer,
  TokenParser,
  TokenType,
  TokenizerError,
} from '@streamparser/json';
import JSON2CSVBase, {
  type Json2CSVBaseOptions,
  type NormalizedJson2CSVBaseOptions,
} from './BaseParser.js';

export interface StreamParserOptions {
  objectMode?: boolean;
  stringBufferSize?: number;
  numberBufferSize?: number;
}

interface ObjectModeTokenizer<TRaw> {
  isEnded?: boolean;
  write: (data: TRaw) => void;
  end: () => void;
}

export default class JSON2CSVStreamParser<
  TRaw extends object,
  T extends object,
> extends JSON2CSVBase<TRaw, T> {
  protected tokenizer!: Tokenizer | ObjectModeTokenizer<TRaw>;
  private tokenParser!: TokenParser;
  private _hasWritten = false;

  constructor(
    opts?: Readonly<Json2CSVBaseOptions<TRaw, T>>,
    asyncOpts?: Readonly<StreamParserOptions>,
  ) {
    super(opts);
    if (this.opts.fields)
      this.preprocessFieldsInfo(this.opts.fields, this.opts.defaultValue);
    this.initTokenizer(this.opts, asyncOpts);
  }

  protected initTokenizer(
    opts: NormalizedJson2CSVBaseOptions<TRaw, T>,
    asyncOpts: StreamParserOptions = {},
  ) {
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

  protected getObjectModeTokenizer(): ObjectModeTokenizer<TRaw> {
    return {
      write: (data) => this.pushLine(data),
      end: () => {
        this.pushHeaderIfNotWritten();
        this.onEnd();
      },
    };
  }

  private configureCallbacks(tokenizer: Tokenizer, tokenParser: TokenParser) {
    tokenizer.onToken = tokenParser.write.bind(this.tokenParser);
    tokenizer.onError = (err) => this.onError(err);
    tokenizer.onEnd = () => {
      if (!this.tokenParser.isEnded) this.tokenParser.end();
    };

    tokenParser.onValue = ({ value }) => this.pushLine(value as TRaw);
    tokenParser.onError = (err) => this.onError(err);
    tokenParser.onEnd = () => {
      this.pushHeaderIfNotWritten();
      this.onEnd();
    };
  }

  protected getNdJsonTokenizer(asyncOpts: StreamParserOptions): Tokenizer {
    const tokenizer = new Tokenizer({ ...asyncOpts, separator: this.opts.eol });
    this.tokenParser = new TokenParser({
      paths: ['$'],
      keepStack: false,
      separator: this.opts.eol,
    });
    this.configureCallbacks(tokenizer, this.tokenParser);
    return tokenizer;
  }

  protected getBinaryModeTokenizer(asyncOpts: StreamParserOptions): Tokenizer {
    const tokenizer = new Tokenizer(asyncOpts);
    tokenizer.onToken = ({ token, value }) => {
      if (token === TokenType.LEFT_BRACKET) {
        this.tokenParser = new TokenParser({
          paths: ['$.*'],
          keepStack: false,
        });
      } else if (token === TokenType.LEFT_BRACE) {
        this.tokenParser = new TokenParser({ paths: ['$'], keepStack: false });
      } else {
        this.onError(
          new Error(
            'Data items should be objects or the "fields" option should be included',
          ),
        );
        return;
      }

      this.configureCallbacks(tokenizer, this.tokenParser);

      this.tokenParser.write({ token, value });
    };
    tokenizer.onError = (err) =>
      this.onError(
        err instanceof TokenizerError
          ? new Error('Data should be a valid JSON object or array')
          : err,
      );
    tokenizer.onEnd = () => {
      this.pushHeaderIfNotWritten();
      this.onEnd();
    };

    return tokenizer;
  }

  // TODO this should be narrowed based on options
  write(data: Iterable<number> | string | TRaw): void {
    this.tokenizer.write(data as any);
  }

  end() {
    if (this.tokenizer && !this.tokenizer.isEnded) this.tokenizer.end();
  }

  pushHeaderIfNotWritten() {
    if (this._hasWritten) return;
    if (!this.opts.fields) {
      this.onError(
        new Error(
          'Data should not be empty or the "fields" option should be included',
        ),
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
      this.onData('\ufeff');
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
  pushLine(data: TRaw) {
    const processedData = this.preprocessRow(data);

    if (!this._hasWritten) {
      if (!this.opts.fields) {
        if (typeof processedData[0] !== 'object') {
          throw new Error(
            'Data items should be objects or the "fields" option should be included',
          );
        }
        this.opts.fields = this.preprocessFieldsInfo(
          Object.keys(processedData[0]),
          this.opts.defaultValue,
        );
      }
      this.pushHeader();
    }

    processedData.forEach((row) => {
      const line = this.processRow(row);
      if (line === undefined) return;
      this.onLine(line);
      this.onData(this._hasWritten ? this.opts.eol + line : line);
      this._hasWritten = true;
    });
  }

  // No idea why eslint doesn't detect the usage of these
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* c8 ignore start */
  onHeader(header: string) {
    /* To be set by the user */
  }
  onLine(line: string) {
    /* To be set by the user */
  }
  onData(data: string) {
    /* To be set by the user */
  }
  onError(err: Error) {
    /* To be set by the user */
  }
  onEnd() {
    /* To be set by the user */
  }
  /* c8 ignore stop */
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
