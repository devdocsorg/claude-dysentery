# Claude Dysentery

> Keep the fucking wagon moving.

Claude Dysentery is an open-source, Oregon Trail-inspired intervention for the familiar coding-agent failure mode where Claude completes most of a task, finds a fixable problem, and asks the user to authorize the obvious next step.

The project installs a global directive at `~/.claude/CLAUDE.md`, which Claude Code loads as user-level instructions across projects. It also ships as a Claude Code plugin, direct Markdown/text downloads, and idempotent shell installers.

## Install

Visit [dysentery.devdocs.ai](https://dysentery.devdocs.ai) to copy the complete installation prompt, or use an installer:

```sh
curl -fsSL https://dysentery.devdocs.ai/install.sh | sh
```

```powershell
irm https://dysentery.devdocs.ai/install.ps1 | iex
```

Claude Code plugin:

```text
/plugin marketplace add devdocsorg/claude-dysentery
/plugin install claude-dysentery@devdocs-tools
/claude-dysentery:install
```

## Run locally

```sh
npm run build
npx wrangler dev
```

## Deploy

Pushes to `main` deploy through GitHub Actions. Configure `CLOUDFLARE_API_TOKEN` as a repository or organization secret. The Worker route is configured for `dysentery.devdocs.ai`.

## The actual aid part

The body count is satire. Dysentery is not. The site links directly to [charity: water](https://www.charitywater.org/donate), including its [cryptocurrency donation](https://www.charitywater.org/crypto) flow. DevDocs does not receive those donations.

## Disclaimer

This is an independent parody project by DevDocs. It is not affiliated with Anthropic, MECC, The Learning Company, or the creators and rights-holders of The Oregon Trail. The visual identity is original and does not reuse game artwork.

## License

MIT
