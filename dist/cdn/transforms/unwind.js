// packages/transforms/src/unwind.ts
import { getProp, setProp, unsetProp } from "./utils.js";
function getUnwindablePaths(obj, currentPath, unwindablePaths = /* @__PURE__ */ new Set()) {
  return Object.keys(obj).reduce(
    (unwindablePaths2, key) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value.toJSON) !== "[object Function]" && Object.keys(value).length) {
        getUnwindablePaths(value, newPath, unwindablePaths2);
      } else if (Array.isArray(value)) {
        unwindablePaths2.add(newPath);
        for (const arrObj of value) {
          if (typeof arrObj === "object" && arrObj !== null) {
            getUnwindablePaths(arrObj, newPath, unwindablePaths2);
          }
        }
      }
      return unwindablePaths2;
    },
    unwindablePaths
  );
}
function unwind(opts = {}) {
  function unwindReducer(rows, unwindPath) {
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
        ...restRows.map(
          (unwindRow) => setProp(baseNewRow, unwindPath, unwindRow)
        )
      ];
    });
  }
  const paths = Array.isArray(opts.paths) ? opts.paths : opts.paths ? [opts.paths] : void 0;
  return (dataRow) => (paths || Array.from(getUnwindablePaths(dataRow))).reduce(unwindReducer, [
    dataRow
  ]);
}
export {
  unwind as default
};
