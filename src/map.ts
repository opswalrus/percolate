import { Enumerable } from "./enumerable";
import { buildPipeThroughFunction } from "./function";
import { AsyncMappable, Mappable } from "./mappable";

export function each<K, V>(eachFn: ([K, V]) => void) {
  return function (map: Map<K, V>): void {
    map.forEach((value, key) => {
      eachFn([key, value]);
    });
  };
}

export function keys<K, V>(map: Map<K, V>): K[] {
  return Array.from(map.keys());
}

export function map<K, V, T>(mapFn: ([K, V]) => [K, T]) {
  return function (map: Map<K, V>): Map<K, T> {
    const m = new Map<K, T>();
    map.forEach((value, key) => {
      const [newKey, newValue] = mapFn([key, value]);
      m.set(newKey, newValue);
    });
    return m;
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
  keys,
  map,
  toObject,
  values,
});

// export const M = {
//   each,
//   keys,
//   map,
//   toObject,
//   values,
// };

// protocols

export class MapToMap<K, V, T, U> extends Mappable<Map<K, V>, [K, V], [T, U]> {
  map(mapFn: ([K, V]) => [T, U]) {
    const m = new Map<T, U>();
    this.self.forEach((value, key) => {
      const [newKey, newValue] = mapFn([key, value]);
      m.set(newKey, newValue);
    });
    return m;
  }
}

export class MapToArray<K, V, T> extends Mappable<Map<K, V>, [K, V], T> {
  map(mapFn: ([K, V]) => T) {
    const arr: T[] = [];
    this.self.forEach((value, key) => {
      const mappedValue = mapFn([key, value]);
      arr.push(mappedValue);
    });
    return arr;
  }
}

Mappable.register(Map, MapToMap, true);
Mappable.register(Map, MapToArray);

export class AsyncMapToMap<K, V, T, U> extends AsyncMappable<Map<K, V>, [K, V], [T, U]> {
  async map(mapFn: ([K, V]) => Promise<[T, U]>) {
    const m = new Map<T, U>();
    for await (const [key, value] of this.self) {
      const [newKey, newValue] = await mapFn([key, value]);
      m.set(newKey, newValue);
    };
    return m;
  }
}

export class AsyncMapToArray<K, V, T> extends AsyncMappable<Map<K, V>, [K, V], T> {
  async map(mapFn: ([K, V]) => Promise<T>) {
    const arr: T[] = [];
    for await (const [key, value] of this.self) {
      const mappedValue = await mapFn([key, value]);
      arr.push(mappedValue);
    };
    return arr;
  }
}

AsyncMappable.register(Map, AsyncMapToMap, true);
AsyncMappable.register(Map, AsyncMapToArray);

class EnumerablePair<K, V> extends Enumerable<Map<K, V>, [K, V]> {
  // each(visitorFn: ([K, V]) => any) {
  //   return this.self.forEach((v, k) => visitorFn([k, v]));
  // }
  *emit(): Generator<[K, V]> {
    for (const [k, v] of this.self.entries()) {
      yield [k, v];
    }
  }
}

class EnumerableKey<K, V> extends Enumerable<Map<K, V>, K> {
  // each(visitorFn: (K) => any) {
  //   return this.self.forEach((v, k) => visitorFn(k));
  // }
  *emit() {
    for (const k of this.self.keys()) {
      yield k;
    }
  }
}

class EnumerableValue<K, V> extends Enumerable<Map<K, V>, V> {
  // each(visitorFn: (V) => any): any {
  //   return this.self.forEach((v, k) => visitorFn(v));
  // }
  *emit() {
    for (const v of this.self.values()) {
      yield v;
    }
  }
}

Enumerable.register(Map, EnumerablePair, true);
Enumerable.register(Map, EnumerableKey);
Enumerable.register(Map, EnumerableValue);
