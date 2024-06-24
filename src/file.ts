import type { PathLike } from "fs";
import { existsSync } from "node:fs";

export function exists(path: PathLike): boolean {
  return existsSync(path);
}

export class File {
  static exists(path: PathLike): boolean {
    return exists(path);
  }
}
