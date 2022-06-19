/**
 * Function to manually make a given object inherit all the properties and methods
 * from another object.
 *
 * @param {Buffer} chunk Incoming data
 * @param {String} encoding Encoding of the incoming data. Defaults to 'utf8'
 * @param {Function} done Called when the proceesing of the supplied chunk is done
 */
export function fakeInherit(inheritingObj, parentObj) {
  let current = parentObj.prototype;
  do {
    Object.getOwnPropertyNames(current)
      .filter(
        (prop) =>
          ![
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
            'toLocaleString',
          ].includes(prop)
      )
      .forEach((prop) => {
        if (!inheritingObj[prop]) {
          Object.defineProperty(
            inheritingObj,
            prop,
            Object.getOwnPropertyDescriptor(current, prop)
          );
        }
      });
    // Bring back if we ever need to extend object with Symbol properties
    // Object.getOwnPropertySymbols(current).forEach(prop => {
    //   if (!inheritingObj[prop]) {
    //     Object.defineProperty(inheritingObj, prop, Object.getOwnPropertyDescriptor(current, prop));
    //   }
    // });
    current = Object.getPrototypeOf(current);
  } while (current != null);
}
