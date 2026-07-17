// packages/formatters/src/stringQuoteOnlyIfNecessary.ts
import defaulStringFormatter from "./string.js";
function stringQuoteOnlyIfNecessaryFormatter(opts = {}) {
  const quote = typeof opts.quote === "string" ? opts.quote : '"';
  const escapedQuote = typeof opts.escapedQuote === "string" ? opts.escapedQuote : `${quote}${quote}`;
  const separator = typeof opts.separator === "string" ? opts.separator : ",";
  const eol = typeof opts.eol === "string" ? opts.eol : "\n";
  const stringFormatter = defaulStringFormatter({ quote, escapedQuote });
  return (value) => {
    if (value.includes(quote) || value.includes(separator) || value.includes(eol)) {
      return stringFormatter(value);
    }
    return value;
  };
}
export {
  stringQuoteOnlyIfNecessaryFormatter as default
};
