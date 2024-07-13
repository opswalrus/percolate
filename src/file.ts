import type { PathLike } from "node:fs";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { win32, posix } from "node:path";
import { isWindows } from "./platform";

export function exists(path: PathLike): boolean {
  return existsSync(path);
}

export class File {
  static absolutePath(...paths: string[]): string {
    if (isWindows()) {
      return win32.resolve(...paths);
    } else {
      return posix.resolve(...paths);
    }
  }

  // basename("c:\\foo\\bar\\baz.txt") => "baz.txt"
  // basename("/tmp/myfile.html") => "myfile.html"
  static basename(path: string, suffix?: string): string {
    if (isWindows()) {
      return win32.basename(path, suffix);
    } else {
      return posix.basename(path, suffix);
    }
  }

  static exists(path: PathLike): boolean {
    return exists(path);
  }

  static join(...paths: string[]): string {
    if (isWindows()) {
      return win32.join(...paths);
    } else {
      return posix.join(...paths);
    }
  }

  static readSync(path: PathLike): string {
    return readFileSync(path, {
      encoding: "utf8",
    });
  }

  static async readAsync(path: PathLike): Promise<string> {
    return await readFile(path, {
      encoding: "utf8",
    });
  }
}
