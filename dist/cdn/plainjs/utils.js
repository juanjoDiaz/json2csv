// packages/plainjs/src/utils.ts
function getProp(obj, path, defaultValue) {
  const value = obj[path];
  return value === void 0 ? defaultValue : value;
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
