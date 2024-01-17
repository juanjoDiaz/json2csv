// packages/formatters/src/string.ts
function stringFormatter(opts = {}) {
  const quote = typeof opts.quote === "string" ? opts.quote : '"';
  const escapedQuote = typeof opts.escapedQuote === "string" ? opts.escapedQuote : `${quote}${quote}`;
  if (!quote || quote === escapedQuote) {
    return (value) => value;
  }
  const quoteRegExp = new RegExp(quote, "g");
  return (value) => {
    if (value.includes(quote)) {
      value = value.replace(quoteRegExp, escapedQuote);
    }
    return `${quote}${value}${quote}`;
  };
}
export {
  stringFormatter as default
};
