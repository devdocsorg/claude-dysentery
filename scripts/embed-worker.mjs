import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(path.join(root, "worker/index.js"), "utf8");
const logo = await readFile(path.join(root, "brand/logo.png"));
const directive = (await readFile(path.join(root, "prompts/directive.md"), "utf8")).trim();
const logoMarker = "__LOGO_BASE64__";
const directiveMarker = "__DIRECTIVE_JSON__";

if (!source.includes(logoMarker)) throw new Error("Worker logo marker is missing");
if (!source.includes(directiveMarker)) throw new Error("Worker directive marker is missing");

const bundled = source
  .replace(directiveMarker, JSON.stringify(directive))
  .replace(logoMarker, logo.toString("base64"));

await writeFile(path.join(root, "dist/server/index.js"), bundled, "utf8");
