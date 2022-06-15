export function getProp(obj, path, defaultValue) {
  return obj[path] === undefined ? defaultValue : obj[path];
}
