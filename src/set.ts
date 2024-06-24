import { Enumerable } from "./enumerable";
import { buildPipeThroughFunction } from "./function";
import { Mappable } from "./mappable";
import { V } from "./type";

export function addAll(enumerableObj) {
  // console.log(`------------- addAll: ${V(enumerableObj).inspect()}`)
  const enumerable = Enumerable.for(enumerableObj);
  return function <T>(set: Set<T>): Set<T> {
    enumerable.each((item: T) => set.add(item));
    return set;
  };
}

export function each<V>(eachFn: (value: V) => void) {
  return function (set: Set<V>): void {
    set.forEach((value) => {
      eachFn(value);
    });
  };
}

export function isEmpty<V>(set: Set<V>): boolean {
  return set.size === 0;
}

export function map<V, T>(mapFn: (value: V) => T) {
  return function (set: Set<V>): Set<T> {
    const s = new Set<T>();
    set.forEach((value) => {
      const newValue = mapFn(value);
      s.add(newValue);
    });
    return s;
  };
}

export function toArray<V>(set: Set<V>): V[] {
  return Array.from(set.values());
}

export const S = buildPipeThroughFunction();

Object.assign(S, {
  addAll,
  each,
  isEmpty,
  map,
  toArray,
});

// protocols

class MappableSet<T, U> extends Mappable<Set<T>, T, U> {
  map(mapFn: (v: T) => U) {
    const s = new Set<U>();
    this.self.forEach((value) => {
      const newValue = mapFn(value);
      s.add(newValue);
    });
    return s;
  }
}
await Mappable.register(Set, MappableSet, true);

class EnumerableSet<T> extends Enumerable<Set<T>, T> {
  // each(visitorFn: (v: T) => any): any {
  //   return this.self.forEach((v) => visitorFn(v));
  // }
  *emit() {
    for (const e of this.self) {
      yield e;
    }
  }
}
await Enumerable.register(Set, EnumerableSet, true);
