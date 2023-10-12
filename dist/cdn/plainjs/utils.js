// packages/plainjs/src/utils.ts
var rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  `[^.[\\]]+|\\[(?:([^"'][^[]*)|(["'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))`,
  "g"
);
function castPath(value) {
  var _a, _b, _c;
  const result = [];
  let match;
  while (match = rePropName.exec(value)) {
    result.push((_c = (_b = match[3]) != null ? _b : (_a = match[1]) == null ? void 0 : _a.trim()) != null ? _c : match[0]);
  }
  return result;
}
function getProp(obj, path, defaultValue) {
  if (path in obj) {
    const value = obj[path];
    return value === void 0 ? defaultValue : value;
  }
  const processedPath = Array.isArray(path) ? path : castPath(path, obj);
  let currentValue = obj;
  for (const key of processedPath) {
    currentValue = currentValue == null ? void 0 : currentValue[key];
    if (currentValue === void 0)
      return defaultValue;
  }
  return currentValue;
}
function flattenReducer(acc, arr) {
  try {
    Array.isArray(arr) ? acc.push(...arr) : acc.push(arr);
    return acc;
  } catch (err) {
    return acc.concat(arr);
  }
}
function fastJoin(arr, separator) {
  let isFirst = true;
  return arr.reduce((acc, elem) => {
    if (elem === null || elem === void 0) {
      elem = "";
    }
    if (isFirst) {
      isFirst = false;
      return `${elem}`;
    }
    return `${acc}${separator}${elem}`;
  }, "");
}
export {
  fastJoin,
  flattenReducer,
  getProp
};
