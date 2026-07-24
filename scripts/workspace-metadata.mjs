import { execFileSync } from "node:child_process";

function readGit(cwd, args) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function safeValue(value, fallback) {
  const normalized = value.replace(/[\r\n\t]/g, " ").trim();
  return normalized || fallback;
}

/**
 * Provides non-sensitive Git labels for the development-only identity badge.
 * Vite evaluates this module at startup, so production builds never need to
 * inspect a visitor's machine or a deployed Git repository.
 */
export function getWorkspaceBuildMetadata(cwd = process.cwd()) {
  const branch = readGit(cwd, ["branch", "--show-current"]);
  const shortSha = readGit(cwd, ["rev-parse", "--short", "HEAD"]);

  return {
    branch: safeValue(branch, "local"),
    shortSha: safeValue(shortSha, "unknown"),
  };
}
