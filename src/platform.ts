import { platform as nodePlatform } from "node:process";

export function isPosix(): boolean {
  const posixPlatforms: NodeJS.Platform[] = ["darwin", "freebsd", "linux", "netbsd", "openbsd", "sunos"];
  return posixPlatforms.includes(platform());
}

export function isWindows(): boolean {
  return platform() == "win32";
}

export function platform(): NodeJS.Platform {
  return nodePlatform;
}
