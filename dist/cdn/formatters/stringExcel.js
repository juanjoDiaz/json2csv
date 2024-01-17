// packages/formatters/src/stringExcel.ts
var quote = '"';
var escapedQuote = '""""';
var quoteRegExp = new RegExp(quote, "g");
function stringExcel(value) {
  return `"=""${value.replace(quoteRegExp, escapedQuote)}"""`;
}
export {
  stringExcel as default
};
