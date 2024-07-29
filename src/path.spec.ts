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

    let path = Path.new("foo/bar/baz", false);
    expect(path.dirname().toString()).toEqual("foo/bar");

    path = Path.new("foo\\bar\\baz", true);
    expect(path.dirname().toString()).toEqual("foo\\bar");
  });

  it("derives the directory tree", () => {
    let parent = Path.new("..", false);
    let readme = Path.new("../README.md", false);

    expect(readme.directoryTree()).toEqual(parent.absolute().split());

    parent = Path.new("/foo/bar", false);
    readme = Path.new("/foo/bar/README.md", false);

    expect(readme.directoryTree()).toEqual(["foo", "bar"]);
    expect(readme.directoryTree()).toEqual(parent.absolute().split());

    parent = Path.new("C:\\foo\\bar", true);
    readme = Path.new("C:\\foo\\bar\\README.md", true);

    expect(readme.directoryTree()).toEqual(["foo", "bar"]);
    expect(readme.directoryTree()).toEqual(parent.absolute().split());
  });

  it("pops off the leaf directory of absolute path", () => {
    let path = Path.new("/foo/bar", false);
    expect(path.pop().toString()).toEqual("/foo");
    expect(path.pop().pop().toString()).toEqual("/");
    expect(path.pop().pop().pop().toString()).toEqual("/");
    expect(path.pop(2).toString()).toEqual("/");
    expect(path.pop(3).toString()).toEqual("/");

    path = Path.new("C:\\foo\\bar", true);
    expect(path.pop().toString()).toEqual("C:\\foo");
    expect(path.pop().pop().toString()).toEqual("C:\\");
    expect(path.pop().pop().pop().toString()).toEqual("C:\\");
    expect(path.pop(2).toString()).toEqual("C:\\");
    expect(path.pop(3).toString()).toEqual("C:\\");
  });

  it("computes relative path", () => {
    let path = Path.new("/foo/bar/baz", false);
    expect(path.relative("/foo/qux/quux").toString()).toEqual("../../qux/quux");

    path = Path.new("C:\\foo\\bar\\baz", true);
    expect(path.relative("C:\\foo\\qux\\quux").toString()).toEqual("..\\..\\qux\\quux");
  });

  it("resolves and normalizes absolute paths", () => {
    let path = Path.new("/foo/bar/baz", false);
    expect(path.resolve("../abc/./def/", "..", "qux/quux").toString()).toEqual("/foo/bar/abc/qux/quux");

    path = Path.new("C:\\foo\\bar\\baz", true);
    expect(path.resolve("..\\abc\\.\\def\\", "..", "qux\\quux").toString()).toEqual("C:\\foo\\bar\\abc\\qux\\quux");
  });

  it("resolves the root of the path", () => {
    let path = Path.new("/foo/bar/baz", false);
    expect(path.root().toString()).toEqual("/");

    path = Path.new("C:\\foo\\bar\\baz", true);
    expect(path.root().toString()).toEqual("C:\\");
  });

  it("splits a path on path seperator", () => {
    let path = Path.new("foo/bar", false);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("/foo/bar", false);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("/foo/bar/baz.txt", false);
    expect(path.split()).toEqual(["foo", "bar", "baz.txt"]);

    path = Path.new("foo\\bar", true);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("C:\\foo\\bar", true);
    expect(path.split()).toEqual(["foo", "bar"]);

    path = Path.new("C:\\foo\\bar\\baz.txt", true);
    expect(path.split()).toEqual(["foo", "bar", "baz.txt"]);
  });
});
