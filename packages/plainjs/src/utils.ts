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

const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g',
);

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
function castPath(value: string): string[] {
  const result: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = rePropName.exec(value))) {
    result.push(match[3] ?? match[1]?.trim() ?? match[0]);
  }
  return result;
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
