import { describe, expect, it } from "bun:test";
import { keys } from "./map";

describe("keys", () => {
  it("returns keys of the given map", () => {
    expect(
      keys(
        new Map([
          ["foo", [1, 2, 3]],
          ["bar", [4, 6, 7]],
        ])
      )
    ).toEqual(["foo", "bar"]);
  });
});
