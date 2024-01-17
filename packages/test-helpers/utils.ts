const lfRegExp = new RegExp('(?<!\r)\n', 'g');
export function forceCrlfEol(content: string): string {
  // eslint-disable-next-line no-control-regex
  return content.replace(lfRegExp, '\r\n');
}
const crlfRegExp = new RegExp('\r\n', 'g');
export function forceLfEol(content: string): string {
  // eslint-disable-next-line no-control-regex
  return content.replace(crlfRegExp, '\n');
}
