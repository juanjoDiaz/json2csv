import JSON2CSVBase, { type Json2CSVBaseOptions } from './BaseParser.js';
import { flattenReducer, fastJoin } from './utils.js';

export type ParserOptions<TRaw = object, T = TRaw> = Json2CSVBaseOptions<
  TRaw,
  T
>;

export default class JSON2CSVParser<
  TRaw extends object,
  T extends object,
> extends JSON2CSVBase<TRaw, T> {
  constructor(opts?: Readonly<Omit<Json2CSVBaseOptions<TRaw, T>, 'ndjson'>>) {
    super(opts);
  }

  /**
   * Main function that converts json to csv.
   *
   * @param {Array|Object} data Array of JSON objects to be converted to CSV
   * @returns {String} The CSV formated data as a string
   */
  parse(data: Array<TRaw> | TRaw): string {
    const preprocessedData = this.preprocessData(data);

    this.opts.fields =
      this.opts.fields ||
      this.preprocessFieldsInfo(
        preprocessedData.reduce((fields: Array<string>, item) => {
          Object.keys(item).forEach((field) => {
            if (!fields.includes(field)) {
              fields.push(field);
            }
          });

          return fields;
        }, []),
        this.opts.defaultValue,
      );

    const header = this.opts.header ? this.getHeader() : '';
    const rows = this.processData(preprocessedData);
    const csv =
      (this.opts.withBOM ? '\ufeff' : '') +
      header +
      (header && rows ? this.opts.eol : '') +
      rows;

    return csv;
  }

  /**
   * Preprocess the data according to the give opts (unwind, flatten, etc.)
    and calculate the fields and field names if they are not provided.
   *
   * @param {Array|Object} data Array or object to be converted to CSV
   */
  preprocessData(data: Array<TRaw> | TRaw): Array<T> {
    const processedData = Array.isArray(data) ? data : [data];

    if (!this.opts.fields) {
      if (data === undefined || data === null || processedData.length === 0) {
        throw new Error(
          'Data should not be empty or the "fields" option should be included',
        );
      }
      if (typeof processedData[0] !== 'object') {
        throw new Error(
          'Data items should be objects or the "fields" option should be included',
        );
      }
    }

    if (this.opts.transforms.length === 0)
      return processedData as unknown as Array<T>;

    return processedData
      .map((row) => this.preprocessRow(row))
      .reduce(flattenReducer, []);
  }

  /**
   * Create the content row by row below the header
   *
   * @param {Array} data Array of JSON objects to be converted to CSV
   * @returns {String} CSV string (body)
   */
  processData(data: Array<T>): string {
    return fastJoin(
      data.map((row) => this.processRow(row)).filter((row) => row), // Filter empty rows
      this.opts.eol,
    );
  }
}
