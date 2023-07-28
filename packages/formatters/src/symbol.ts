import type Formatter from './Formatter.js';
import defaulStringFormatter from './string.js';

export default function symbolFormatter(
  opts = { stringFormatter: defaulStringFormatter() },
): Formatter<symbol> {
  return (value) => opts.stringFormatter(value.toString().slice(7, -1));
}
