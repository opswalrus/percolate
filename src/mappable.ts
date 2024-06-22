import { Protocol } from "./protocol";

export class Mappable<S, T, U> extends Protocol {
  constructor(public self: S) {
    super();
  }

  map(mapFn: (v: T) => U): any {
    throw new Error("not implemented");
  }
}

export function map<T, U>(mapFn: (v: T) => U) {
  return function (mappableObj, implClass?) {
    return Mappable.for(mappableObj, implClass).map(mapFn);
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
  return async function (mappableObj, implClass?) {
    return await AsyncMappable.for(mappableObj, implClass).map(mapFn);
  };
}
