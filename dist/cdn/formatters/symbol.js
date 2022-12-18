// packages/formatters/src/symbol.ts
import defaulStringFormatter from "./string.js";
function symbolFormatter(opts = { stringFormatter: defaulStringFormatter() }) {
  return (value) => opts.stringFormatter(value.toString().slice(7, -1));
}
export {
  symbolFormatter as default
};
