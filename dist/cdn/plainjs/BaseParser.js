// packages/plainjs/src/BaseParser.js
import lodashGet from "https://cdn.jsdelivr.net/npm/lodash.get@4.4.2/index.js";
import defaultFormatter from "../formatters/default";
import numberFormatterCtor from "../formatters/number";
import stringFormatterCtor from "../formatters/string";
import symbolFormatterCtor from "../formatters/symbol";
import objectFormatterCtor from "../formatters/object";
import { getProp, flattenReducer, fastJoin } from "./utils.js";
var JSON2CSVBase = class {
  constructor(opts) {
    this.opts = this.preprocessOpts(opts);
  }
  preprocessOpts(opts) {
    const processedOpts = Object.assign({}, opts);
    if (processedOpts.fields) {
      processedOpts.fields = this.preprocessFieldsInfo(
        processedOpts.fields,
        processedOpts.defaultValue
      );
    }
    processedOpts.transforms = processedOpts.transforms || [];
    const stringFormatter = processedOpts.formatters && processedOpts.formatters["string"] || stringFormatterCtor();
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
      object: objectFormatter
    };
    processedOpts.formatters = {
      ...defaultFormatters,
      ...processedOpts.formatters
    };
    processedOpts.delimiter = processedOpts.delimiter || ",";
    processedOpts.eol = processedOpts.eol || "\n";
    processedOpts.header = processedOpts.header !== false;
    processedOpts.includeEmptyRows = processedOpts.includeEmptyRows || false;
    processedOpts.withBOM = processedOpts.withBOM || false;
    return processedOpts;
  }
  preprocessFieldsInfo(fields, globalDefaultValue) {
    return fields.map((fieldInfo) => {
      if (typeof fieldInfo === "string") {
        return {
          label: fieldInfo,
          value: fieldInfo.includes(".") || fieldInfo.includes("[") ? (row) => lodashGet(row, fieldInfo, globalDefaultValue) : (row) => getProp(row, fieldInfo, globalDefaultValue)
        };
      }
      if (typeof fieldInfo === "object") {
        const defaultValue = "default" in fieldInfo ? fieldInfo.default : globalDefaultValue;
        if (typeof fieldInfo.value === "string") {
          return {
            label: fieldInfo.label || fieldInfo.value,
            value: fieldInfo.value.includes(".") || fieldInfo.value.includes("[") ? (row) => lodashGet(row, fieldInfo.value, defaultValue) : (row) => getProp(row, fieldInfo.value, defaultValue)
          };
        }
        if (typeof fieldInfo.value === "function") {
          const label = fieldInfo.label || fieldInfo.value.name || "";
          const field = { label, default: defaultValue };
          return {
            label,
            value(row) {
              const value = fieldInfo.value(row, field);
              return value === null || value === void 0 ? defaultValue : value;
            }
          };
        }
      }
      throw new Error(
        "Invalid field info option. " + JSON.stringify(fieldInfo)
      );
    });
  }
  getHeader() {
    return fastJoin(
      this.opts.fields.map(
        (fieldInfo) => this.opts.formatters.header(fieldInfo.label)
      ),
      this.opts.delimiter
    );
  }
  preprocessRow(row) {
    return this.opts.transforms.reduce(
      (rows, transform) => rows.map((row2) => transform(row2)).reduce(flattenReducer, []),
      [row]
    );
  }
  processRow(row) {
    if (!row) {
      return void 0;
    }
    const processedRow = this.opts.fields.map(
      (fieldInfo) => this.processCell(row, fieldInfo)
    );
    if (!this.opts.includeEmptyRows && processedRow.every((field) => field === "")) {
      return void 0;
    }
    return fastJoin(processedRow, this.opts.delimiter);
  }
  processCell(row, fieldInfo) {
    return this.processValue(fieldInfo.value(row));
  }
  processValue(value) {
    return this.opts.formatters[typeof value](value);
  }
};
export {
  JSON2CSVBase as default
};
