interface CsvToJsonOptions {
  fields?: Array<string>;
  delimiter?: string;
  quote?: string;
  escapedQuote?: string;
  eol?: string;
  header?: boolean;
  withBOM?: boolean;
  defaultValue?: string;
}

export class BaseParserCsvToJSON {
  private options: CsvToJsonOptions;

  constructor(options: CsvToJsonOptions = {}) {
    this.options = {
      delimiter: ',',
      quote: '"',
      escapedQuote: '""',
      eol: '\n',
      header: true,
      withBOM: false,
      defaultValue: '',
      ...options
    };
  }

  parse(csv: string): any[] {
    const lines = csv.split(this.options.eol!);
    const headers = this.options.fields || this.processLine(lines[0]);

    return lines.slice(this.options.header ? 1 : 0).map(line => {
      const values = this.processLine(line);
      let row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] !== undefined ? values[i] : this.options.defaultValue;
      });
      return row;
    });
  }

  private processLine(line: string): string[] {
    const result = [];
    let startValueIndex = 0;
    let cursor = 0;
    while (cursor < line.length) {
      if (line[cursor] === this.options.quote) {
        do {
          cursor++;
        } while (line[cursor] !== this.options.quote && cursor < line.length);
      }
      if (line[cursor] === this.options.delimiter || cursor === line.length) {
        const value = line.substring(startValueIndex, cursor);
        result.push(value.startsWith(this.options.quote!) && value.endsWith(this.options.quote!) ?
          value.substring(1, value.length - 1).replace(this.options.escapedQuote!, this.options.quote) :
          value);
        startValueIndex = cursor + 1;
      }
      cursor++;
    }
    return result;
  }
}