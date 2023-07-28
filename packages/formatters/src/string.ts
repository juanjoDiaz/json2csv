import type Formatter from './Formatter.js';

export interface StringFormatterOptions {
  quote?: string;
  escapedQuote?: string;
}

export default function stringFormatter(
  opts: StringFormatterOptions = {},
): Formatter<string> {
  const quote = typeof opts.quote === 'string' ? opts.quote : '"';
  const escapedQuote =
    typeof opts.escapedQuote === 'string'
      ? opts.escapedQuote
      : `${quote}${quote}`;

  if (!quote || quote === escapedQuote) {
    return (value) => value;
  }

  return (value) => {
    if (value.includes(quote)) {
      value = value.replace(new RegExp(quote, 'g'), escapedQuote);
    }

    return `${quote}${value}${quote}`;
  };
}
