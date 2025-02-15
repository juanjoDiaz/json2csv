type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? 'length' extends keyof T
      ? number extends T['length']
        ? number extends keyof T
          ? T[number]
          : undefined
        : undefined
      : undefined
    : undefined;

type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof Exclude<T, undefined>
    ?
        | FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right>
        | Extract<T, undefined>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : IndexedFieldWithPossiblyUndefined<T, P>;

type PropertyName = string | number | symbol;

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;

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
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ||
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
function castPath<TKey extends keyof TObject, TObject extends object>(
  path: TKey,
  obj: TObject,
): [TKey];
function castPath<TPath extends string, TObject>(
  path: TPath,
  obj: TObject,
): Exclude<GetFieldType<TObject, TPath>, null | undefined>;
function castPath<TObject extends object>(
  value: string,
  object: TObject,
): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(String(value));
}

export function getProp<TObject extends object, TKey extends keyof TObject>(
  obj: TObject,
  path: TKey,
  defaultValue: TObject[TKey],
): TObject[TKey];
export function getProp<TObject, TPath extends string>(
  obj: TObject,
  path: TPath,
): Exclude<GetFieldType<TObject, TPath>, null | undefined>;
export function getProp<
  TObject,
  TPath extends string,
  TDefault = GetFieldType<TObject, TPath>,
>(
  obj: TObject,
  path: TPath,
  defaultValue: TDefault,
): Exclude<GetFieldType<TObject, TPath>, null | undefined> | TDefault;
export function getProp<T>(
  obj: any,
  path: PropertyName,
  defaultValue?: T,
): T | undefined {
  if (path in obj) {
    const value = obj[path];
    return value === undefined ? defaultValue : value;
  }

  const processedPath = Array.isArray(path) ? path : castPath(path, obj);
  let currentValue = obj;
  for (const key of processedPath) {
    currentValue = currentValue?.[key];
    if (currentValue === undefined) return defaultValue;
  }
  return currentValue;
  // const value = obj[path];
  // return value === undefined ? defaultValue : value;
}

type PropertyPath = string | ReadonlyArray<string>;

function propertyPathToString(path: PropertyPath): ReadonlyArray<string> {
  if (typeof path === 'string') return path.split('.');
  return path;
}

export function setProp<T extends object, PT>(
  obj: T,
  path: PropertyPath,
  value: PT,
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
        {} as T,
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
    {} as T,
  );
}

export function flattenReducer<T>(acc: Array<T>, arr: Array<T> | T): Array<T> {
  try {
    // This is faster but susceptible to `RangeError: Maximum call stack size exceeded`
    if (Array.isArray(arr)) {
      acc.push(...arr);
    } else {
      acc.push(arr);
    }
    return acc;
  } catch {
    // Fallback to a slower but safer option
    return acc.concat(arr);
  }
}
