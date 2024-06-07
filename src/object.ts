import { buildPipeThroughFunction } from "./function";

export function each<V>(eachFn: ([string, V]) => void) {
  return function (object): void {
    Object.entries<V>(object).forEach((kvPair) => {
      eachFn(kvPair);
    });
  };
}

export function keys(object): string[] {
  return Object.keys(object);
}

export function map<V, T>(mapFn: ([string, V]) => [string, T]) {
  return function (object): object {
    const obj = {};
    Object.entries<V>(object).forEach((kvPair) => {
      const [newKey, newValue] = mapFn(kvPair);
      obj[newKey] = newValue;
    });
    return obj;
  };
}

export function pick(keys: Set<string>) {
  return select(([key, _]) => keys.has(key));
}

export function select<V>(predFn: ([string, V]) => boolean) {
  return function (object): object {
    const obj = {};
    Object.entries<V>(object).forEach((kvPair) => {
      if (predFn(kvPair)) {
        const [k, v] = kvPair;
        obj[k] = v;
      }
    });
    return obj;
  };
}

export function toMap<V>(object): Map<string, V> {
  return new Map(Object.entries<V>(object));
}

export function values<V>(object): V[] {
  return Object.values<V>(object);
}

export const O = buildPipeThroughFunction();

Object.assign(O, {
  each, // (eachFn)(obj) => ...
  keys, // (obj) => ...
  map,
  pick,
  select,
  toMap,
  values,
});
