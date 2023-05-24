type PropertyPath = string | ReadonlyArray<string>;

function propertyPathToString(path: PropertyPath): ReadonlyArray<string> {
  if (typeof path === 'string') return path.split('.');
  return path;
}

export function setProp<T extends object, PT>(
  obj: T,
  path: PropertyPath,
  value: PT
): T {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;
  return {
    ...obj,
    [key]:
      pathArray.length > 1
        ? setProp(obj[key as keyof T] || {}, restPath, value)
        : value,
  };
}

export function unsetProp<T extends object>(obj: T, path: PropertyPath): T {
  const pathArray = propertyPathToString(path);
  const [key, ...restPath] = pathArray;

  // This will never be hit in the current code because unwind does the check before calling unsetProp
  /* c8 ignore next */
  if (typeof obj[key as keyof T] !== 'object') {
    return obj;
  }

  if (pathArray.length === 1) {
    return Object.keys(obj)
      .filter((prop) => prop !== key)
      .reduce(
        (acc, prop) => ({ ...acc, [prop]: obj[prop as keyof T] }),
        {} as T
      );
  }

  return Object.keys(obj).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]:
        prop !== key
          ? obj[prop as keyof T]
          : unsetProp(obj[key as keyof T] as object, restPath),
    }),
    {} as T
  );
}

export function flattenReducer<T>(acc: Array<T>, arr: Array<T> | T): Array<T> {
  try {
    // This is faster but susceptible to `RangeError: Maximum call stack size exceeded`
    Array.isArray(arr) ? acc.push(...arr) : acc.push(arr);
    return acc;
  } catch (err: unknown) {
    // Fallback to a slower but safer option
    return acc.concat(arr);
  }
}
