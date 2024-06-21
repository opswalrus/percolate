import { describe, expect, it } from "bun:test";
import { Class, Null, Undefined, V } from "./type";

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

    expect(V(null).isA(Array)).toBeFalse();
    expect(V(null).isA(Function)).toBeFalse();
    expect(V(null).isA(Map)).toBeFalse();
    expect(V(null).isA(Null)).toBeTrue();
    expect(V(null).isA(Number)).toBeFalse();
    expect(V(null).isA(Object)).toBeFalse();
    expect(V(null).isA(String)).toBeFalse();
    expect(V(null).isA(Undefined)).toBeFalse();

    expect(V(undefined).isA(Array)).toBeFalse();
    expect(V(undefined).isA(Function)).toBeFalse();
    expect(V(undefined).isA(Map)).toBeFalse();
    expect(V(undefined).isA(Null)).toBeFalse();
    expect(V(undefined).isA(Number)).toBeFalse();
    expect(V(undefined).isA(Object)).toBeFalse();
    expect(V(undefined).isA(String)).toBeFalse();
    expect(V(undefined).isA(Undefined)).toBeTrue();

    expect(V(num).isA(Array)).toBeFalse();
    expect(V(num).isA(Function)).toBeFalse();
    expect(V(num).isA(Map)).toBeFalse();
    expect(V(num).isA(Null)).toBeFalse();
    expect(V(num).isA(Number)).toBeTrue();
    expect(V(num).isA(Object)).toBeFalse();
    expect(V(num).isA(String)).toBeFalse();
    expect(V(num).isA(Undefined)).toBeFalse();

    expect(V(str).isA(Array)).toBeFalse();
    expect(V(str).isA(Function)).toBeFalse();
    expect(V(str).isA(Map)).toBeFalse();
    expect(V(str).isA(Null)).toBeFalse();
    expect(V(str).isA(Number)).toBeFalse();
    expect(V(str).isA(Object)).toBeFalse();
    expect(V(str).isA(String)).toBeTrue();
    expect(V(str).isA(Undefined)).toBeFalse();

    expect(V(arr).isA(Array)).toBeTrue();
    expect(V(arr).isA(Function)).toBeFalse();
    expect(V(arr).isA(Map)).toBeFalse();
    expect(V(arr).isA(Null)).toBeFalse();
    expect(V(arr).isA(Number)).toBeFalse();
    expect(V(arr).isA(Object)).toBeTrue();
    expect(V(arr).isA(String)).toBeFalse();
    expect(V(arr).isA(Undefined)).toBeFalse();

    expect(V(fun).isA(Array)).toBeFalse();
    expect(V(fun).isA(Function)).toBeTrue();
    expect(V(fun).isA(Map)).toBeFalse();
    expect(V(fun).isA(Null)).toBeFalse();
    expect(V(fun).isA(Number)).toBeFalse();
    expect(V(fun).isA(Object)).toBeTrue();
    expect(V(fun).isA(String)).toBeFalse();
    expect(V(fun).isA(Undefined)).toBeFalse();

    expect(V(map).isA(Array)).toBeFalse();
    expect(V(map).isA(Function)).toBeFalse();
    expect(V(map).isA(Map)).toBeTrue();
    expect(V(map).isA(Null)).toBeFalse();
    expect(V(map).isA(Number)).toBeFalse();
    expect(V(map).isA(Object)).toBeTrue();
    expect(V(map).isA(String)).toBeFalse();
    expect(V(map).isA(Undefined)).toBeFalse();

    expect(V(obj).isA(Array)).toBeFalse();
    expect(V(obj).isA(Function)).toBeFalse();
    expect(V(obj).isA(Map)).toBeFalse();
    expect(V(obj).isA(Null)).toBeFalse();
    expect(V(obj).isA(Number)).toBeFalse();
    expect(V(obj).isA(Object)).toBeTrue();
    expect(V(obj).isA(String)).toBeFalse();
    expect(V(obj).isA(Undefined)).toBeFalse();
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

  it("inspects an object", () => {
    const map = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);
    const obj = { foo: "bar" };

    expect(V(Map).inspect()).toEqual(`[Function: Map]`);
    expect(V(String).inspect()).toEqual(`[Function: String]`);
    expect(V(Undefined).inspect()).toEqual(`[class Undefined]`);

    expect(V(map).inspect()).toEqual(
      `Map(2) { 'foo' => [ 1, 2, 3 ], 'bar' => [ 4, 6, 7 ] }`
    );
    expect(V(obj).inspect()).toEqual(`{ foo: 'bar' }`);
  });
});
