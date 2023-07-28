import type Formatter from './Formatter.js';
import defaulStringFormatter, {
  type StringFormatterOptions,
} from './string.js';

export interface StringFQuoteOnlyIfNecesaryFormatterOptions
  extends StringFormatterOptions {
  separator?: string;
  eol?: string;
}

export default function stringQuoteOnlyIfNecessaryFormatter(
  opts: StringFQuoteOnlyIfNecesaryFormatterOptions = {},
): Formatter<string> {
  const quote = typeof opts.quote === 'string' ? opts.quote : '"';
  const escapedQuote =
    typeof opts.escapedQuote === 'string'
      ? opts.escapedQuote
      : `${quote}${quote}`;
  const separator = typeof opts.separator === 'string' ? opts.separator : ',';
  const eol = typeof opts.eol === 'string' ? opts.eol : '\n';

  const stringFormatter = defaulStringFormatter({ quote, escapedQuote });

  return (value) => {
    if ([quote, separator, eol].some((char) => value.includes(char))) {
      return stringFormatter(value);
    }

    return value;
  };
}
