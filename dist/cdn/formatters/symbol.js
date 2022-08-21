// packages/formatters/src/symbol.js
import defaulStringFormatter from "./string.js";
function symbolFormatter(opts = { stringFormatter: defaulStringFormatter() }) {
  return (value) => opts.stringFormatter(value.toString().slice(7, -1));
}
export {
  symbolFormatter as default
};
