import { Enumerable } from "./enumerable";

export class Range {
  static new(start: number, end: number, inclusive: boolean = true): Range {
    return new Range(start, end, inclusive);
  }

  constructor(public start: number, public end: number, public inclusive: boolean = true) {}

  each(visitorFn: (num) => any) {
    const exclusiveEnd = this.inclusive ? this.end + 1 : this.end;
    for (let i = this.start; i < exclusiveEnd; i++) {
      visitorFn(i);
    }
  }

  map<T>(mapFn: (num: number) => T): T[] {
    const arr: T[] = [];
    this.each((num) => {
      arr.push(mapFn(num));
    });
    return arr;
  }

  toArray(): number[] {
    return Enumerable.for(this).toArray();
  }
}

import "./all-protocols";
