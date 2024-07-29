import { Range } from "./range";
import { Enumerable } from "./enumerable";
import { Mappable, AsyncMappable } from "./mappable";
import { Selectable } from "./selectable";

class MappableRange<T> extends Mappable<Range, number, T> {
  map(mapFn: (v: number) => T): T[] {
    return this.self.map(mapFn);
  }
}
await Mappable.register(Range, MappableRange, true);

// export class AsyncMappableRange<T, U> extends AsyncMappable<T[], T, U> {
//   async map(mapFn: (v: T) => Promise<U>) {
//     const arr: U[] = [];
//     for await (const v of this.self) {
//       const mappedValue = await mapFn(v);
//       arr.push(mappedValue);
//     }
//     return arr;
//   }
// }
// await AsyncMappable.register(Range, AsyncMappableRange, true);

class EnumerableRange extends Enumerable<Range, number> {
  *emit() {
    const exclusiveEnd = this.self.inclusive ? this.self.end + 1 : this.self.end;
    for (let i = this.self.start; i < exclusiveEnd; i++) {
      yield i;
    }
  }
}
await Enumerable.register(Range, EnumerableRange, true);

class SelectableRange extends Selectable<Range, number> {
  select(predFn: (v: number) => boolean): number[] {
    let arr: number[] = [];
    this.self.each((num) => {
      if (predFn(num)) {
        arr.push(num);
      }
    });
    return arr;
  }
}
await Selectable.register(Range, SelectableRange, true);
