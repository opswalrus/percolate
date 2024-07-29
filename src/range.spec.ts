import { describe, expect, it } from "bun:test";
import { Range } from "./range";
import { Enumerable } from "./enumerable";
import { Selectable } from "./selectable";
import { Mappable } from "./mappable";
import { equal } from "./equal";

describe("Range", () => {
  it("is iterable with #each", () => {
    const r = Range.new(2, 5);

    expect(Enumerable.for(r).toArray()).toEqual([2, 3, 4, 5]);
    expect(r.toArray()).toEqual([2, 3, 4, 5]);
  });

  it("is Enumerable", () => {
    const r = Range.new(2, 5);

    expect(Enumerable.for(r).toArray()).toEqual([2, 3, 4, 5]);
    expect(r.toArray()).toEqual([2, 3, 4, 5]);
  });

  it("is Mappable", () => {
    const r = Range.new(2, 5);

    expect(Mappable.for(r).map((n: number) => 2 ** n)).toEqual([4, 8, 16, 32]);
  });

  it("is Selectable", () => {
    const r = Range.new(2, 5);

    expect(Selectable.for(r).select((n: number) => n % 2 === 0)).toEqual([2, 4]);
  });

  it("implements Equal typeclass", () => {
    let r1 = Range.new(2, 5);
    let r2 = Range.new(2, 5, true);
    expect(equal(r1, r2)).toBeTrue();

    r1 = Range.new(2, 5);
    r2 = Range.new(2, 5, false);
    expect(equal(r1, r2)).toBeFalse();
  });

});
