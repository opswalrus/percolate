import { describe, expect, it } from "bun:test";
import { V } from "./type";

describe("V", () => {
  it("indicates whether a given value is of a particular type or inherits from a particular type", () => {
    const num = 1;
    const str = "foo";
    const arr = [1, 2, 3];
    const fun = () => {
      return false;
    };
    const map = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);
    const obj = { foo: "bar" };

    expect(V(num).isA(Number)).toBeTrue();
    expect(V(num).isA(Array)).toBeFalse();
    expect(V(num).isA(Function)).toBeFalse();
    expect(V(num).isA(Map)).toBeFalse();
    expect(V(num).isA(Object)).toBeFalse();

    expect(V(arr).isA(Array)).toBeTrue();
    expect(V(arr).isA(Function)).toBeFalse();
    expect(V(arr).isA(Map)).toBeFalse();
    expect(V(arr).isA(Object)).toBeTrue();

    expect(V(arr).isA(Array)).toBeTrue();
    expect(V(arr).isA(Function)).toBeFalse();
    expect(V(arr).isA(Map)).toBeFalse();
    expect(V(arr).isA(Object)).toBeTrue();

    expect(V(fun).isA(Array)).toBeFalse();
    expect(V(fun).isA(Function)).toBeTrue();
    expect(V(fun).isA(Map)).toBeFalse();
    expect(V(fun).isA(Object)).toBeTrue();

    expect(V(map).isA(Array)).toBeFalse();
    expect(V(map).isA(Function)).toBeFalse();
    expect(V(map).isA(Map)).toBeTrue();
    expect(V(map).isA(Object)).toBeTrue();

    expect(V(obj).isA(Array)).toBeFalse();
    expect(V(obj).isA(Function)).toBeFalse();
    expect(V(obj).isA(Map)).toBeFalse();
    expect(V(obj).isA(Object)).toBeTrue();
  });

  it("indicates the kind of the value", () => {
    const arr = [1, 2, 3];
    const fun = () => {
      return false;
    };
    const map = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);
    const obj = { foo: "bar" };

    expect(V(arr).kind()).toEqual(Array);
    expect(V(fun).kind()).toEqual(Function);
    expect(V(map).kind()).toEqual(Map);
    expect(V(obj).kind()).toEqual(Object);
  });
});
