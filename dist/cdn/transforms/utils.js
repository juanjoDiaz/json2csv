var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// packages/transforms/src/utils.ts
function propertyPathToString(path) {
  if (typeof path === "string")
    return path.split(".");
  return path;
}
function setProp(obj, path, value) {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;
  return __spreadProps(__spreadValues({}, obj), {
    [key]: pathArray.length > 1 ? setProp(obj[key] || {}, restPath, value) : value
  });
}
function unsetProp(obj, path) {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;
  if (typeof obj[key] !== "object") {
    return obj;
  }
  if (pathArray.length === 1) {
    return Object.keys(obj).filter((prop) => prop !== key).reduce(
      (acc, prop) => __spreadProps(__spreadValues({}, acc), { [prop]: obj[prop] }),
      {}
    );
  }
  return Object.keys(obj).reduce(
    (acc, prop) => __spreadProps(__spreadValues({}, acc), {
      [prop]: prop !== key ? obj[prop] : unsetProp(obj[key], restPath)
    }),
    {}
  );
}
function flattenReducer(acc, arr) {
  try {
    Array.isArray(arr) ? acc.push(...arr) : acc.push(arr);
    return acc;
  } catch (err) {
    return acc.concat(arr);
  }
}
export {
  flattenReducer,
  setProp,
  unsetProp
};
