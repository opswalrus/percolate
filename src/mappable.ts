import { Protocol } from "./protocol";

/**
 * The interpretation of the generic type parameters is:
 * S is the self type. For example: T[]
 *
 * T is the element type that is being iterated over from the self type, S.
 * For example, when S is T[], then the element type is likely going to be T.
 *
 * U is the type that we are transforming T into.
 * For example, when S is T[], then the element type is likely going to be T,
 * and the mapping function from T -> U means that the transformation type is U.
 */
export class Mappable<S, T, U> extends Protocol {
  constructor(public self: S) {
    super();
  }

  map(mapFn: (v: T) => U): any {
    throw new Error("not implemented");
  }
}

export function map<T, U>(mapFn: (v: T) => U) {
  return function (mappableVal, implClass?) {
    return Mappable.for(mappableVal, implClass).map(mapFn);
  };
}

export class AsyncMappable<S, T, U> extends Protocol {
  constructor(public self: S) {
    super();
  }

  async map(mapFn: (v: T) => Promise<U>): Promise<any> {
    throw new Error("not implemented");
  }
}

export function asyncMap<T, U>(mapFn: (v: T) => Promise<U>) {
  return async function (mappableVal, implClass?) {
    return await AsyncMappable.for(mappableVal, implClass).map(mapFn);
  };
}
