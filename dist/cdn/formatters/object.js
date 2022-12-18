// packages/formatters/src/object.ts
import defaulStringFormatter from "./string.js";
function objectFormatter(opts = { stringFormatter: defaulStringFormatter() }) {
  return (value) => {
    if (value === null)
      return "";
    let stringifiedValue = JSON.stringify(value);
    if (stringifiedValue === void 0)
      return "";
    if (stringifiedValue[0] === '"')
      stringifiedValue = stringifiedValue.replace(/^"(.+)"$/, "$1");
    return opts.stringFormatter(stringifiedValue);
  };
}
export {
  objectFormatter as default
};
