import { buildPipeThroughFunction } from "./function";

export class End {
  private static _instance: End;

  private constructor() {}

  public static get instance(): End {
    if (!this._instance) {
      this._instance = new End();
    }
    return this._instance;
  }
}
export class Undefined {}
export class Null {}
export class Class {}

// export function is(predicateType) {
//   return function (value) {
//     return (
//       value instanceof predicateType ||
//       (value != null &&
//         (value.constructor === predicateType ||
//           (predicateType.name === "Object" && typeof value === "object")))
//     );
//   };
// }

export function isA(predicateType) {
  return function (value): boolean {
    return (
      value instanceof predicateType ||
      kind(value) === predicateType ||
      (value != null &&
        (value.constructor === predicateType ||
          (predicateType.name === "Object" && typeof value === "object")))
    );
  };
}

export function isClass(fn: any): boolean {
  return (
    typeof fn === "function" &&
    /^class\s/.test(Function.prototype.toString.call(fn))
  );
}

// returns Null | Undefined | Boolean | Number | BigInt | String | Symbol | Function | Class | class object
// the returned type should always have a name property
// kind(new Set()).name -> 'Set'
// kind(new Set()).name -> 'Set'
export function kind(value) {
  if (value === null) {
    return Null;
  }
  switch (typeof value) {
    case "undefined":
      return Undefined;
    case "boolean":
      return Boolean;
    case "number":
      return Number;
    case "bigint":
      return BigInt;
    case "string":
      return String;
    case "symbol":
      return Symbol;
    case "function": // matches class constructors (class objects) and functions
      if (isClass(value)) {
        return Class;
      } else {
        return value.constructor;
      }
      break;
    case "object": // matches instances of classes (e.g. arrays, ) and objects
      return value.constructor;
      break;
  }
}

// export const T = buildPipeThroughFunction();
// Object.assign(T, {
//   kind,
// });



class Value<T> {
  constructor(public value: T) {}

  isA(predicateType: any): boolean {
    return isA(predicateType)(this.value);
  }

  kind() {
    return kind(this.value);
  }
}

export const V = function <T>(value: T): Value<T> {
  return new Value(value);
};
