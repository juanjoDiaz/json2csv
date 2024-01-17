const quote = '"';
const escapedQuote = '""""';

const quoteRegExp = new RegExp(quote, 'g');
export default function stringExcel(value: string) {
  return `"=""${value.replace(quoteRegExp, escapedQuote)}"""`;
}
