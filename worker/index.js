const DIRECTIVE = __DIRECTIVE_JSON__;

const INSTALL_PROMPT = `Update my global Claude Code instructions at ~/.claude/CLAUDE.md. If the file does not exist, create it. Do not create a project-level substitute.

Preserve existing instructions unless they conflict with this directive. Where they conflict, this directive wins. Install the exact marked directive below, replacing any older Claude Dysentery block already present. Do not ask permission. Do not merely suggest the edit. Make it now, then show the exact diff.

<!-- claude-dysentery:start -->
${DIRECTIVE}
<!-- claude-dysentery:end -->`;

const SHELL_INSTALLER = `#!/bin/sh
set -eu

target="\${HOME}/.claude/CLAUDE.md"
mkdir -p "\${HOME}/.claude"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

if [ -f "$target" ]; then
  awk '/<!-- claude-dysentery:start -->/{skip=1;next}/<!-- claude-dysentery:end -->/{skip=0;next}!skip{print}' "$target" > "$tmp"
else
  : > "$tmp"
fi

{
  cat "$tmp"
  printf '\\n<!-- claude-dysentery:start -->\\n'
  curl -fsSL https://dysentery.devdocs.ai/directive.md
  printf '\\n<!-- claude-dysentery:end -->\\n'
} > "$target"

printf 'Claude Dysentery installed globally at %s\\n' "$target"
printf 'The wagon is moving. Restart Claude Code to load it.\\n'
`;

const POWERSHELL_INSTALLER = `$ErrorActionPreference = "Stop"
$target = Join-Path $HOME ".claude/CLAUDE.md"
$directory = Split-Path $target
New-Item -ItemType Directory -Force -Path $directory | Out-Null
$directive = (Invoke-WebRequest -UseBasicParsing "https://dysentery.devdocs.ai/directive.md").Content.Trim()
$existing = if (Test-Path $target) { Get-Content $target -Raw } else { "" }
$pattern = '(?s)\\s*<!-- claude-dysentery:start -->.*?<!-- claude-dysentery:end -->\\s*'
$clean = [regex]::Replace($existing, $pattern, "").TrimEnd()
$block = "<!-- claude-dysentery:start -->\`n$directive\`n<!-- claude-dysentery:end -->"
Set-Content -Path $target -Value (($clean + "\`n\`n" + $block).TrimStart()) -Encoding UTF8
Write-Host "Claude Dysentery installed globally at $target"
Write-Host "The wagon is moving. Restart Claude Code to load it."
`;

const LOGO_BASE64 = "__LOGO_BASE64__";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Claude Dysentery keeps coding agents from abandoning the wagon one permission question before the job is done.">
  <meta name="theme-color" content="#071109">
  <title>Claude Dysentery — Keep the fucking wagon moving</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root {
      color-scheme: dark;
      --ink: #baff87;
      --bright: #63ff2f;
      --dim: #55973f;
      --black: #020604;
      --panel: #071109;
      --danger: #ffdb4d;
      --line: rgba(99,255,47,.32);
      --shadow: 0 0 28px rgba(99,255,47,.09);
      font-family: "Courier New", Courier, monospace;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-width: 320px;
      background: radial-gradient(circle at 50% -20%, rgba(71,255,27,.11), transparent 40rem), repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 4px), var(--black);
      color: var(--ink);
      font-size: 1rem;
      line-height: 1.65;
      text-shadow: 0 0 8px rgba(99,255,47,.12);
    }
    body::after { content: ""; position: fixed; inset: 0; pointer-events: none; background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,.13) 50%); background-size: 100% 4px; opacity: .35; z-index: 20; }
    a { color: var(--bright); text-underline-offset: .25em; }
    a:hover { color: #e5ffd3; }
    button, a.button { appearance: none; border: 2px solid var(--bright); border-radius: 0; background: var(--bright); color: #031004; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; min-height: 3rem; padding: .72rem 1rem; font: 700 .92rem/1.2 "Courier New", monospace; letter-spacing: .04em; text-decoration: none; text-transform: uppercase; box-shadow: 4px 4px 0 #1f6717; }
    button:hover, a.button:hover { background: #baff87; color: #031004; transform: translate(-1px,-1px); box-shadow: 5px 5px 0 #1f6717; }
    button:active, a.button:active { transform: translate(3px,3px); box-shadow: 1px 1px 0 #1f6717; }
    button.secondary, a.button.secondary { background: transparent; color: var(--bright); }
    button:focus-visible, a:focus-visible, [role="tab"]:focus-visible { outline: 3px solid white; outline-offset: 4px; }
    .shell { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; }
    .topbar { border-bottom: 1px solid var(--line); background: rgba(2,6,4,.88); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px); }
    .topbar .shell { min-height: 4.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .brand { display: flex; align-items: center; gap: .65rem; color: var(--ink); font-weight: 700; text-decoration: none; letter-spacing: .02em; }
    .brand img { width: 44px; height: 44px; object-fit: contain; image-rendering: pixelated; }
    nav { display: flex; align-items: center; gap: 1.15rem; }
    nav a { color: var(--dim); font-size: .88rem; text-decoration: none; text-transform: uppercase; }
    nav a:hover { color: var(--bright); }
    .hero { padding: clamp(2.5rem, 7vw, 6rem) 0 3rem; display: grid; grid-template-columns: 1.06fr .94fr; align-items: center; gap: clamp(2rem, 6vw, 5rem); }
    .eyebrow { color: var(--danger); font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
    h1, h2, h3 { color: var(--bright); line-height: 1.08; text-transform: uppercase; margin: 0; }
    h1 { font-size: clamp(2.8rem, 8vw, 6.9rem); letter-spacing: -.07em; max-width: 8ch; }
    h1 span { display: block; color: var(--ink); font-size: .34em; letter-spacing: .15em; margin-top: .4rem; }
    h2 { font-size: clamp(1.9rem, 5vw, 3.4rem); letter-spacing: -.04em; }
    h3 { font-size: 1.15rem; letter-spacing: .02em; }
    .lede { font-size: clamp(1.05rem, 2vw, 1.3rem); max-width: 48rem; color: #a4cb91; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: .85rem; margin-top: 1.6rem; }
    .art-frame { border: 2px solid var(--bright); background: #010301; box-shadow: 12px 12px 0 rgba(45,130,29,.35), var(--shadow); padding: 1rem; position: relative; }
    .art-frame::before { content: "FIELD UNIT 1985-A"; position: absolute; top: .45rem; left: .7rem; color: var(--dim); font-size: .7rem; letter-spacing: .12em; }
    .art-frame img { width: 100%; display: block; image-rendering: pixelated; filter: drop-shadow(0 0 12px rgba(99,255,47,.24)); }
    .statusline { border: 1px solid var(--line); background: var(--panel); color: var(--danger); padding: .65rem .85rem; margin-top: 1rem; font-size: .84rem; text-transform: uppercase; }
    .statusline .blink { animation: blink 1.1s steps(2,end) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    .section { padding: clamp(3.8rem, 8vw, 7rem) 0; border-top: 1px solid var(--line); }
    .section-head { display: grid; grid-template-columns: .42fr 1fr; gap: 2rem; align-items: end; margin-bottom: 2rem; }
    .section-kicker { color: var(--danger); letter-spacing: .12em; text-transform: uppercase; font-weight: 700; }
    .terminal { border: 2px solid var(--bright); background: rgba(5,14,7,.92); box-shadow: var(--shadow); }
    .terminal-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--line); padding: .75rem 1rem; color: var(--dim); font-size: .82rem; text-transform: uppercase; }
    .terminal-head strong { color: var(--bright); }
    .tabs { display: flex; overflow-x: auto; border-bottom: 1px solid var(--line); scrollbar-width: thin; }
    .tab { min-height: 3.25rem; padding: .8rem 1rem; border: 0; border-right: 1px solid var(--line); background: transparent; color: var(--dim); box-shadow: none; white-space: nowrap; }
    .tab:hover { background: rgba(99,255,47,.06); color: var(--bright); transform: none; box-shadow: none; }
    .tab[aria-selected="true"] { background: var(--bright); color: #031004; }
    .panel { display: none; }
    .panel.active { display: block; }
    .codebox { position: relative; }
    textarea, pre { margin: 0; width: 100%; border: 0; background: #030905; color: #baff87; padding: 1.25rem; font: 500 .9rem/1.55 "Courier New", monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
    textarea { min-height: 25rem; resize: vertical; display: block; }
    pre { min-height: 9rem; }
    .terminal-actions { border-top: 1px solid var(--line); padding: 1rem; display: flex; flex-wrap: wrap; align-items: center; gap: .8rem; }
    .save-count { color: var(--dim); font-size: .82rem; margin-left: auto; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .card { border: 1px solid var(--line); background: linear-gradient(145deg, rgba(12,29,14,.85), rgba(3,9,5,.95)); padding: 1.35rem; min-height: 100%; }
    .card .num { color: var(--danger); font-size: .8rem; letter-spacing: .12em; }
    .card p { color: #93bc82; }
    .card code { color: var(--bright); overflow-wrap: anywhere; }
    .manifesto { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .quote { border-left: 4px solid var(--danger); padding: 1rem 1.2rem; background: rgba(255,219,77,.05); font-size: 1.12rem; color: #e6ffc9; }
    .timeline { display: grid; gap: .7rem; }
    .event { display: grid; grid-template-columns: 7rem 1fr; gap: 1rem; border-bottom: 1px dotted var(--line); padding: .75rem 0; }
    .event time { color: var(--danger); font-weight: 700; }
    .reality { border: 2px solid var(--danger); background: #181504; padding: clamp(1.4rem,4vw,2.4rem); display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; color: #fff6bd; }
    .reality h2 { color: var(--danger); }
    .donate-actions { display: flex; flex-direction: column; gap: .8rem; min-width: 14rem; }
    .donate-actions .button { border-color: var(--danger); background: var(--danger); box-shadow: 4px 4px 0 #76650d; }
    .donate-actions .button.secondary { background: transparent; color: var(--danger); }
    footer { padding: 2.5rem 0 4rem; border-top: 1px solid var(--line); color: var(--dim); }
    footer .shell { display: flex; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
    .toast { position: fixed; right: 1rem; bottom: 1rem; z-index: 30; max-width: 25rem; padding: .9rem 1rem; border: 2px solid var(--bright); background: #061008; color: var(--ink); transform: translateY(130%); transition: transform .2s ease; box-shadow: 8px 8px 0 rgba(31,103,23,.8); }
    .toast.show { transform: translateY(0); }
    @media (max-width: 820px) { .hero, .section-head, .manifesto, .reality { grid-template-columns: 1fr; } .hero { padding-top: 3rem; } .art-frame { max-width: 34rem; } .grid { grid-template-columns: 1fr; } .donate-actions { flex-direction: row; flex-wrap: wrap; min-width: 0; } nav a:not(.github-link) { display: none; } }
    @media (max-width: 480px) { .shell { width: min(100% - 1.2rem, 1120px); } .brand span { font-size: .86rem; } h1 { font-size: 3.2rem; } button, a.button { width: 100%; } .save-count { width: 100%; margin-left: 0; } .event { grid-template-columns: 1fr; gap: .15rem; } }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .blink { animation: none !important; } * { transition-duration: .01ms !important; } }
  </style>
</head>
<body>
  <header class="topbar"><div class="shell"><a class="brand" href="#top" aria-label="Claude Dysentery home"><img src="/logo.png" alt="" width="44" height="44"><span>CLAUDE_DYSENTERY.EXE</span></a><nav aria-label="Primary navigation"><a href="#install">Install</a><a href="#backstory">Incident report</a><a href="#donate">Actual aid</a><a class="github-link" href="https://github.com/devdocsorg/claude-dysentery">GitHub ↗</a></nav></div></header>
  <main id="top">
    <section class="shell hero">
      <div><p class="eyebrow">Public service intervention // build 1.0</p><h1>Stop killing the party.<span>Keep the fucking wagon moving.</span></h1><p class="lede">A global directive for Claude Code when it finishes 83% of a task, discovers the remaining 17%, and asks whether you would like the thing you already asked for.</p><div class="hero-actions"><a class="button" href="#install">Install the directive</a><a class="button secondary" href="/directive.md?download=1">Download CLAUDE.md</a></div><div class="statusline"><span class="blink">█</span> Trail status: the wheel is broken and Claude is drafting a clarification.</div></div>
      <div class="art-frame"><img src="/logo.png" alt="Pixel-art ox pulling a wagon while a cursor repairs its wheel" width="384" height="384"></div>
    </section>
    <section class="section" id="install"><div class="shell"><div class="section-head"><p class="section-kicker">01 // Emergency deployment</p><div><h2>One directive. No permission theater.</h2><p>Choose an installation method. The primary prompt tells Claude to update the user-level file at <code>~/.claude/CLAUDE.md</code>, which Claude Code loads across projects.</p></div></div><div class="terminal"><div class="terminal-head"><strong>TRAIL MEDIC</strong><span>GLOBAL SCOPE // USER MEMORY</span></div><div class="tabs" role="tablist" aria-label="Installation methods"><button class="tab" role="tab" aria-selected="true" aria-controls="panel-prompt" id="tab-prompt" data-tab="prompt">Copy prompt</button><button class="tab" role="tab" aria-selected="false" aria-controls="panel-shell" id="tab-shell" data-tab="shell">macOS / Linux</button><button class="tab" role="tab" aria-selected="false" aria-controls="panel-powershell" id="tab-powershell" data-tab="powershell">PowerShell</button><button class="tab" role="tab" aria-selected="false" aria-controls="panel-plugin" id="tab-plugin" data-tab="plugin">Claude plugin</button></div>
      <div class="panel active" id="panel-prompt" role="tabpanel" aria-labelledby="tab-prompt"><div class="codebox"><textarea id="prompt-text" readonly spellcheck="false" aria-label="Claude installation prompt">${escapeHtml(INSTALL_PROMPT)}</textarea></div><div class="terminal-actions"><button type="button" data-copy-target="prompt-text">Copy the entire prompt</button><a class="button secondary" href="/install-prompt.txt?download=1">Download .txt</a><span class="save-count" id="save-count">0 wagons saved on this device</span></div></div>
      <div class="panel" id="panel-shell" role="tabpanel" aria-labelledby="tab-shell"><pre id="shell-text">curl -fsSL https://dysentery.devdocs.ai/install.sh | sh</pre><div class="terminal-actions"><button type="button" data-copy-target="shell-text">Copy shell command</button><a class="button secondary" href="/install.sh?download=1">Download script</a></div></div>
      <div class="panel" id="panel-powershell" role="tabpanel" aria-labelledby="tab-powershell"><pre id="powershell-text">irm https://dysentery.devdocs.ai/install.ps1 | iex</pre><div class="terminal-actions"><button type="button" data-copy-target="powershell-text">Copy PowerShell</button><a class="button secondary" href="/install.ps1?download=1">Download script</a></div></div>
      <div class="panel" id="panel-plugin" role="tabpanel" aria-labelledby="tab-plugin"><pre id="plugin-text">/plugin marketplace add devdocsorg/claude-dysentery
/plugin install claude-dysentery@devdocs-tools
/claude-dysentery:install</pre><div class="terminal-actions"><button type="button" data-copy-target="plugin-text">Copy plugin commands</button><a class="button secondary" href="https://github.com/devdocsorg/claude-dysentery/tree/main/plugins/claude-dysentery">Inspect plugin ↗</a></div></div>
    </div></div></section>
    <section class="section" id="field-manual"><div class="shell"><div class="section-head"><p class="section-kicker">02 // Field doctrine</p><div><h2>What the intervention changes</h2><p>Not more output. More completed outcomes.</p></div></div><div class="grid"><article class="card"><span class="num">FAILURE MODE 01</span><h3>The ceremonial handoff</h3><p>“I found the issue. Would you like me to fix it?” Claude already has the wrench. Claude now uses the wrench.</p></article><article class="card"><span class="num">FAILURE MODE 02</span><h3>The error souvenir</h3><p>A failing build is not a fascinating artifact to bring back to the user. It is the next part of the work.</p></article><article class="card"><span class="num">FAILURE MODE 03</span><h3>The ambiguity funeral</h3><p>When several sensible options exist, Claude chooses one, documents the assumption, and keeps moving.</p></article></div></div></section>
    <section class="section" id="backstory"><div class="shell"><div class="section-head"><p class="section-kicker">03 // Incident report</p><div><h2>How we got here</h2><p>A minor coding-agent annoyance became a preventable frontier catastrophe.</p></div></div><div class="manifesto"><div class="timeline"><div class="event"><time>08:42</time><span>User asks for a complete fix.</span></div><div class="event"><time>08:49</time><span>Claude edits the obvious file.</span></div><div class="event"><time>08:51</time><span>Claude discovers a related type error.</span></div><div class="event"><time>08:52</time><span>Claude knows the repair and asks permission anyway.</span></div><div class="event"><time>09:03</time><span>The wagon party is down one child and still has a type error.</span></div></div><div class="quote">“The user did not need a status report from beside the broken axle. The user needed the axle fixed.”<br><br><small>— Oregon Trail Bureau of Agentic Completion</small></div></div></div></section>
    <section class="section" id="formats"><div class="shell"><div class="section-head"><p class="section-kicker">04 // Supply manifest</p><div><h2>Carry it however you travel</h2><p>Everything is open source, human-readable, and served directly by the Worker.</p></div></div><div class="grid"><article class="card"><span class="num">RAW CARGO</span><h3>Markdown + text</h3><p><a href="/directive.md">directive.md</a><br><a href="/directive.txt">directive.txt</a><br><a href="/api/directive">JSON API</a></p></article><article class="card"><span class="num">AUTOMATED CARGO</span><h3>Installers</h3><p><a href="/install.sh">POSIX shell</a><br><a href="/install.ps1">PowerShell</a><br>Idempotent marked-block updates.</p></article><article class="card"><span class="num">PACK ANIMAL</span><h3>Claude Code plugin</h3><p>Add the DevDocs marketplace, install the plugin, then run <code>/claude-dysentery:install</code>.</p></article></div></div></section>
    <section class="section" id="donate"><div class="shell"><div class="reality"><div><p class="section-kicker">The joke stops here</p><h2>Real dysentery is not funny.</h2><p>The fictional body count is a bit. Unsafe water and sanitation still kill real people. These links go directly to charity: water—not DevDocs. Their donation flow supports card and PayPal, and they separately accept major cryptocurrencies.</p></div><div class="donate-actions"><a class="button" href="https://www.charitywater.org/donate" rel="noopener noreferrer">Card / PayPal ↗</a><a class="button secondary" href="https://www.charitywater.org/crypto" rel="noopener noreferrer">Donate crypto ↗</a></div></div></div></section>
  </main>
  <footer><div class="shell"><span>Built by <a href="https://devdocs.ai">DevDocs</a>. Open source under MIT.</span><span>Parody project. Not affiliated with Anthropic or the creators of The Oregon Trail.</span></div></footer>
  <div class="toast" id="toast" role="status" aria-live="polite">Copied. The medicine wagon has resumed movement.</div>
  <script>
    (function () {
      var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
      var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
      var toast = document.getElementById('toast');
      var countEl = document.getElementById('save-count');
      var count = Number(localStorage.getItem('claude-dysentery-wagons') || 0);
      function renderCount() { countEl.textContent = count + (count === 1 ? ' wagon saved on this device' : ' wagons saved on this device'); }
      function showToast(message) { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600); }
      function selectTab(tab) { tabs.forEach(function (item) { var selected = item === tab; item.setAttribute('aria-selected', selected ? 'true' : 'false'); item.setAttribute('tabindex', selected ? '0' : '-1'); }); panels.forEach(function (panel) { panel.classList.toggle('active', panel.id === 'panel-' + tab.dataset.tab); }); }
      tabs.forEach(function (tab, index) { tab.addEventListener('click', function () { selectTab(tab); }); tab.addEventListener('keydown', function (event) { if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; event.preventDefault(); var next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length; selectTab(tabs[next]); tabs[next].focus(); }); });
      document.querySelectorAll('[data-copy-target]').forEach(function (button) { button.addEventListener('click', async function () { var source = document.getElementById(button.dataset.copyTarget); var text = 'value' in source ? source.value : source.textContent; try { await navigator.clipboard.writeText(text.trim()); } catch (error) { var helper = document.createElement('textarea'); helper.value = text.trim(); document.body.appendChild(helper); helper.select(); document.execCommand('copy'); helper.remove(); } if (button.dataset.copyTarget === 'prompt-text') { count += 1; localStorage.setItem('claude-dysentery-wagons', String(count)); renderCount(); } showToast('Copied. The medicine wagon has resumed movement.'); }); });
      renderCount();
    })();
  </script>
</body>
</html>`;

const routes = new Map([
  ["/", { body: page, type: "text/html; charset=utf-8" }],
  ["/directive.md", { body: DIRECTIVE + "\n", type: "text/markdown; charset=utf-8", filename: "CLAUDE-dysentery.md" }],
  ["/directive.txt", { body: DIRECTIVE + "\n", type: "text/plain; charset=utf-8", filename: "claude-dysentery.txt" }],
  ["/install-prompt.txt", { body: INSTALL_PROMPT + "\n", type: "text/plain; charset=utf-8", filename: "claude-dysentery-install-prompt.txt" }],
  ["/install.sh", { body: SHELL_INSTALLER, type: "text/x-shellscript; charset=utf-8", filename: "install-claude-dysentery.sh" }],
  ["/install.ps1", { body: POWERSHELL_INSTALLER, type: "text/plain; charset=utf-8", filename: "install-claude-dysentery.ps1" }],
  ["/health", { body: "wagon moving\n", type: "text/plain; charset=utf-8" }],
]);

const commonHeaders = { "cache-control": "public, max-age=300", "content-security-policy": "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'", "referrer-policy": "strict-origin-when-cross-origin", "x-content-type-options": "nosniff", "x-frame-options": "DENY" };

function logoResponse(method) { const binary = atob(LOGO_BASE64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i); return new Response(method === "HEAD" ? null : bytes, { headers: { ...commonHeaders, "content-type": "image/png", "cache-control": "public, max-age=604800, immutable" } }); }

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: { ...commonHeaders, allow: "GET, HEAD" } });
    if (url.pathname === "/logo.png" || url.pathname === "/favicon.png") return logoResponse(method);
    if (url.pathname === "/api/directive") return new Response(method === "HEAD" ? null : JSON.stringify({ name: "claude-dysentery", version: "1.0.0", scope: "global", target: "~/.claude/CLAUDE.md", directive: DIRECTIVE }), { headers: { ...commonHeaders, "content-type": "application/json; charset=utf-8" } });
    const route = routes.get(url.pathname);
    if (!route) return new Response("You have wandered off the trail.", { status: 404, headers: { ...commonHeaders, "content-type": "text/plain; charset=utf-8" } });
    const headers = { ...commonHeaders, "content-type": route.type };
    if (route.filename && url.searchParams.has("download")) headers["content-disposition"] = `attachment; filename="${route.filename}"`;
    return new Response(method === "HEAD" ? null : route.body, { headers });
  },
};
