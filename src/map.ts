import { buildPipeThroughFunction } from "./function";

export function each<K, V>(eachFn: (pair: [K, V]) => void) {
  return function (map: Map<K, V>): void {
    map.forEach((value, key) => {
      eachFn([key, value]);
    });
  };
}

export function isEmpty<K, V>(map: Map<K, V>): boolean {
  return map.size === 0;
}

/**
 * @returns An array of the map's keys.
 *
 * ```ts
 * keys(
 *   new Map([
 *     ["foo", [1, 2, 3]],
 *     ["bar", [4, 6, 7]],
 *   ])
 * )
 * // [ 'foo', 'bar' ]
 * ```
 */
export function keys<K, V>(map: Map<K, V>): K[] {
  return Array.from(map.keys());
}

export function map<K, V, T>(mapFn: (pair: [K, V]) => [K, T]) {
  return function (map: Map<K, V>): Map<K, T> {
    const m = new Map<K, T>();
    map.forEach((value, key) => {
      const [newKey, newValue] = mapFn([key, value]);
      m.set(newKey, newValue);
    });
    return m;
  };
}

export function select<K, V>(predFn: (pair: [K, V]) => boolean) {
  return function (map: Map<K, V>): Map<K, V> {
    const newMap = new Map<K, V>();
    map.forEach((value, key) => {
      if (predFn([key, value])) {
        newMap.set(key, value);
      }
    });
    return newMap;
  };
}

export function toObject<K, V>(map: Map<K, V>): object {
  return Object.fromEntries(map.entries());
}

export function values<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values());
}

export const M = buildPipeThroughFunction();

Object.assign(M, {
  each,
  isEmpty,
  keys,
  map,
  select,
  toObject,
  values,
});

import "./all-protocols"
