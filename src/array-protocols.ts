import { toSet } from "./array";
import { Compactable } from "./compactable";
import { Enumerable } from "./enumerable";
import { Mappable, AsyncMappable } from "./mappable";
import { Selectable } from "./selectable";

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
await Compactable.register(Array, CompactableArray, true);

class MappableArray<T, U> extends Mappable<T[], T, U> {
  map(mapFn: (v: T) => U): any {
    return this.self.map(mapFn);
  }
}
await Mappable.register(Array, MappableArray, true);

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
await AsyncMappable.register(Array, AsyncMappableArray, true);

class EnumerableArray<T> extends Enumerable<T[], T> {
  *emit() {
    for (const e of this.self) yield e;
  }
}
// console.log(
//   `1111111111111111111111111111111111111111111111111111111111111 register Enumerable.register(${Array}, ${EnumerableArray}`
// );
await Enumerable.register(Array, EnumerableArray, true);
// console.log(`222222222222222222222222222222222222222222222222222222 found: Enumerable.for(Array): ${Enumerable.for([])}`)

class SelectableArray<T> extends Selectable<T[], T> {
  select(predFn: (v: T) => boolean): T[] {
    return this.self.filter(predFn);
  }
}
await Selectable.register(Array, SelectableArray, true);

