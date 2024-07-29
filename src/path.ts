import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, lstatSync } from "node:fs";
import { win32, posix } from "node:path";
import type { ParsedPath } from "node:path";
import { isWindows } from "./platform";
import { A } from "./array";
import { Str } from "./string";
import { Range } from "./range";

export class Path {
  static new(path: string, isWindowsPath: boolean = isWindows()): Path {
    return new Path(path, isWindowsPath);
  }

  static sep(isWindowsPath: boolean = isWindows()) {
    if (isWindowsPath) {
      return win32.sep;
    } else {
      return posix.sep;
    }
  }

  constructor(public path: string, public isWindowsPath: boolean = isWindows()) {}

  absolute(): Path {
    return this.resolve();
  }

  basename(suffix?: string): Path {
    if (this.isWindowsPath) {
      return this.build(win32.basename(this.path, suffix));
    } else {
      return this.build(posix.basename(this.path, suffix));
    }
  }

  build(path: string): Path {
    return new Path(path, this.isWindowsPath);
  }

  // given a path like "bar/bas", this method converts the path to an absolute path (e.g. "/foo/bar/bas"),
  // and then returns the directory tree as an array of the form ["foo", "bar", "bas"]
  directoryTree(): string[] {
    return this.absolute().dirname().split();
  }

  dirname(): Path {
    if (this.isWindowsPath) {
      return this.build(win32.dirname(this.path));
    } else {
      return this.build(posix.dirname(this.path));
    }
  }

  exists(): boolean {
    return existsSync(this.path);
  }

  isAbsolute(): boolean {
    if (this.isWindowsPath) {
      return win32.isAbsolute(this.path);
    } else {
      return posix.isAbsolute(this.path);
    }
  }

  isDirectory(): boolean {
    return this.exists() && lstatSync(this.path).isDirectory();
  }

  isFile(): boolean {
    return this.exists() && lstatSync(this.path).isFile();
  }

  join(...paths: string[]): Path {
    if (this.isWindowsPath) {
      return this.build(win32.join(this.path, ...paths));
    } else {
      return this.build(posix.join(this.path, ...paths));
    }
  }

  normalize(): Path {
    if (this.isWindowsPath) {
      return this.build(win32.normalize(this.path));
    } else {
      return this.build(posix.normalize(this.path));
    }
  }

  // returns an object of the form: { root, dir, base, ext, name }
  //
  // Posix:
  // >>> path.parse('/home/user/dir/file.txt')
  // { root: '/',
  //   dir: '/home/user/dir',
  //   base: 'file.txt',
  //   ext: '.txt',
  //   name: 'file' }
  // ┌─────────────────────┬────────────┐
  // │          dir        │    base    │
  // ├──────┬              ├──────┬─────┤
  // │ root │              │ name │ ext │
  // "  /    home/user/dir / file  .txt "
  // └──────┴──────────────┴──────┴─────┘
  // (All spaces in the "" line should be ignored. They are purely for formatting.)
  //
  // Windows:
  // >>> path.parse('C:\\path\\dir\\file.txt');
  // { root: 'C:\\',
  //   dir: 'C:\\path\\dir',
  //   base: 'file.txt',
  //   ext: '.txt',
  //   name: 'file' }
  // ┌─────────────────────┬────────────┐
  // │          dir        │    base    │
  // ├──────┬              ├──────┬─────┤
  // │ root │              │ name │ ext │
  // " C:\      path\dir   \ file  .txt "
  // └──────┴──────────────┴──────┴─────┘
  // (All spaces in the "" line should be ignored. They are purely for formatting.)
  parse(): ParsedPath {
    if (this.isWindowsPath) {
      return win32.parse(this.path);
    } else {
      return posix.parse(this.path);
    }
  }

  pop(count: number = 1): Path {
    let path = this.absolute();
    Range.new(1, count).each((i) => {
      path = path.resolve("..");
    });
    return path;
  }

  relative(to: string): Path {
    if (this.isWindowsPath) {
      return this.build(win32.relative(this.path, to));
    } else {
      return this.build(posix.relative(this.path, to));
    }
  }

  resolve(...paths: string[]): Path {
    if (this.isWindowsPath) {
      return this.build(win32.resolve(this.path, ...paths));
    } else {
      return this.build(posix.resolve(this.path, ...paths));
    }
  }

  root(): Path {
    const { root } = this.parse();
    return this.build(root);
  }

  // returns the parts of the path, excluding the root if applicable
  // /home/user/dir/file.txt -> ["home", "user", "dir", "file.txt"]
  // C:\home\user\dir\file.txt -> ["home", "user", "dir", "file.txt"]
  // user/dir/file.txt -> ["user", "dir", "file.txt"]
  // user\dir\file.txt -> ["user", "dir", "file.txt"]
  split(): string[] {
    const normalized = this.normalize();
    if (normalized.isAbsolute()) {
      const { root } = normalized.parse();
      const relPath = Str(normalized.toString()).trimPrefix(root);
      return relPath.split(Path.sep(this.isWindowsPath));
    } else {
      return normalized.toString().split(Path.sep(this.isWindowsPath));
    }
  }

  toString(): string {
    return this.path;
  }
}
