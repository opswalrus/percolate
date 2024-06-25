import { Enumerable } from "./enumerable";
import { M } from "./map";
import { Mappable, AsyncMappable } from "./mappable";
import { Selectable } from "./selectable";

export class MapToMap<K, V, T, U> extends Mappable<Map<K, V>, [K, V], [T, U]> {
  map(mapFn: (pair: [K, V]) => [T, U]) {
    const m = new Map<T, U>();
    this.self.forEach((value, key) => {
      const [newKey, newValue] = mapFn([key, value]);
      m.set(newKey, newValue);
    });
    return m;
  }
}

export class MapToArray<K, V, T> extends Mappable<Map<K, V>, [K, V], T> {
  map(mapFn: (pair: [K, V]) => T) {
    const arr: T[] = [];
    this.self.forEach((value, key) => {
      const mappedValue = mapFn([key, value]);
      arr.push(mappedValue);
    });
    return arr;
  }
}

await Mappable.register(Map, MapToMap, true);
await Mappable.register(Map, MapToArray);

export class AsyncMapToMap<K, V, T, U> extends AsyncMappable<
  Map<K, V>,
  [K, V],
  [T, U]
> {
  async map(mapFn: (pair: [K, V]) => Promise<[T, U]>) {
    const m = new Map<T, U>();
    for await (const [key, value] of this.self) {
      const [newKey, newValue] = await mapFn([key, value]);
      m.set(newKey, newValue);
    }
    return m;
  }
}

export class AsyncMapToArray<K, V, T> extends AsyncMappable<
  Map<K, V>,
  [K, V],
  T
> {
  async map(mapFn: (pair: [K, V]) => Promise<T>) {
    const arr: T[] = [];
    for await (const [key, value] of this.self) {
      const mappedValue = await mapFn([key, value]);
      arr.push(mappedValue);
    }
    return arr;
  }
}

await AsyncMappable.register(Map, AsyncMapToMap, true);
await AsyncMappable.register(Map, AsyncMapToArray);

class EnumerablePair<K, V> extends Enumerable<Map<K, V>, [K, V]> {
  *emit(): Generator<[K, V]> {
    for (const [k, v] of this.self.entries()) {
      yield [k, v];
    }
  }
}

class EnumerableKey<K, V> extends Enumerable<Map<K, V>, K> {
  *emit() {
    for (const k of this.self.keys()) {
      yield k;
    }
  }
}

class EnumerableValue<K, V> extends Enumerable<Map<K, V>, V> {
  *emit() {
    for (const v of this.self.values()) {
      yield v;
    }
  }
}

await Enumerable.register(Map, EnumerablePair, true);
await Enumerable.register(Map, EnumerableKey);
await Enumerable.register(Map, EnumerableValue);

export class SelectableMap<K, V> extends Selectable<Map<K, V>, [K, V]> {
  select(predFn: (v: [K, V]) => boolean): Map<K, V> {
    return M(this.self).select(predFn);
  }
}
await Selectable.register(Map, SelectableMap, true);
