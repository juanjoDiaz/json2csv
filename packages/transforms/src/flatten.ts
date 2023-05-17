import type Transform from './Transform.js';

// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
// type FlattenedObject<T, K extends keyof T> = UnionToIntersection<T[K]>;

// type B = { c: number}
// type A = { b: B}
// interface Test { a: A }

// var r = flatten<Test>()({ a: { b: { c: 1 } }})
// console.log(r)

// type FlattenObjectKeys<
//   T extends { [key: string]: unknown; },
//   Key = keyof T
// > = Key extends string
//   ? T[Key] extends { [key: string]: unknown; }
//     ? `${Key}.${FlattenObjectKeys<T[Key]>}`
//     : `${Key}`
//   : never;

export interface FlattenOptions {
  objects?: boolean | undefined;
  arrays?: boolean | undefined;
  separator?: string | undefined;
}

/**
 * Performs the flattening of a data row recursively
 *
 * @param {String} separator Separator to be used as the flattened field name
 * @returns {Object => Object} Flattened object
 */
export default function flatten<I extends object = object>({
  objects = true,
  arrays = false,
  separator = '.',
}: FlattenOptions = {}): Transform<I, any> {
  function step<T extends object, FT extends object>(
    obj: T,
    flatDataRow: FT,
    currentPath?: string
  ): FT {
    Object.keys(obj).forEach((key) => {
      const newPath = currentPath ? `${currentPath}${separator}${key}` : key;
      const value = obj[key as keyof T];

      if (
        objects &&
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call((value as any).toJSON) !==
          '[object Function]' &&
        Object.keys(value).length
      ) {
        step(value, flatDataRow, newPath);
        return;
      }

      if (arrays && Array.isArray(value)) {
        step(value, flatDataRow, newPath);
        return;
      }

      (flatDataRow[newPath as keyof FT] as any) = value;
    });

    return flatDataRow;
  }

  return (dataRow: I) => step<I, any>(dataRow, {});
}
