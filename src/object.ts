import { buildWrapperProxy } from "./function";

export function each<V>(eachFn: (pair: [string, V]) => void) {
  return function (object: { [s: string]: V }): void {
    Object.entries<V>(object).forEach((kvPair) => {
      eachFn(kvPair);
    });
  };
}

export function keys<V>(object: { [s: string]: V }): string[] {
  return Object.keys(object);
}

export function map<V, T>(mapFn: (pair: [string, V]) => [string, T]) {
  return function (object: { [s: string]: V }): object {
    const obj: { [s: string]: T } = {};
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

export function select<V>(predFn: (pair: [string, V]) => boolean) {
  return function (object: { [s: string]: V }): object {
    const obj: { [s: string]: V } = {};
    Object.entries<V>(object).forEach((kvPair) => {
      if (predFn(kvPair)) {
        const [k, v] = kvPair;
        obj[k] = v;
      }
    });
    return obj;
  };
}

export function toMap<V>(object: { [s: string]: V }): Map<string, V> {
  return new Map(Object.entries<V>(object));
}

export function values<V>(object: { [s: string]: V }): V[] {
  return Object.values<V>(object);
}

// const _O = buildPipeThroughFunction();

// Object.assign(_O, {
//   each, // (eachFn)(obj) => ...
//   keys, // (obj) => ...
//   map,
//   pick,
//   select,
//   toMap,
//   values,
// });

// export const O = _O;

export const O = buildWrapperProxy();
O.registerUncurriedFns({ keys, toMap, values });
O.registerCurriedFns({ each, map, pick, select });
O.registerStatic({
  each, // (eachFn)(obj) => ...
  keys, // (obj) => ...
  map,
  pick,
  select,
  toMap,
  values,
});

import "./all-protocols";
