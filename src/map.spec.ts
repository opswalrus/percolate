import { describe, expect, it } from "bun:test";
import { M } from "./map";
import { select } from "./selectable";

describe("keys", () => {
  it("returns keys of the given map", () => {
    const m = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);

    expect(M(m).keys()).toEqual(["foo", "bar"]);
  });
});

describe("select", () => {
  it("returns a new map containing only the selected key/value pairs", () => {
    const m = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);

    expect(M(m).select(([k, v]: [string, number[]]) => v.includes(2))).toEqual(
      new Map([["foo", [1, 2, 3]]])
    );
  });
});

describe("selectable", () => {
  it("returns a new object containing only the selected key/value pairs", () => {
    const m = new Map([
      ["foo", [1, 2, 3]],
      ["bar", [4, 6, 7]],
    ]);

    expect(select(([k, v]: [string, number[]]) => v.includes(2))(m)).toEqual(
      new Map([["foo", [1, 2, 3]]])
    );
  });
});
