import { Protocol } from "./protocol";

export class Equal<S> extends Protocol {
  constructor(public self: S) {
    super();
  }

  equal(val: S): boolean {
    throw new Error("equal not implemented");
  }

  notEqual(val: S): boolean {
    return !this.equal(val);
  }

  eq(val: S): boolean {
    return this.equal(val);
  }

  neq(val: S): boolean {
    return this.notEqual(val);
  }
}

export function equal<T>(self: T, other: T, implClass?) {
  return Equal.for(self, implClass).equal(other);
}

export function notEqual<T>(self: T, other: T, implClass?) {
  return Equal.for(self, implClass).notEqual(other);
}

export function eq<T>(self: T, other: T, implClass?) {
  return Equal.for(self, implClass).equal(other);
}

export function neq<T>(self: T, other: T, implClass?) {
  return Equal.for(self, implClass).neq(other);
}
