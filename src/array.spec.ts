import { describe, expect, it } from "bun:test";
import { A, compact } from "./array";

describe("compact", () => {
  it("removes specified elements from array", () => {
    const arr = [1, "foo", null, undefined];

    expect(compact()(arr)).toEqual([1, "foo"]);
    expect(A.compact()(arr)).toEqual([1, "foo"]);
    expect(A(arr).compact()).toEqual([1, "foo"]);
  });
});
