import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import worker from "../dist/server/index.js";

const request = (path, init) => worker.fetch(new Request(`https://dysentery.devdocs.ai${path}`, init));

const page = await request("/");
assert.equal(page.status, 200);
assert.match(page.headers.get("content-type"), /text\/html/);
const html = await page.text();
assert.match(html, /Keep the fucking wagon moving/i);
assert.match(html, /github\.com\/devdocsorg\/claude-dysentery/);
assert.match(html, /charitywater\.org\/crypto/);

const directiveResponse = await request("/directive.md");
assert.equal(directiveResponse.status, 200);
const directive = (await directiveResponse.text()).trim();
assert.equal(directive, (await readFile(new URL("../prompts/directive.md", import.meta.url), "utf8")).trim());

const shell = await request("/install.sh");
assert.equal(shell.status, 200);
const shellText = await shell.text();
assert.match(shellText, /\.claude\/CLAUDE\.md/);
const shellSyntax = spawnSync("sh", ["-n"], { input: shellText, encoding: "utf8" });
assert.equal(shellSyntax.status, 0, shellSyntax.stderr);

const json = await request("/api/directive");
assert.equal(json.status, 200);
assert.equal((await json.json()).target, "~/.claude/CLAUDE.md");

const logo = await request("/logo.png");
assert.equal(logo.status, 200);
const bytes = new Uint8Array(await logo.arrayBuffer());
assert.deepEqual(Array.from(bytes.slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);

const head = await request("/", { method: "HEAD" });
assert.equal(head.status, 200);
assert.equal((await head.arrayBuffer()).byteLength, 0);
assert.equal((await request("/missing")).status, 404);
assert.equal((await request("/", { method: "POST" })).status, 405);

const marketplace = JSON.parse(await readFile(new URL("../.claude-plugin/marketplace.json", import.meta.url), "utf8"));
assert.equal(marketplace.plugins[0].name, "claude-dysentery");
const plugin = JSON.parse(await readFile(new URL("../plugins/claude-dysentery/.claude-plugin/plugin.json", import.meta.url), "utf8"));
assert.equal(plugin.version, "1.0.0");

console.log("Worker routes, downloads, logo, and canonical directive passed.");
