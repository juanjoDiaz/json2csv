function forceCrlfEol(content) {
  // eslint-disable-next-line no-control-regex
  return content.replace(new RegExp('(?<!\r)\n', 'g'), '\r\n')
}

function forceLfEol(content) {
  // eslint-disable-next-line no-control-regex
  return content.replace(new RegExp('\r\n', 'g'), '\n')
}

module.exports = {
  forceCrlfEol,
  forceLfEol
};