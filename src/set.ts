import { Enumerable } from "./enumerable";
import { buildPipeThroughFunction } from "./function";

export function addAll(enumerableVal) {
  // console.log(`------------- addAll: ${V(enumerableVal).inspect()}`)
  const enumerable = Enumerable.for(enumerableVal);
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

export function intersection(enumerableVal) {
  const enumerable = Enumerable.for(enumerableVal);
  return function <T>(set: Set<T>): Set<T> {
    return set.intersection(enumerable.toSet());
  };
}

export function isEmpty<V>(set: Set<V>): boolean {
  return set.size === 0;
}

export function isSubsetOf(enumerableSuperset) {
  const enumerable = Enumerable.for(enumerableSuperset);
  return function <T>(set: Set<T>): Set<T> {
    return set.isSubsetOf(enumerable.toSet());
  };
}

export function isSupersetOf(enumerableSubset) {
  const enumerable = Enumerable.for(enumerableSubset);
  return function <T>(set: Set<T>): Set<T> {
    return set.isSupersetOf(enumerable.toSet());
  };
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

export function union(enumerableVal) {
  const enumerable = Enumerable.for(enumerableVal);
  return function <T>(set: Set<T>): Set<T> {
    return set.union(enumerable.toSet());
  };
}

export const S = buildPipeThroughFunction();

Object.assign(S, {
  addAll,
  each,
  intersection,
  isEmpty,
  isSubsetOf,
  isSupersetOf,
  map,
  toArray,
  union,
});

import "./all-protocols"
