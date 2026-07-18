// packages/transforms/src/utils.ts
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
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
  return isKey(value, object) ? [value] : stringToPath(String(value));
}
var MAX_PATH_CACHE_SIZE = 500;
var pathCache = /* @__PURE__ */ new Map();
function castPathCached(value, object) {
  const cached = pathCache.get(value);
  if (cached !== void 0) return cached;
  const processedPath = castPath(String(value), object);
  if (pathCache.size >= MAX_PATH_CACHE_SIZE) pathCache.clear();
  pathCache.set(value, processedPath);
  return processedPath;
}
function getProp(obj, path, defaultValue) {
  if (path in obj) {
    const value = obj[path];
    return value === void 0 ? defaultValue : value;
  }
  const processedPath = Array.isArray(path) ? path : castPathCached(path, obj);
  let currentValue = obj;
  for (const key of processedPath) {
    currentValue = currentValue == null ? void 0 : currentValue[key];
    if (currentValue === void 0) return defaultValue;
  }
  return currentValue;
}
function propertyPathToString(path) {
  if (typeof path === "string") return path.split(".");
  return path;
}
function setProp(obj, path, value) {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;
  return {
    ...obj,
    [key]: pathArray.length > 1 ? setProp(obj[key] || {}, restPath, value) : value
  };
}
function unsetProp(obj, path) {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;
  if (typeof obj[key] !== "object") {
    return obj;
  }
  if (pathArray.length === 1) {
    return Object.fromEntries(
      Object.entries(obj).filter(([prop]) => prop !== key)
    );
  }
  return Object.fromEntries(
    Object.entries(obj).map(([prop, value]) => [
      prop,
      prop !== key ? value : unsetProp(value, restPath)
    ])
  );
}
function flattenReducer(acc, arr) {
  if (Array.isArray(arr)) {
    for (const item of arr) acc.push(item);
  } else {
    acc.push(arr);
  }
  return acc;
}
export {
  flattenReducer,
  getProp,
  setProp,
  unsetProp
};
