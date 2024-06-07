import { identity } from "./function";
import { End } from "./type";

export class Enumerator<T> implements IterableIterator<T> {
  static for<U>(iterator: Iterator<U>): Enumerator<U> {
    return new Enumerator(iterator);
  }

  constructor(private iterator: Iterator<T>) {}

  all(predFn: (v: T) => boolean): boolean {
    for (const elem of this) {
      if (!predFn(elem)) {
        return false;
      }
    }
    return true;
  }

  any(predFn: (v: T) => boolean): boolean {
    for (const elem of this) {
      if (predFn(elem)) {
        return true;
      }
    }
    return false;
  }

  each(visitorFn: (v: T) => any) {
    for (const e of this) {
      visitorFn(e);
    }
  }

  first<U>(
    predFn: (T) => any = identity,
    defaultIfAbsesnt: U | undefined = undefined
  ): T | U | undefined {
    for (const e of this) {
      if (predFn(e)) return e;
    }
    return defaultIfAbsesnt;
  }

  map<U>(mapFn: (v: T) => U): Enumerator<U> {
    function* gen(iterator) {
      for (const e of iterator) {
        yield mapFn(e);
      }
    }
    return Enumerator.for(gen(this));
  }

  // per https://typescript.tv/hands-on/all-you-need-to-know-about-iterators-and-generators/#the-iterator-protocol
  // implement the IterableIterator interface by implementing [Symbol.iterator]() and next()
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
  // per https://typescript.tv/hands-on/all-you-need-to-know-about-iterators-and-generators/#the-iterator-protocol
  // implement the IterableIterator interface by implementing [Symbol.iterator]() and next()
  next(): IteratorResult<T> {
    const val = this.produce();
    if (val instanceof End) {
      return { done: true, value: End.instance };
    }
    return { done: false, value: val };
  }

  // this produces either the next value in the emituence, or it returns End
  produce(): T | End {
    const val: IteratorResult<T> = this.iterator.next();
    if (val.done) {
      return End.instance;
    }
    return val.value;
  }

  select(predFn: (v: T) => boolean): Enumerator<T> {
    function* gen(iterator) {
      for (const e of iterator) {
        if (predFn(e)) yield e;
      }
    }
    return Enumerator.for(gen(this));
  }

  toArray(): T[] {
    return Array.from(this);
  }

  toMap<K, V>(kvMapFn: (v: T) => [K, V]): Map<K, V> {
    return new Map(this.map(kvMapFn));
  }

  toSet(): Set<T> {
    return new Set(this);
  }
}
