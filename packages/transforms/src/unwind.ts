import type Transform from './Transform.js';
import { getProp, setProp, unsetProp, flattenReducer } from './utils.js';

function getUnwindablePaths<T extends object>(
  obj: T,
  currentPath?: string,
): Array<string> {
  return Object.keys(obj).reduce(
    (unwindablePaths: Array<string>, key: string) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const value = obj[key as keyof T];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call((value as any).toJSON) !==
          '[object Function]' &&
        Object.keys(value).length
      ) {
        unwindablePaths = unwindablePaths.concat(
          getUnwindablePaths(value, newPath),
        );
      } else if (Array.isArray(value)) {
        unwindablePaths.push(newPath);
        unwindablePaths = unwindablePaths.concat(
          (value as Array<any>)
            .map((arrObj) => getUnwindablePaths(arrObj, newPath))
            .reduce(flattenReducer, [])
            .filter((item, index, arr) => arr.indexOf(item) !== index),
        );
      }

      return unwindablePaths;
    },
    [],
  );
}

export interface UnwindOptions {
  paths?: ReadonlyArray<string>;
  blankOut?: boolean;
}
/**
 * Performs the unwind recursively in specified sequence
 *
 * @param {String[]} unwindPaths The paths as strings to be used to deconstruct the array
 * @returns {Object => Array} Array of objects containing all rows after unwind of chosen paths
 */
export default function unwind<
  I extends object = object,
  O extends object = object,
>(opts: UnwindOptions = {}): Transform<I, O> {
  function unwindReducer<RT extends object>(
    rows: Array<RT>,
    unwindPath: string,
  ): Array<any> {
    return rows.flatMap((row) => {
      const unwindArray = getProp(row, unwindPath);

      if (!Array.isArray(unwindArray)) {
        return row;
      }

      if (!unwindArray.length) {
        return unsetProp(row, unwindPath);
      }

      const baseNewRow = opts.blankOut ? {} : row;
      const [firstRow, ...restRows] = unwindArray;
      return [
        setProp(row, unwindPath, firstRow),
        ...restRows.map((unwindRow) =>
          setProp(baseNewRow, unwindPath, unwindRow),
        ),
      ];
    });
  }

  const paths = Array.isArray(opts.paths)
    ? opts.paths
    : opts.paths
    ? [opts.paths]
    : undefined;
  return (dataRow: I) =>
    (paths || getUnwindablePaths(dataRow)).reduce(unwindReducer, [
      dataRow,
    ]) as unknown as Array<O>;
}
