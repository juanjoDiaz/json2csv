import type Formatter from './Formatter.js';

export interface NumberFormatterOptions {
  separator?: string;
  decimals?: number;
}

export default function numberFormatter<T extends number>(
  opts: NumberFormatterOptions = {},
): Formatter<T> {
  const { separator, decimals } = opts;
  if (separator) {
    if (decimals) {
      return (value) => value.toFixed(decimals).replace('.', separator);
    }

    return (value) => `${value}`.replace('.', separator);
  }

  if (decimals) {
    return (value) => value.toFixed(decimals);
  }

  return (value) => `${value}`;
}
