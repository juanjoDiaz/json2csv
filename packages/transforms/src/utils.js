export function setProp(obj, path, value) {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  const [key, ...restPath] = pathArray;
  return {
    ...obj,
    [key]:
      pathArray.length > 1 ? setProp(obj[key] || {}, restPath, value) : value,
  };
}

export function unsetProp(obj, path) {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  const [key, ...restPath] = pathArray;

  // This will never be hit in the current code because unwind does the check before calling unsetProp
  /* c8 ignore next */
  if (typeof obj[key] !== 'object') {
    return obj;
  }

  if (pathArray.length === 1) {
    return Object.keys(obj)
      .filter((prop) => prop !== key)
      .reduce((acc, prop) => ({ ...acc, [prop]: obj[prop] }), {});
  }

  return Object.keys(obj).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: prop !== key ? obj[prop] : unsetProp(obj[key], restPath),
    }),
    {}
  );
}
