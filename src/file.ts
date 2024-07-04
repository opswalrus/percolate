import type { PathLike } from "fs";
import { readFile } from "fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { win32, posix } from "node:path";
import { isWindows } from "./platform";

export function exists(path: PathLike): boolean {
  return existsSync(path);
}

export class File {
  static exists(path: PathLike): boolean {
    return exists(path);
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

  // basename("c:\\foo\\bar\\baz.txt") => "baz.txt"
  // basename("/tmp/myfile.html") => "myfile.html"
  static basename(path: string, suffix?: string): string {
    if (isWindows()) {
      return win32.basename(path, suffix);
    } else {
      return posix.basename(path, suffix);
    }
  }
}
