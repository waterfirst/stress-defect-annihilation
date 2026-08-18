import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtHtml = resolve(root, "dist/index.html");
const rootHtml = resolve(root, "index.html");
const rootAssets = resolve(root, "assets");

const html = await readFile(builtHtml, "utf8");
await writeFile(rootHtml, html, "utf8");
await rm(rootAssets, { recursive: true, force: true });
await mkdir(rootAssets, { recursive: true });
const assetPaths = [...new Set([...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((match) => match[1]))];
for (const assetPath of assetPaths) {
  await cp(resolve(root, "dist", assetPath), resolve(root, assetPath));
}
process.stdout.write("GitHub Pages bundle promoted to index.html and assets/.\n");
