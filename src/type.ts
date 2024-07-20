import { inspect as nodeInspect } from "node:util";
import { MethodBag, type FunctionBag } from "./function";

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

export function inspect(valueToInspect: any) {
  return nodeInspect(valueToInspect, { showProxy: true });
}

export function isA(predicateType) {
  return function (value): boolean {
    return (
      value instanceof predicateType ||
      kind(value) === predicateType ||
      (value != null && (value.constructor === predicateType || (predicateType.name === "Object" && typeof value === "object")))
    );
  };
}

export function isAbsent(value: any): boolean {
  return value == null || value == undefined;
}

export function isClass(fn: any): boolean {
  return typeof fn === "function" && /^class\s/.test(Function.prototype.toString.call(fn));
}

// true for arrays, functions, objects
export function isObject(val: any): boolean {
  return val !== null && (typeof val === "function" || typeof val === "object");
}

export function isPresent(value: any): boolean {
  return !isAbsent(value);
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

export function klass(objOrClass) {
  return Object.getPrototypeOf(objOrClass).constructor;
}

export function superclass(objOrClass) {
  return Object.getPrototypeOf(Object.getPrototypeOf(objOrClass)).constructor;
}

// export const T = buildPipeThroughFunction();
// Object.assign(T, {
//   kind,
// });

class Value<T> {
  public isWrappedValue = true;
  constructor(public value: T) {}

  //   isA(predicateType: any): boolean {
  //     return isA(predicateType)(this.value);
  //   }

  //   isAbsent(value: any) {
  //     return isAbsent(value);
  //   }

  //   isClass(value: unknown) {
  //     isClass(value);
  //   }

  //   isPresent(value: any) {
  //     return isPresent(value);
  //   }

  //   isError(value: unknown): value is Error {
  //     return isError(value);
  //   }

  //   inspect() {
  //     return inspect(this.value);
  //   }

  //   kind() {
  //     return kind(this.value);
  //   }

  //   klass() {
  //     return klass(this.value);
  //   }

  //   superclass() {
  //     return superclass(this.value);
  //   }
}

// export const V = function <T>(value: T): Value<T> {
//   return new Value(value);
// };

// Object.assign(V, {
//   isA,
//   isAbsent,
//   isClass,
//   isPresent,
//   inspect,
//   kind,
//   klass,
//   superclass,
// });

export function buildValueWrapperProxy() {
  const methods = new MethodBag();
  function func(wrappedValue) {
    // wrappedValue is the value passed to the object wrapper function. e.g. A([1,2,3]) the wrappedValue is [1,2,3] and A is the wrapper function called func in this context
    if (!isObject(wrappedValue)) {
      wrappedValue = new Value(wrappedValue);
    }
    return new Proxy(wrappedValue, {
      get(target, property, receiver) {
        // function objects, like O, don't have any properties, so the only properties present will be the function objects we assign to the 'O' function object
        const fnArityPair = methods.lookup(property.toString());
        if (fnArityPair === undefined) {
          if (target.isWrappedValue) {
            return Reflect.get(target.value, property, receiver); //  target === Value(wrappedValue)
          } else {
            return Reflect.get(target, property, receiver); //  target === wrappedValue
          }
        }
        const [fn, arity] = fnArityPair;
        return function (...args: any) {
          if (arity === 1) {
            // then we are going to treat fn as a function expecting the obj to be supplied as an argument
            if (target.isWrappedValue) {
              // console.log(`111. ${fn}.call(${inspect(receiver)}, ${inspect(target.value)})`);

              // target === Value(wrappedValue)
              return fn.call(receiver, target.value);
            } else {
              // console.log(`222. ${fn}.call(${inspect(receiver)}, ${inspect(target)})`);
              return fn.call(receiver, target);
            }
          } else {
            // otherwise, we are going to treat fn as a function expecting the args to be supplied as the argument, which will return a second function that expects the obj to be supplied as its argument
            if (target.isWrappedValue) {
              // console.log(`333. ${fn}.apply(${inspect(receiver)}, ${inspect(args)})(${inspect(target.value)})`);
              return fn.apply(receiver, args)(target.value);
            } else {
              // console.log(`444. ${fn}.apply(${inspect(receiver)}, ${inspect(args)})(${inspect(target)})`);
              return fn.apply(receiver, args)(target);
            }
          }
        };
      },
    });
  }
  Object.assign(func, {
    registerUncurriedFns(fnBag: FunctionBag) {
      return methods.registerUncurriedFns(fnBag);
    },
    registerCurriedFns(fnBag: FunctionBag) {
      return methods.registerCurriedFns(fnBag);
    },
    registerStatic(fnBag: FunctionBag) {
      return methods.registerStatic(fnBag);
    },
  });
  return new Proxy(func, {
    get(target, property, receiver) {
      const fn = methods.lookupStatic(property.toString());
      if (fn === undefined) {
        return Reflect.get(target, property, receiver); //  target === func
      }
      return fn;
    },
  });
}

export const V = buildValueWrapperProxy();
V.registerUncurriedFns({
  isAbsent,
  isClass,
  isObject,
  isPresent,
  inspect,
  kind,
  klass,
  superclass,
});
V.registerCurriedFns({ isA });
V.registerStatic({
  isA,
  isAbsent,
  isClass,
  isObject,
  isPresent,
  inspect,
  kind,
  klass,
  superclass,
});
