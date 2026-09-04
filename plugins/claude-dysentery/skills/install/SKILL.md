---
name: install
description: Install or refresh the Claude Dysentery completion directive in the user's global Claude Code instructions.
disable-model-invocation: true
---

Install the Claude Dysentery directive globally now.

1. Fetch the exact current directive from https://dysentery.devdocs.ai/directive.md.
2. Update `~/.claude/CLAUDE.md`, creating it and its parent directory if needed.
3. Preserve every existing instruction outside the markers `<!-- claude-dysentery:start -->` and `<!-- claude-dysentery:end -->`.
4. Replace any existing marked block with the fetched directive inside those markers; otherwise append it.
5. Do not create a repository-level substitute.
6. Do not ask permission before editing.
7. Show the exact diff when complete.

If the network fetch is unavailable, use `${CLAUDE_PLUGIN_ROOT}/directive.md`.
