import { describe, expect, it } from "bun:test";
import { Path } from "./path";

describe("Path", () => {
  it("derives absolute path", () => {
    const parent = Path.new("..", false);
    const readme = Path.new("../README.md", false);

    expect(readme.absolute().toString()).toEqual(parent.absolute().join("README.md").toString());
  });

  it("derives the filename from the given path", () => {
    const parent = Path.new("..", false);
    const readme = Path.new("../README.md", false);

    expect(readme.basename().toString()).toEqual("README.md");
    expect(readme.basename(".md").toString()).toEqual("README");
    // expect(readme.absolute().basename().toString()).toEqual(parent.absolute().toString());
  });

  it("derives the directory from the given path", () => {
    const parent = Path.new("..", false);
    const readme = Path.new("../README.md", false);

    expect(readme.dirname().toString()).toEqual("..");
    expect(readme.absolute().dirname().toString()).toEqual(parent.absolute().toString());
  });

  it("derives the directory tree", () => {
    let parent = Path.new("..", false);
    let readme = Path.new("../README.md", false);

    expect(readme.directoryTree()).toEqual(parent.absolute().split());

    parent = Path.new("C:\\foo\\bar", true);
    readme = Path.new("C:\\foo\\bar\\README.md", true);

    expect(readme.directoryTree()).toEqual(["foo", "bar"]);
    expect(readme.directoryTree()).toEqual(parent.absolute().split());
  });

  it("splits a path on path seperator", () => {
    let path = Path.new("foo/bar", false);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("/foo/bar", false);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("foo\\bar", true);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("C:\\foo\\bar", true);
    expect(path.split()).toEqual(["foo", "bar"]);
  });

  it("computes relative path", () => {
    let path = Path.new("/foo/bar/baz", false);
    expect(path.relative("/foo/qux/quux").toString()).toEqual("../../qux/quux");

    path = Path.new("C:\\foo\\bar\\baz", true);
    expect(path.relative("C:\\foo\\qux\\quux").toString()).toEqual("..\\..\\qux\\quux");
  });

  it("resolves and normalizes paths", () => {
    let path = Path.new("/foo/bar/baz", false);
    expect(path.resolve("../abc/./def/", "..", "qux/quux").toString()).toEqual("/foo/bar/abc/qux/quux");
  });
});
