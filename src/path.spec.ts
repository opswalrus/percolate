import { describe, expect, it } from "bun:test";
import { Path } from "./path";

describe("Path", () => {
  it("derives absolute path", () => {
    const parent = Path.new("..");
    const readme = Path.new("../README.md");

    expect(readme.absolute().toString()).toEqual(parent.absolute().join("README.md").toString());
  });

  it("derives the filename from the given path", () => {
    const parent = Path.new("..");
    const readme = Path.new("../README.md");

    expect(readme.basename().toString()).toEqual("README.md");
    expect(readme.basename(".md").toString()).toEqual("README");
    // expect(readme.absolute().basename().toString()).toEqual(parent.absolute().toString());
  });

  it("derives the directory from the given path", () => {
    const parent = Path.new("..");
    const readme = Path.new("../README.md");

    expect(readme.dirname().toString()).toEqual("..");
    expect(readme.absolute().dirname().toString()).toEqual(parent.absolute().toString());
  });

  it("derives the directory tree", () => {
    const parent = Path.new("..");
    const readme = Path.new("../README.md");

    expect(readme.directoryTree()).toEqual(parent.absolute().split());
  });

  it("splits a path on path seperator", () => {
    let path = Path.new("foo/bar");
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("/foo/bar");
    expect(path.split()).toEqual(["foo", "bar"]);
  });

  it("computes relative path", () => {
    let path = Path.new("/foo/bar/baz");
    expect(path.relative("/foo/qux/quux").toString()).toEqual("../../qux/quux");
  });

  it("resolves and normalizes paths", () => {
    let path = Path.new("/foo/bar/baz");
    expect(path.resolve("../abc/./def/", "..", "qux/quux").toString()).toEqual("/foo/bar/abc/qux/quux");
  });
});
