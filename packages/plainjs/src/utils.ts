type PropertyName = string | number | symbol;
type PropertyPath = ReadonlyArray<PropertyName>;

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const emptyObject = Object.create(null);

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey<TObject extends object>(value: any, object: TObject): boolean {
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean' ||
    value == null
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
function stringToPath(string: string): string[] {
  const result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, (match, number, quote, subString) => {
    result.push(
      quote ? subString.replace(reEscapeChar, '$1') : number || match,
    );
    return match;
  });
  return result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(
  value: PropertyName | PropertyPath,
  object: object,
): PropertyPath {
  if (Array.isArray(value)) {
    return value;
  }
  const propertyName = value as PropertyName;
  return isKey(propertyName, object)
    ? [propertyName]
    : stringToPath(String(propertyName));
}

function getPropByPath<T>(
  obj: any,
  path: PropertyPath,
  defaultValue?: T,
): T | undefined {
  let currentValue = obj;
  for (const key of path) {
    currentValue = currentValue?.[key];
    if (currentValue === undefined) return defaultValue;
  }
  return currentValue;
}

export function getPropGetter<TObject extends object>(
  path: string,
  defaultValue?: unknown,
): (obj: TObject) => unknown {
  const processedPath = castPath(path, emptyObject);

  if (processedPath.length === 1 && processedPath[0] === path) {
    return (obj) => {
      const value = (obj as any)[path];
      return value === undefined ? defaultValue : value;
    };
  }

  return (obj) => {
    if (path in obj) {
      const value = (obj as any)[path];
      return value === undefined ? defaultValue : value;
    }

    return getPropByPath(obj, processedPath, defaultValue);
  };
}

export function flattenReducer<T>(acc: Array<T>, arr: Array<T> | T): Array<T> {
  if (Array.isArray(arr)) {
    for (const item of arr) acc.push(item);
  } else {
    acc.push(arr);
  }
  return acc;
}

export function fastJoin<T>(arr: Array<T>, separator: string): string {
  let isFirst = true;
  return arr.reduce((acc, elem) => {
    if (elem === null || elem === undefined) {
      elem = '' as T;
    }

    if (isFirst) {
      isFirst = false;
      return `${elem}`;
    }

    return `${acc}${separator}${elem}`;
  }, '');
}
