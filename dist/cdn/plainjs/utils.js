// packages/plainjs/src/utils.ts
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var emptyObject = /* @__PURE__ */ Object.create(null);
function isKey(value, object) {
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (type === "number" || type === "symbol" || type === "boolean" || value == null) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
function stringToPath(string) {
  const result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, (match, number, quote, subString) => {
    result.push(
      quote ? subString.replace(reEscapeChar, "$1") : number || match
    );
    return match;
  });
  return result;
}
function castPath(value, object) {
  if (Array.isArray(value)) {
    return value;
  }
  const propertyName = value;
  return isKey(propertyName, object) ? [propertyName] : stringToPath(String(propertyName));
}
function getPropByPath(obj, path, defaultValue) {
  let currentValue = obj;
  for (const key of path) {
    currentValue = currentValue == null ? void 0 : currentValue[key];
    if (currentValue === void 0) return defaultValue;
  }
  return currentValue;
}
function getPropGetter(path, defaultValue) {
  const processedPath = castPath(path, emptyObject);
  if (processedPath.length === 1 && processedPath[0] === path) {
    return (obj) => {
      const value = obj[path];
      return value === void 0 ? defaultValue : value;
    };
  }
  return (obj) => {
    if (path in obj) {
      const value = obj[path];
      return value === void 0 ? defaultValue : value;
    }
    return getPropByPath(obj, processedPath, defaultValue);
  };
}
function getProp(obj, path, defaultValue) {
  if (path in obj) {
    const value = obj[path];
    return value === void 0 ? defaultValue : value;
  }
  return getPropByPath(obj, castPath(path, obj), defaultValue);
}
function flattenReducer(acc, arr) {
  try {
    if (Array.isArray(arr)) {
      acc.push(...arr);
    } else {
      acc.push(arr);
    }
    return acc;
  } catch {
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
  getProp,
  getPropGetter
};
