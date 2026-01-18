const lfRegExp = /(?<!\r)\n/g;
export function forceCrlfEol(content: string): string {
  return content.replace(lfRegExp, '\r\n');
}
const crlfRegExp = /\r\n/g;
export function forceLfEol(content: string): string {
  return content.replace(crlfRegExp, '\n');
}
