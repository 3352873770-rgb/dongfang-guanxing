import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const DEFAULT_CANONICAL_ROOT = "/Users/leon/Documents/算卦";
const DEFAULT_EXPECTED_ORIGIN = "3352873770-rgb/mmeett-fate";

function runGit(args, { allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowFailure) return "";
    const message = error.stderr?.toString().trim() || error.message;
    throw new Error(`git ${args.join(" ")} failed: ${message}`);
  }
}

function gitSucceeds(args) {
  try {
    execFileSync("git", args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function normalizeOrigin(value) {
  return value
    .trim()
    .replace(/^git@[^:]+:/, "")
    .replace(/^ssh:\/\/git@[^/]+\//, "")
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/\.git$/, "")
    .replace(/^\/+|\/+$/g, "");
}

function getRelationToMain(head) {
  if (!runGit(["rev-parse", "--verify", "origin/main"], { allowFailure: true })) {
    return { relation: "origin/main unavailable", containsMain: false, equalsMain: false };
  }

  const mainSha = runGit(["rev-parse", "origin/main"]);
  if (head === mainSha) {
    return { relation: "equal to origin/main", containsMain: true, equalsMain: true };
  }

  const headContainsMain = gitSucceeds(["merge-base", "--is-ancestor", "origin/main", "HEAD"]);
  const mainContainsHead = gitSucceeds(["merge-base", "--is-ancestor", "HEAD", "origin/main"]);
  const counts = runGit(["rev-list", "--left-right", "--count", "origin/main...HEAD"]);
  const [behind = "?", ahead = "?"] = counts.split(/\s+/);

  if (headContainsMain) {
    return { relation: `ahead of origin/main by ${ahead}`, containsMain: true, equalsMain: false };
  }
  if (mainContainsHead) {
    return { relation: `behind origin/main by ${behind}`, containsMain: false, equalsMain: false };
  }
  return { relation: `diverged from origin/main (behind ${behind}, ahead ${ahead})`, containsMain: false, equalsMain: false };
}

function parseMode(argv) {
  const mode = argv.find((argument) => argument === "--baseline" || argument === "--release") ?? "--status";
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Usage: node scripts/workspace-status.mjs [--baseline|--release]");
    console.log("Environment: MMEETT_CANONICAL_ROOT, MMEETT_EXPECTED_ORIGIN");
    process.exit(0);
  }
  return mode;
}

function main() {
  const mode = parseMode(process.argv.slice(2));
  let fetched = true;
  if (mode !== "--status") {
    fetched = gitSucceeds(["fetch", "--quiet", "origin", "main:refs/remotes/origin/main"]);
  }
  const root = runGit(["rev-parse", "--show-toplevel"]);
  const branch = runGit(["branch", "--show-current"], { allowFailure: true }) || "(detached HEAD)";
  const head = runGit(["rev-parse", "HEAD"]);
  const shortSha = runGit(["rev-parse", "--short", "HEAD"]);
  const upstream = runGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], { allowFailure: true }) || "(none)";
  const dirty = Boolean(runGit(["status", "--porcelain"]));
  const origin = runGit(["remote", "get-url", "origin"], { allowFailure: true }) || "(missing)";
  const canonicalRoot = resolve(process.env.MMEETT_CANONICAL_ROOT || DEFAULT_CANONICAL_ROOT);
  const expectedOrigin = normalizeOrigin(process.env.MMEETT_EXPECTED_ORIGIN || DEFAULT_EXPECTED_ORIGIN);
  const originMatches = normalizeOrigin(origin) === expectedOrigin;
  const relation = getRelationToMain(head);

  console.log(`Project root: ${root}`);
  console.log(`Branch: ${branch}`);
  console.log(`Short SHA: ${shortSha}`);
  console.log(`Upstream: ${upstream}`);
  console.log(`Worktree: ${dirty ? "dirty" : "clean"}`);
  console.log(`Origin: ${origin}`);
  console.log(`Origin match: ${originMatches ? "yes" : `no (expected ${expectedOrigin})`}`);
  console.log(`Relation to origin/main: ${relation.relation}`);
  if (mode !== "--status") console.log(`Origin/main refresh: ${fetched ? "ok" : "failed"}`);

  const failures = [];
  if (mode === "--baseline") {
    if (!fetched) failures.push("could not refresh origin/main");
    if (resolve(root) !== canonicalRoot) failures.push(`baseline must run in ${canonicalRoot}`);
    if (branch !== "main") failures.push("baseline must use the main branch");
    if (dirty) failures.push("baseline worktree must be clean");
    if (!originMatches) failures.push("baseline origin does not match the expected repository");
    if (!relation.equalsMain) failures.push("baseline HEAD must equal origin/main");
  }
  if (mode === "--release") {
    if (!fetched) failures.push("could not refresh origin/main");
    if (dirty) failures.push("release/PR verification requires a clean worktree");
    if (!originMatches) failures.push("release/PR origin does not match the expected repository");
    if (!relation.containsMain) failures.push("release/PR HEAD must contain origin/main");
  }

  if (failures.length) {
    console.error(`Workspace check failed:\n- ${failures.join("\n- ")}`);
    process.exitCode = 1;
  }
}

main();
