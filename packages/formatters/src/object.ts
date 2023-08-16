import type Formatter from './Formatter.js';
import defaulStringFormatter from './string.js';

export default function objectFormatter<T extends object>(
  opts = { stringFormatter: defaulStringFormatter() },
): Formatter<T> {
  return (value: T) => {
    if (value === null) return '';

    let stringifiedValue = JSON.stringify(value);

    if (stringifiedValue === undefined) return '';

    if (stringifiedValue[0] === '"')
      stringifiedValue = stringifiedValue.replace(/^"(.+)"$/, '$1');

    return opts.stringFormatter(stringifiedValue);
  };
}
