// packages/formatters/src/object.js
import defaulStringFormatter from "./string.js";
function objectFormatter(opts = { stringFormatter: defaulStringFormatter() }) {
  return (value) => {
    if (value === null)
      return "";
    value = JSON.stringify(value);
    if (value === void 0)
      return "";
    if (value[0] === '"')
      value = value.replace(/^"(.+)"$/, "$1");
    return opts.stringFormatter(value);
  };
}
export {
  objectFormatter as default
};
