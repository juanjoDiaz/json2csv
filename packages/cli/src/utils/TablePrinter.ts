import os from 'os';
import { Writable } from 'stream';

const MIN_CELL_WIDTH = 15;

export interface TablePrinterOptions {
  eol: string;
  delimiter: string;
}

export default class TablePrinter {
  private readonly opts: TablePrinterOptions;
  private _hasWritten = false;

  private colWidths!: Array<number>;
  private topLine!: string;
  private middleLine!: string;
  private bottomLine!: string;

  constructor(opts: TablePrinterOptions) {
    this.opts = opts;
  }

  push(csv: string): void {
    const lines = csv.split(this.opts.eol);

    if (!lines.length) return;

    if (!this._hasWritten) this.setColumnWidths(lines[0]);

    const top = this._hasWritten ? this.middleLine : this.topLine;
    this.print(top, lines);
    this._hasWritten = true;
  }

  end(csv: string): void {
    const lines = csv.split(this.opts.eol);
    if (!this._hasWritten) this.setColumnWidths(lines[0]);
    const top = this._hasWritten ? this.middleLine : this.topLine;
    this.print(top, lines, this.bottomLine);
  }

  printCSV(csv: string): void {
    this.end(csv);
  }

  setColumnWidths(line: string): void {
    this.colWidths = line
      .split(this.opts.delimiter)
      .map((elem) => Math.max(elem.length * 2, MIN_CELL_WIDTH));

    this.topLine = `┌${this.colWidths.map((i) => '─'.repeat(i)).join('┬')}┐`;
    this.middleLine = `├${this.colWidths.map((i) => '─'.repeat(i)).join('┼')}┤`;
    this.bottomLine = `└${this.colWidths.map((i) => '─'.repeat(i)).join('┴')}┘`;
  }

  print(top: string, lines: Array<string>, bottom?: string) {
    const table =
      `${top}${os.EOL}` +
      lines
        .map((row) => this.formatRow(row))
        .join(`${os.EOL}${this.middleLine}${os.EOL}`) +
      os.EOL +
      (bottom ? bottom : '');

    process.stdout.write(table);
  }

  formatRow(row: string): string {
    const wrappedRow = row
      .split(this.opts.delimiter)
      .map(
        (cell, i) =>
          cell.match(new RegExp(`(.{1,${this.colWidths[i] - 2}})`, 'g')) ||
          ([] as Array<string>)
      );

    const height = wrappedRow.reduce(
      (acc, cell) => Math.max(acc, cell.length),
      0
    );

    const processedCells = wrappedRow.map((cell, i) =>
      this.formatCell(cell, height, this.colWidths[i])
    );

    return Array(height)
      .fill('')
      .map((_, i) => `│${processedCells.map((cell) => cell[i]).join('│')}│`)
      .join(os.EOL);
  }

  formatCell(
    content: Array<string>,
    heigth: number,
    width: number
  ): Array<string> {
    const paddedContent = this.padCellHorizontally(content, width);
    return this.padCellVertically(paddedContent, heigth, width);
  }

  padCellVertically(
    content: Array<string>,
    heigth: number,
    width: number
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
      write: (chunk, encoding, callback) => {
        csv += chunk.toString();
        const index = csv.lastIndexOf(this.opts.eol);
        const lines = csv.substring(0, index);
        csv = csv.substring(index + 1);

        if (lines) this.push(lines);
        callback();
      },
      final: () => {
        this.end(csv);
      },
    });
  }
}
