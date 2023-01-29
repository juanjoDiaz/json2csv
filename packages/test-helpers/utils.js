export function forceCrlfEol(content) {
  // eslint-disable-next-line no-control-regex
  return content.replace(new RegExp('(?<!\r)\n', 'g'), '\r\n');
}

export function forceLfEol(content) {
  // eslint-disable-next-line no-control-regex
  return content.replace(new RegExp('\r\n', 'g'), '\n');
}
