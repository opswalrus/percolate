import type { PathLike } from "node:fs";
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

  static split(path: string): string[] {
    if (isWindows()) {
      return path.split(win32.sep);
    } else {
      return path.split(posix.sep);
    }
  }
}
