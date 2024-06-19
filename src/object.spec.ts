import { describe, expect, it } from "bun:test";
import { O } from "./object";
import { select } from "./selectable";

describe("keys", () => {
  it("returns keys of the given object", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };
    expect(O(obj).keys()).toEqual(["foo", "bar"]);
  });
});

describe("select", () => {
  it("returns a new object containing only the selected key/value pairs", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };

    expect(
      O(obj).select(([k, v]: [string, number[]]) => v.includes(2))
    ).toEqual({ foo: [1, 2, 3] });
  });
});

describe("selectable", () => {
  it("returns a new object containing only the selected key/value pairs", () => {
    const obj = {
      foo: [1, 2, 3],
      bar: [4, 6, 7],
    };

    expect(select(([k, v]: [string, number[]]) => v.includes(2))(obj)).toEqual({
      foo: [1, 2, 3],
    });
  });
});
