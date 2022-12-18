// packages/formatters/src/number.ts
function numberFormatter(opts = {}) {
  const { separator, decimals } = opts;
  if (separator) {
    if (decimals) {
      return (value) => value.toFixed(decimals).replace(".", separator);
    }
    return (value) => `${value}`.replace(".", separator);
  }
  if (decimals) {
    return (value) => value.toFixed(decimals);
  }
  return (value) => `${value}`;
}
export {
  numberFormatter as default
};
