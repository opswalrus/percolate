import { Enumerable } from "./enumerable";
import { Mappable } from "./mappable";

class MappableSet<T, U> extends Mappable<Set<T>, T, U> {
  map(mapFn: (v: T) => U) {
    const s = new Set<U>();
    this.self.forEach((value) => {
      const newValue = mapFn(value);
      s.add(newValue);
    });
    return s;
  }
}
await Mappable.register(Set, MappableSet, true);

class EnumerableSet<T> extends Enumerable<Set<T>, T> {
  // each(visitorFn: (v: T) => any): any {
  //   return this.self.forEach((v) => visitorFn(v));
  // }
  *emit() {
    for (const e of this.self) {
      yield e;
    }
  }
}
await Enumerable.register(Set, EnumerableSet, true);
