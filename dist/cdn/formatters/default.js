// packages/formatters/src/default.ts
function defaultFormatter(value) {
  if (value === null || value === void 0)
    return "";
  return `${value}`;
}
export {
  defaultFormatter as default
};
