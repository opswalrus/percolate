import type { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, lstatSync } from "node:fs";
import { win32, posix } from "node:path";
import { isWindows } from "./platform";
import { A } from "./array";

export class Path {
  static new(path: string): Path {
    return new Path(path);
  }

  static get sep() {
    if (isWindows()) {
      return win32.sep;
    } else {
      return posix.sep;
    }
  }

  constructor(public path: string) {}

  absolute(): Path {
    return this.resolve();
  }

  basename(suffix?: string): Path {
    if (isWindows()) {
      return new Path(win32.basename(this.path, suffix));
    } else {
      return new Path(posix.basename(this.path, suffix));
    }
  }

  // given a path like "bar/bas", this method converts the path to an absolute path (e.g. "/foo/bar/bas"),
  // and then returns the directory tree as an array of the form ["foo", "bar", "bas"]
  directoryTree(): string[] {
    return this.absolute().dirname().split();
  }

  dirname(): Path {
    if (isWindows()) {
      return new Path(win32.dirname(this.path));
    } else {
      return new Path(posix.dirname(this.path));
    }
  }

  exists(): boolean {
    return existsSync(this.path);
  }

  isDirectory(): boolean {
    return this.exists() && lstatSync(this.path).isDirectory();
  }

  isFile(): boolean {
    return this.exists() && lstatSync(this.path).isFile();
  }

  join(...paths: string[]): Path {
    if (isWindows()) {
      return new Path(win32.join(this.path, ...paths));
    } else {
      return new Path(posix.join(this.path, ...paths));
    }
  }

  relative(to: string): Path {
    if (isWindows()) {
      return new Path(win32.relative(this.path, to));
    } else {
      return new Path(posix.relative(this.path, to));
    }
  }

  resolve(...paths: string[]): Path {
    if (isWindows()) {
      return new Path(win32.resolve(this.path, ...paths));
    } else {
      return new Path(posix.resolve(this.path, ...paths));
    }
  }

  split(): string[] {
    return A(this.path.split(Path.sep)).compact([""]);
  }

  toString(): string {
    return this.path;
  }
}
