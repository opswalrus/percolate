import { buildPipeThroughFunction, identity } from "./function";

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

export function find<T>(predicateFn: (v: T) => any) {
  return function (arr: Array<T>): T | undefined {
    for (const val of arr) {
      if (predicateFn(val)) {
        return val;
      }
    }
    return undefined;
  };
}

// returns the first n elements
export function first<T>(n: number) {
  return function (arr: T[]): T[] {
    return arr.slice(0, n);
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

// returns the last n elements
export function last<T>(n: number) {
  return function (arr: T[]): T[] {
    return arr.slice(arr.length - n, arr.length);
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

// returns the trailing elements of the array except for the leading n elements
export function skipFirst<T>(n: number) {
  return function (arr: T[]): T[] {
    if (n > arr.length) {
      n = arr.length;
    }
    return arr.slice(n, arr.length);
  };
}

// returns the leading elements of the array except for the trailing n elements
export function skipLast<T>(n: number) {
  return function (arr: T[]): T[] {
    if (n > arr.length) {
      n = arr.length;
    }
    return arr.slice(0, arr.length - n);
  }
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

export function zip<T, U>(other: Array<U>) {
  return function (arr: Array<T>): Array<[T, U]> {
    var len = Math.min(arr.length, other.length);
    var result = Array(len);
    var idx = 0;
    while (idx < len) {
      result[idx] = [arr[idx], other[idx]];
      idx += 1;
    }
    return result;
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
  find,
  first,
  isEmpty,
  join,
  last,
  map,
  nth,
  select,
  skipFirst,
  skipLast,
  toSet,
  uniq,
  uniqBy,
  zip,
});

import "./all-protocols";
