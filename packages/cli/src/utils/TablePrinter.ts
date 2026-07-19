import os from 'node:os';
import { Writable } from 'node:stream';

const MIN_CELL_WIDTH = 15;

export interface TablePrinterOptions {
  eol: string;
  delimiter: string;
  quote?: string;
  escapedQuote?: string;
}

// Splits `text` on `separator`, but ignores occurrences of `separator` that
// fall inside a quoted CSV field (e.g. an embedded delimiter or a real
// newline within a quoted value), so a single logical row/cell isn't torn
// apart. A doubled quote (or whatever `escapedQuote` is) is treated as a
// literal quote character rather than a close-then-reopen.
function splitOutsideQuotes(
  text: string,
  separator: string,
  quote: string,
  escapedQuote: string,
): Array<string> {
  if (!quote) return text.split(separator);

  const parts: Array<string> = [];
  let insideQuotes = false;
  let partStart = 0;
  let i = 0;

  while (i < text.length) {
    if (insideQuotes && escapedQuote && text.startsWith(escapedQuote, i)) {
      i += escapedQuote.length;
      continue;
    }
    if (text.startsWith(quote, i)) {
      insideQuotes = !insideQuotes;
      i += quote.length;
      continue;
    }
    if (!insideQuotes && text.startsWith(separator, i)) {
      parts.push(text.slice(partStart, i));
      i += separator.length;
      partStart = i;
      continue;
    }
    i += 1;
  }
  parts.push(text.slice(partStart));
  return parts;
}

// Same scan as splitOutsideQuotes, but returns only the last safe split
// point instead of materializing every part. Used to find how much of a
// streamed buffer can be flushed without cutting a quoted value in half.
function findLastIndexOutsideQuotes(
  text: string,
  separator: string,
  quote: string,
  escapedQuote: string,
): number {
  if (!quote) return text.lastIndexOf(separator);

  let insideQuotes = false;
  let lastIndex = -1;
  let i = 0;

  while (i < text.length) {
    if (insideQuotes && escapedQuote && text.startsWith(escapedQuote, i)) {
      i += escapedQuote.length;
      continue;
    }
    if (text.startsWith(quote, i)) {
      insideQuotes = !insideQuotes;
      i += quote.length;
      continue;
    }
    if (!insideQuotes && text.startsWith(separator, i)) {
      lastIndex = i;
      i += separator.length;
      continue;
    }
    i += 1;
  }
  return lastIndex;
}

export default class TablePrinter {
  private readonly opts: TablePrinterOptions;
  private readonly quote: string;
  private readonly escapedQuote: string;
  private _hasWritten = false;

  private colWidths!: Array<number>;
  private cellWrapRegexes!: Array<RegExp>;
  private topLine!: string;
  private middleLine!: string;
  private bottomLine!: string;

  constructor(opts: TablePrinterOptions) {
    this.opts = opts;
    this.quote = typeof opts.quote === 'string' ? opts.quote : '"';
    this.escapedQuote =
      typeof opts.escapedQuote === 'string'
        ? opts.escapedQuote
        : `${this.quote}${this.quote}`;
  }

  private splitRows(csv: string): Array<string> {
    return splitOutsideQuotes(
      csv,
      this.opts.eol,
      this.quote,
      this.escapedQuote,
    );
  }

  push(csv: string): void {
    const lines = this.splitRows(csv);

    if (!lines.length) return;

    if (!this._hasWritten) this.setColumnWidths(lines[0]);

    const top = this._hasWritten ? this.middleLine : this.topLine;
    this.print(top, lines);
    this._hasWritten = true;
  }

  end(csv: string): void {
    const lines = this.splitRows(csv);
    if (!this._hasWritten) this.setColumnWidths(lines[0]);
    const top = this._hasWritten ? this.middleLine : this.topLine;
    this.print(top, lines, this.bottomLine);
  }

  printCSV(csv: string): void {
    this.end(csv);
  }

  private splitCells(row: string): Array<string> {
    return splitOutsideQuotes(
      row,
      this.opts.delimiter,
      this.quote,
      this.escapedQuote,
    );
  }

  setColumnWidths(line: string): void {
    this.colWidths = this.splitCells(line).map((elem) =>
      Math.max(elem.length * 2, MIN_CELL_WIDTH),
    );
    this.cellWrapRegexes = this.colWidths.map(
      (width) => new RegExp(`(.{1,${width - 2}})`, 'g'),
    );

    this.topLine = `┌${this.colWidths.map((i) => '─'.repeat(i)).join('┬')}┐`;
    this.middleLine = `├${this.colWidths.map((i) => '─'.repeat(i)).join('┼')}┤`;
    this.bottomLine = `└${this.colWidths.map((i) => '─'.repeat(i)).join('┴')}┘`;
  }

  print(top: string, lines: Array<string>, bottom?: string) {
    const table = `${top}${os.EOL}${lines
      .map((row) => this.formatRow(row))
      .join(
        `${os.EOL}${this.middleLine}${os.EOL}`,
      )}${os.EOL}${bottom ? bottom : ''}`;

    process.stdout.write(table);
  }

  formatRow(row: string): string {
    const wrappedRow = this.splitCells(row).map(
      (cell, i) => cell.match(this.cellWrapRegexes[i]) || ([] as Array<string>),
    );

    const height = wrappedRow.reduce(
      (acc, cell) => Math.max(acc, cell.length),
      0,
    );

    const processedCells = wrappedRow.map((cell, i) =>
      this.formatCell(cell, height, this.colWidths[i]),
    );

    return Array(height)
      .fill('')
      .map((_, i) => `│${processedCells.map((cell) => cell[i]).join('│')}│`)
      .join(os.EOL);
  }

  formatCell(
    content: Array<string>,
    heigth: number,
    width: number,
  ): Array<string> {
    const paddedContent = this.padCellHorizontally(content, width);
    return this.padCellVertically(paddedContent, heigth, width);
  }

  padCellVertically(
    content: Array<string>,
    heigth: number,
    width: number,
  ): Array<string> {
    const vertPad = heigth - content.length;
    const vertPadTop = Math.ceil(vertPad / 2);
    const vertPadBottom = vertPad - vertPadTop;
    const emptyLine = ' '.repeat(width);

    return [
      ...Array(vertPadTop).fill(emptyLine),
      ...content,
      ...Array(vertPadBottom).fill(emptyLine),
    ];
  }

  padCellHorizontally(content: Array<string>, width: number): Array<string> {
    return content.map((line) => {
      const horPad = width - line.length - 2;
      return ` ${line}${' '.repeat(horPad)} `;
    });
  }

  writeStream(): Writable {
    let csv = '';
    return new Writable({
      write: (chunk, _encoding, callback) => {
        csv += chunk.toString();
        // The buffer is only ever cut at a safe (outside-quotes) eol, so
        // whatever remains after trimming always starts at a fresh row;
        // re-scanning from index 0 each time is enough, no need to carry
        // "inside a quote" state across write() calls.
        const index = findLastIndexOutsideQuotes(
          csv,
          this.opts.eol,
          this.quote,
          this.escapedQuote,
        );
        if (index === -1) return callback();

        const lines = csv.substring(0, index);
        csv = csv.substring(index + this.opts.eol.length);

        if (lines) this.push(lines);
        callback();
      },
      final: () => {
        this.end(csv);
      },
    });
  }
}
