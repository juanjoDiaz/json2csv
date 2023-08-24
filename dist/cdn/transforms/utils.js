// packages/transforms/src/utils.ts
function propertyPathToString(path) {
  if (typeof path === "string")
    return path.split(".");
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
    return Object.keys(obj).filter((prop) => prop !== key).reduce(
      (acc, prop) => ({ ...acc, [prop]: obj[prop] }),
      {}
    );
  }
  return Object.keys(obj).reduce(
    (acc, prop) => ({
      ...acc,
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
