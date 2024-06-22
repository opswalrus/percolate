import { Compactable } from "./compactable";
import { Enumerable } from "./enumerable";
import { buildPipeThroughFunction, identity } from "./function";
import { AsyncMappable, Mappable } from "./mappable";
import { Selectable } from "./selectable";

export function compact(omit: any[] = [null, undefined]) {
  return function (arr: any[]): any {
    const omitSet = toSet(omit);
    const newArr: any[] = [];
    for (const val of arr) {
      if (!omitSet.has(val)) {
        newArr.push(val);
      }
    }
    return newArr;
  };
}

export function concat<T>(tail: T[]) {
  return function (arr: T[]): T[] {
    return arr.concat(tail);
  };
}

export function each<T>(eachFn: (value: T) => void) {
  return function (arr: Array<T>): void {
    arr.forEach((value) => {
      eachFn(value);
    });
  };
}

export function first<T>(predicateFn: (v: T) => any) {
  return function (arr: Array<T>): T | undefined {
    for (const val of arr) {
      if (predicateFn(val)) {
        return val;
      }
    }
    return undefined;
  };
}

export function isEmpty<T>(arr: Array<T>): boolean {
  return arr.length === 0;
}

export function join(separator?: string) {
  return function <T>(arr: T[]): string {
    return arr.join(separator);
  };
}

export function map<T, U>(mapFn: (value: T) => U) {
  return function (arr: Array<T>): Array<U> {
    return arr.map(mapFn);
  };
}

export function nth(n: number) {
  return function <T>(arr: T[]): T | undefined {
    return arr[n];
  };
}

export function select<T>(predFn: (e: T) => boolean) {
  return function (arr: T[]): T[] {
    return arr.filter(predFn);
  };
}

export function toSet(arr: Array<any>) {
  return new Set(arr);
}

export function uniq() {
  return uniqBy(identity);
}

export function uniqBy<T, U>(comparisonValueFn: (value: T) => U) {
  return function (arr: Array<T>): Array<T> {
    const map = new Map<U, T>();
    for (const val of arr) {
      const key = comparisonValueFn(val);
      if (!map.has(key)) {
        map.set(key, val);
      }
    }
    return Array.from(map.values());
  };
}

// export const A = {
//   compact,
//   concat,
//   each,
//   first,
//   map,
//   nth,
//   toSet,
//   uniq,
//   uniqBy,
// };

export const A = buildPipeThroughFunction();

Object.assign(A, {
  compact,
  concat,
  each,
  filter: select,
  first,
  isEmpty,
  join,
  map,
  nth,
  select,
  toSet,
  uniq,
  uniqBy,
});

// protocols

class CompactableArray<T> extends Compactable<T[]> {
  compact(omit?: any[]) {
    omit ||= [null, undefined];

    const omitSet = toSet(omit);
    const newArr: any[] = [];
    for (const val of this.self) {
      if (!omitSet.has(val)) {
        newArr.push(val);
      }
    }
    return newArr;
  }
}
Compactable.register(Array, CompactableArray, true);

class MappableArray<T, U> extends Mappable<T[], T, U> {
  map(mapFn: (v: T) => U): any {
    return this.self.map(mapFn);
  }
}
Mappable.register(Array, MappableArray, true);

export class AsyncMappableArray<T, U> extends AsyncMappable<T[], T, U> {
  async map(mapFn: (v: T) => Promise<U>) {
    const arr: U[] = [];
    for await (const v of this.self) {
      const mappedValue = await mapFn(v);
      arr.push(mappedValue);
    }
    return arr;
  }
}
AsyncMappable.register(Array, AsyncMappableArray, true);

class EnumerableArray<T> extends Enumerable<T[], T> {
  *emit() {
    for (const e of this.self) yield e;
  }
}
Enumerable.register(Array, EnumerableArray, true);

class SelectableArray<T> extends Selectable<T[], T> {
  select(predFn: (v: T) => boolean): T[] {
    return this.self.filter(predFn);
  }
}
Selectable.register(Array, SelectableArray, true);
