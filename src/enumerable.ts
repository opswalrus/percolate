import { Protocol } from "./protocol";
import { Enumerator } from "./enumerator";

export type ImplementsEnumerable = {}

export class Enumerable<S, T> extends Protocol {
  static each = each

  constructor(public self: S) {
    super();
  }

  each(visitorFn: (v: T) => any) {
    return this.toEnumerator().each(visitorFn);
  }

  *emit(): Generator<T> {
    throw "emit not implemented";
  }

  toArray(): T[] {
    return this.toEnumerator().toArray()
  }

  toEnumerator(): Enumerator<T> {
    return Enumerator.for(this.emit());
  }
}

export function each<T>(visitorFn: (v: T) => any) {
  return function (enumerableObj, implClass?) {
    return Enumerable.for(enumerableObj, implClass).each(visitorFn);
  };
}
