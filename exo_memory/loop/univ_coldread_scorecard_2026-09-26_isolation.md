# P-UNIV-COLDREAD — the isolation route, FOUND and VERIFIED (librarian, on D, 2026-09-26 01:1x)

Follows `loop/univ_coldread_scorecard_2026-09-24.md` §2 (F-PRIME fired: `--setting-sources project` still loads
`~/.claude/CLAUDE.md`, upstream #87590).

## What was tried, in order (the same 2-call probe each time: a positive control with a nonce CLAUDE.md, and the empty check)
1. **The keeper's `claude setup-token`** was stored as the User var `UNIV_ISOLATED_OAUTH_TOKEN`: 108 chars, an
   `sk-ant-oat` prefix, never printed, and not `CLAUDE_CODE_OAUTH_TOKEN`, so no seat's login changed. **Auth works.**
2. **`CLAUDE_CONFIG_DIR` → an empty temp dir, plus the token:** the check STILL quoted the global CHANGELOG line. FAIL.
3. **Plus `USERPROFILE` and `HOME` → a temp home:** STILL quoted. FAIL. On Windows the user-memory path is not
   redirected by those variables.
4. **`claudeMdExcludes` in the `--settings` file** (the documented setting, `code.claude.com/docs/en/memory` "Exclude
   specific CLAUDE.md files"), with `["C:/Users/nname/.claude/CLAUDE.md", "C:\Users\nname\.claude\CLAUDE.md",
   "C:/Users/nname/.claude/rules/**"]` → **control `CODEWORD: <nonce>`, `CHANGELOG: NONE`; check `CODEWORD: NONE`,
   `CHANGELOG: NONE`. PASS.**

## THE ROUTE OF RECORD (every subject call)
- An empty temp cwd, and `CLAUDE_CONFIG_DIR` set to an empty temp dir.
- `CLAUDE_CODE_OAUTH_TOKEN` taken from the User var `UNIV_ISOLATED_OAUTH_TOKEN`, **for the child process only**.
- `claude -p … --setting-sources project --settings <file with {"disableAllHooks":true,"claudeMdExcludes":[…the three patterns…]}>`
  plus `--tools '""' --strict-mcp-config --mcp-config <file with {"mcpServers":{}}> --no-session-persistence`.
- On Windows PowerShell, pass the JSON as FILES: PowerShell 5.1 strips the quotes from inline JSON arguments ("Invalid
  JSON provided to --settings").
- **Re-run the 2-call probe before each batch;** the check must return `CHANGELOG: NONE`.

F-PRIME is therefore CLEARED for this route. The next gate is F-PROMPT (§5.1): the direction check by a seat that has not
read §7. Then stages 1–2, run by NON-author seats (C designed it; A, B and E have not selected, coded or scored it). The
deadline is 2026-09-29.
