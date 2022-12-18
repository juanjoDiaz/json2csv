const quote = '"';
const escapedQuote = '""""';

export default function stringExcel(value: string) {
  return `"=""${value.replace(new RegExp(quote, 'g'), escapedQuote)}"""`;
}
