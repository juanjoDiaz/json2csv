// packages/formatters/src/stringExcel.ts
var quote = '"';
var escapedQuote = '""""';
function stringExcel(value) {
  return `"=""${value.replace(new RegExp(quote, "g"), escapedQuote)}"""`;
}
export {
  stringExcel as default
};
