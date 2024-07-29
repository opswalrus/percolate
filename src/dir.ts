import type { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, lstatSync } from "node:fs";
import { win32, posix } from "node:path";
import { isWindows } from "./platform";
import { File } from "./file";

export class Dir {
  // given a path like "bar/bas", this method converts the path to an absolute path (e.g. "/foo/bar/bas"),
  // and then returns the directory tree as an array of the form ["foo", "bar", "bas"]
  static directoryTree(path: string) {
    const absPath = File.absolutePath(path);
    return Dir.split(absPath);
  }

  // returns true if the given path is a directory
  static exists(path: string) {
    return File.exists(path) && lstatSync(path).isDirectory();
  }
}
