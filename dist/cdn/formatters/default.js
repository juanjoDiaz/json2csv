// packages/formatters/src/default.js
function defaultFormatter(value) {
  if (value === null || value === void 0)
    return "";
  return `${value}`;
}
export {
  defaultFormatter as default
};
