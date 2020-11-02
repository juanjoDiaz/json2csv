'use strict';

function getProp(obj, path, defaultValue) {
  return obj[path] === undefined ? defaultValue : obj[path];
}

function setProp(obj, path, value) {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  const key = pathArray[0];
  const newValue = pathArray.length > 1 ? setProp(obj[key] || {}, pathArray.slice(1), value) : value;
  return Object.assign({}, obj, { [key]: newValue });
}

function fakeInherit(inheritingObj, parentObj) {
  let current = parentObj.prototype;
  do {
    Object.getOwnPropertyNames(current).forEach(prop => {
      if ([
        'constructor',
        '__proto__',
        '__defineGetter__',
        '__defineSetter__',
        '__lookupGetter__',
        '__lookupSetter__',
        'isPrototypeOf',
        'hasOwnProperty',
        'propertyIsEnumerable',
        'valueOf',
        'toString',
        'toLocaleString'
      ].includes(prop)) return;

      if (!inheritingObj[prop]) {
        const def = Object.getOwnPropertyDescriptor(current, prop);
        Object.defineProperty(inheritingObj, prop, Object.getOwnPropertyDescriptor(current, prop));
      }
    });
    Object.getOwnPropertySymbols(current).forEach(prop => {
      if (!inheritingObj[prop]) {
        Object.defineProperty(inheritingObj, prop, Object.getOwnPropertyDescriptor(current, prop));
      }
    });
    current = Object.getPrototypeOf(current);
  } while (current != null);
}

module.exports = {
  getProp,
  setProp,
  fakeInherit
};