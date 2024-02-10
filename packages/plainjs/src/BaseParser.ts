import {
  type Formatter,
  default as defaultFormatter,
  number as numberFormatterCtor,
  string as stringFormatterCtor,
  symbol as symbolFormatterCtor,
  object as objectFormatterCtor,
} from '@json2csv/formatters';
import type Transform from './types/Transform.js';
import { getProp, flattenReducer, fastJoin } from './utils.js';

export interface FieldValueGetterInfo<FT> {
  label: string;
  default?: FT;
}

export interface FieldValueGetterFnWithoutField<RT, FT> {
  (row: RT): FT;
}

export interface FieldValueGetterFnWithField<RT, FT> {
  (row: RT, field: FieldValueGetterInfo<FT>): FT;
}

export type FieldValueGetter<RT, FT> =
  | string
  | FieldValueGetterFnWithoutField<RT, FT>
  | FieldValueGetterFnWithField<RT, FT>;

export interface FieldInfo<RT, FT> {
  label?: string | undefined;
  default?: FT | undefined;
  value: FieldValueGetter<RT, FT>;
}

export enum FormatterTypes {
  header = 'header',
  undefined = 'undefined',
  boolean = 'boolean',
  number = 'number',
  bigint = 'bigint',
  string = 'string',
  symbol = 'symbol',
  function = 'function',
  object = 'object',
}

export interface FormattersOptions {
  [FormatterTypes.header]?: Formatter<string>;
  [FormatterTypes.undefined]?: Formatter<undefined>;
  [FormatterTypes.boolean]?: Formatter<boolean>;
  [FormatterTypes.number]?: Formatter<number>;
  [FormatterTypes.bigint]?: Formatter<bigint>;
  [FormatterTypes.string]?: Formatter<string>;
  [FormatterTypes.symbol]?: Formatter<symbol>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  [FormatterTypes.function]?: Formatter<Function>;
  [FormatterTypes.object]?: Formatter<object>;
}

export interface Json2CSVBaseOptions<TRaw, T> {
  fields?: Array<string | FieldInfo<T, unknown>>;
  ndjson?: boolean;
  defaultValue?: string;
  delimiter?: string;
  eol?: string;
  header?: boolean;
  includeEmptyRows?: boolean;
  withBOM?: boolean;
  formatters?: FormattersOptions;
  transforms?:
    | []
    | [Transform<TRaw, T>]
    | [Transform<TRaw, any>, ...Array<Transform<any, any>>, Transform<any, T>];
}

interface NormalizedFieldInfo<RT, FT> {
  label: string;
  value: FieldValueGetterFnWithoutField<RT, FT>;
}

export interface NormalizedJson2CSVBaseOptions<TRaw, T>
  extends Required<Json2CSVBaseOptions<TRaw, T>> {
  fields: Array<NormalizedFieldInfo<T, unknown>>;
  formatters: Required<FormattersOptions>;
}

export default abstract class JSON2CSVBase<
  TRaw extends object,
  T extends object,
> {
  protected opts: NormalizedJson2CSVBaseOptions<TRaw, T>;

  constructor(opts?: Readonly<Json2CSVBaseOptions<TRaw, T>>) {
    this.opts = this.preprocessOpts(opts);
  }

  /**
   * Check passing opts and set defaults.
   *
   * @param {Json2CsvOptions} opts Options object containing fields,
   * delimiter, default value, header, etc.
   */
  protected preprocessOpts(
    opts?: Json2CSVBaseOptions<TRaw, T>,
  ): NormalizedJson2CSVBaseOptions<TRaw, T> {
    const processedOpts = Object.assign(
      {},
      opts,
    ) as NormalizedJson2CSVBaseOptions<TRaw, T>;

    if (processedOpts.fields) {
      processedOpts.fields = this.preprocessFieldsInfo(
        processedOpts.fields,
        processedOpts.defaultValue,
      );
    }

    processedOpts.transforms = processedOpts.transforms || [];

    const stringFormatter =
      (processedOpts.formatters && processedOpts.formatters['string']) ||
      stringFormatterCtor();
    const objectFormatter = objectFormatterCtor({ stringFormatter });
    const defaultFormatters = {
      header: stringFormatter,
      undefined: defaultFormatter,
      boolean: defaultFormatter,
      number: numberFormatterCtor(),
      bigint: defaultFormatter,
      string: stringFormatter,
      symbol: symbolFormatterCtor({ stringFormatter }),
      function: objectFormatter,
      object: objectFormatter,
    };

    processedOpts.formatters = {
      ...defaultFormatters,
      ...processedOpts.formatters,
    };

    processedOpts.delimiter = processedOpts.delimiter || ',';
    processedOpts.eol = processedOpts.eol || '\n';
    processedOpts.header = processedOpts.header !== false;
    processedOpts.includeEmptyRows = processedOpts.includeEmptyRows || false;
    processedOpts.withBOM = processedOpts.withBOM || false;

    return processedOpts;
  }

  /**
   * Check and normalize the fields configuration.
   *
   * @param {(string|object)[]} fields Fields configuration provided by the user
   * or inferred from the data
   * @returns {object[]} preprocessed FieldsInfo array
   */
  protected preprocessFieldsInfo(
    fields: Array<string | FieldInfo<T, unknown>>,
    globalDefaultValue?: string,
  ): Array<NormalizedFieldInfo<T, unknown>> {
    return fields.map((fieldInfo) => {
      if (typeof fieldInfo === 'string') {
        return {
          label: fieldInfo,
          value: (row) => getProp(row, fieldInfo, globalDefaultValue),
        };
      }

      if (typeof fieldInfo === 'object') {
        const defaultValue =
          'default' in fieldInfo ? fieldInfo.default : globalDefaultValue;

        if (typeof fieldInfo.value === 'string') {
          const fieldPath: string = fieldInfo.value;
          return {
            label: fieldInfo.label || fieldInfo.value,
            value: (row) => getProp(row, fieldPath, defaultValue),
          };
        }

        if (typeof fieldInfo.value === 'function') {
          const label = fieldInfo.label || fieldInfo.value.name || '';
          const field = { label, default: defaultValue };
          const valueGetter: FieldValueGetterFnWithField<T, unknown> =
            fieldInfo.value;
          return {
            label,
            value(row) {
              const value = valueGetter(row, field);
              return value === undefined ? defaultValue : value;
            },
          };
        }
      }

      throw new Error(
        'Invalid field info option. ' + JSON.stringify(fieldInfo),
      );
    });
  }

  /**
   * Create the title row with all the provided fields as column headings
   *
   * @returns {String} titles as a string
   */
  protected getHeader(): string {
    return fastJoin(
      this.opts.fields.map((fieldInfo) =>
        this.opts.formatters.header(fieldInfo.label),
      ),
      this.opts.delimiter,
    );
  }

  /**
   * Preprocess each object according to the given transforms (unwind, flatten, etc.).
   * @param {Object} row JSON object to be converted in a CSV row
   */
  protected preprocessRow(row: TRaw): Array<T> {
    return (this.opts.transforms as Array<Transform<any, any>>).reduce(
      (rows: Array<unknown>, transform: Transform<any, any>) =>
        rows.map((row) => transform(row)).reduce(flattenReducer, []),
      [row],
    ) as Array<T>;
  }

  /**
   * Create the content of a specific CSV row
   *
   * @param {Object} row JSON object to be converted in a CSV row
   * @returns {String} CSV string (row)
   */
  protected processRow(row: T): string | undefined {
    if (!row) {
      return undefined;
    }

    const processedRow = this.opts.fields.map((fieldInfo) =>
      this.processCell(row, fieldInfo),
    );

    if (
      !this.opts.includeEmptyRows &&
      processedRow.every((field) => field === '')
    ) {
      return undefined;
    }

    return fastJoin(processedRow, this.opts.delimiter);
  }

  /**
   * Create the content of a specfic CSV row cell
   *
   * @param {Object} row JSON object representing the  CSV row that the cell belongs to
   * @param {FieldInfo} fieldInfo Details of the field to process to be a CSV cell
   * @returns {String} CSV string (cell)
   */
  protected processCell<FT>(
    row: T,
    fieldInfo: NormalizedFieldInfo<T, FT>,
  ): string {
    return this.processValue<FT>(fieldInfo.value(row));
  }

  /**
   * Create the content of a specfic CSV row cell
   *
   * @param {T} value Value to be included in a CSV cell
   * @returns {String} Value stringified and processed
   */

  protected processValue<T>(value: T): string {
    const formatter = this.opts.formatters[typeof value] as Formatter<T>;
    return formatter(value);
  }
}
