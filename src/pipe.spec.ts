import { describe, expect, it } from "bun:test";
import { A } from "./array";
import { O } from "./object";
import { P } from "./pipe";

describe("Behavior of A property", () => {
  it("P(val).A returns the same thing as A(val)", () => {
    const arr = [1, 2, 3];
    expect(P(arr).A).toEqual(A(arr));
  });

  it("P([1,2,3]).A.concat([4,5,6]) returns the same thing as A([1,2,3]).concat([4,5,6])", () => {
    const arr = [1, 2, 3];
    expect(P(arr).A.concat([4, 5, 6])).toEqual(A(arr).concat([4, 5, 6]));
  });
});

describe("Behavior of `a` property", () => {
  it("P([1,2,3]).a.concat([4,5,6]).value returns the same thing as A([1,2,3]).concat([4,5,6])", () => {
    const arr = [1, 2, 3];
    expect(P(arr).a.concat([4, 5, 6]).value).toEqual(A(arr).concat([4, 5, 6]));
  });
});

describe("Behavior of O property", () => {
  it("P(val).O returns the same thing as O(val)", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };

    expect(P(obj).O).toEqual(O(obj));
  });

  it("P(obj).O.select(([k, v]: [string, number[]]) => v.includes(2)) returns the same thing as O(obj).select(([k, v]: [string, number[]]) => v.includes(2))", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };

    expect(
      P(obj).O.select(([k, v]: [string, number[]]) => v.includes(2))
    ).toEqual(O(obj).select(([k, v]: [string, number[]]) => v.includes(2)));
  });
});

describe("Behavior of `o` property", () => {
  it("P(obj).o.select(([k, v]: [string, number[]]) => v.includes(2)).value returns the same thing as O(obj).select(([k, v]: [string, number[]]) => v.includes(2))", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };

    expect(
      P(obj).o.select(([k, v]: [string, number[]]) => v.includes(2)).value
    ).toEqual(O(obj).select(([k, v]: [string, number[]]) => v.includes(2)));
  });
});
