import type { PathLike } from "fs";
import { readFile } from "fs/promises";
import { existsSync, readFileSync } from "node:fs";

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
}
