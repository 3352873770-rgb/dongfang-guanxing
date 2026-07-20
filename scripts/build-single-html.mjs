import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const releaseDir = path.resolve("release");
const outputFile = path.join(releaseDir, "东方观星-离线分享版.html");

const mimeTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function listFiles(directory, relativeTo = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativeTo)));
    } else {
      files.push(path.relative(relativeTo, absolutePath).split(path.sep).join("/"));
    }
  }

  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function asDataUri(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  const mimeType = mimeTypes[extension];
  if (!mimeType) {
    throw new Error(`Unsupported asset type: ${relativePath}`);
  }

  const bytes = await readFile(path.join(clientDir, relativePath));
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

let html = await readFile(path.join(clientDir, "index.html"), "utf8");

const stylesheetMatches = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)];
for (const match of stylesheetMatches) {
  const stylesheetPath = match[1].replace(/^\//, "");
  const css = await readFile(path.join(clientDir, stylesheetPath), "utf8");
  html = html.replace(
    match[0],
    () => `<style data-offline-bundle>\n${css.replaceAll("</style", "<\\/style")}\n</style>`,
  );
}

const scriptMatches = [...html.matchAll(/<script\b[^>]*src="([^"]+\.js)"[^>]*><\/script>/g)];
for (const match of scriptMatches) {
  const scriptPath = match[1].replace(/^\//, "");
  const javascript = await readFile(path.join(clientDir, scriptPath), "utf8");
  html = html.replace(
    match[0],
    () => `<script type="module" data-offline-bundle>\n${javascript.replaceAll("</script", "<\\/script")}\n</script>`,
  );
}

const files = await listFiles(clientDir);
const assetFiles = files.filter((relativePath) => {
  if (relativePath === "index.html" || relativePath.startsWith("assets/")) return false;
  return [`"/${relativePath}`, `'/${relativePath}`, `(/${relativePath}`].some((assetPath) =>
    html.includes(assetPath),
  );
});

for (const relativePath of assetFiles) {
  const dataUri = await asDataUri(relativePath);
  const escapedPath = escapeRegExp(relativePath);
  html = html.replace(new RegExp(`(["'(])/${escapedPath}`, "g"), `$1${dataUri}`);
}

const remainingLocalAssets = [
  '"/assets/',
  "'/assets/",
  "(/assets/",
  '"/media/',
  "'/media/",
  "(/media/",
].filter((assetPrefix) => html.includes(assetPrefix));

if (remainingLocalAssets.length > 0) {
  throw new Error(
    `The offline bundle still contains local asset references: ${remainingLocalAssets.slice(0, 8).join(", ")}`,
  );
}

html = html.replace(
  "<head>",
  '<head>\n    <meta name="offline-bundle" content="东方观星单文件离线版" />',
);

await mkdir(releaseDir, { recursive: true });
await writeFile(outputFile, html);

const outputSize = (await stat(outputFile)).size;
console.log(`Created ${outputFile}`);
console.log(`Embedded ${assetFiles.length} media assets`);
console.log(`Size ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
