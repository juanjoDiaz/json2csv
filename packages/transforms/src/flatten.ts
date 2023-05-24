import type Transform from './Transform.js';

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
export default function flatten<
  I extends object = object,
  O extends object = object
>({
  objects = true,
  arrays = false,
  separator = '.',
}: FlattenOptions = {}): Transform<I, O> {
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
