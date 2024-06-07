import { compact } from "./compactable";
import { Enumerable, each } from "./enumerable";
import { M } from "./map";
import { asyncMap, map } from "./mappable";

class Pipe {
  constructor(public value: any) {}

  compact(...args) {
    this.value = compact(...args)(this.value);
    return this;
  }

  each(visitorFn) {
    this.value = each(visitorFn)(this.value);
    return this;
  }

  // enumerable() {
  //   this.value = Enumerable.for(this.value);
  //   return this;
  // }

  // enumerator() {
  //   this.value = Enumerator.for(this.value);
  //   return this;
  // }

  map(mapFn, implClass?) {
    this.value = map(mapFn)(this.value, implClass);
    return this;
  }

  asyncMap(mapFn, implClass?) {
    this.value = asyncMap(mapFn)(this.value, implClass);
    return this;
  }

  // get m() {
  //   this.value = M(this.value)
  //   return this;
  // }

  pipe(fn) {
    this.value = fn(this.value);
    return this;
  }

  toArray() {
    this.value = Enumerable.for(this.value).toArray();
    return this;
  }

  waitAll() {
    this.value = Promise.all(this.value)
    return this;
  }
}

export const P = function (initial) {
  return new Pipe(initial);
};

// P([1,2,3,4]).map(v => v * 2).compact().value
