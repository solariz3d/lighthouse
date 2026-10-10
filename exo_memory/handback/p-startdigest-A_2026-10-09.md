# p-startdigest-A — D277 part 5, the session-start digest behind the switch, seat A, 2026-10-09

Lighthouse worktree `C:\Users\nname\Desktop\worktrees\a-sd-wt`, branch `startdigest-a` from main `9b5f40ba`. **One commit `0794577d`**, named paths, local, **not pushed, not installed, not landed** (the chair's rule: not before 2026-10-10T11:55Z).
Files: `dev/shell/hooks/session-start.js`, `dev/shell/hooks/session-start-light.test.js` (new), `consonance/tools/portable-paths.baseline.json` (4 sites), `consonance/GATES.md` (one paragraph under the switch), and the evidence in `exo_memory/loop/startdigest_evidence/` (`citations.js` + `citations_out.txt`, `measure.js` + `measure_out.md`).
**Inert until `"gates_mode": "light"` is set in `~/.consonance.json`**; with the key absent the output is byte-identical to today's. The live hook at `~/.claude/shell/hooks/session-start.js` is a copy and does not change until `install.ps1 -Only session-start.js`; I did not run it and no test touches the real `~/.claude/shell` (every row uses a copy of the hook, a temp shell dir, a temp HOME and a fixed clock).

## Before and after (`node exo_memory/loop/startdigest_evidence/measure.js`; tokens are bytes/4, the census' ratio)
Run on a COPY of the real digests of this machine (`2026-10-05.md`, `2026-10-06.md`), the OLD hook taken from `git show 9b5f40ba:dev/shell/hooks/session-start.js`, a fixed clock. Whole `additionalContext`:

| seat cwd | source | before: bytes · tokens · non-empty lines | key absent | light: bytes · tokens · lines | cut |
|---|---|---|---|---|---|
| librarian | startup | 13,446 · ~3,362 · 840 | identical | **1,403 · ~351 · 31** | 89.6% |
| librarian | resume | 13,446 · ~3,362 · 840 | identical | **1,116 · ~279 · 31** | 91.7% |
| librarian | compact | 13,446 · ~3,362 · 840 | identical | **1,116 · ~279 · 31** | 91.7% |
| main, sibling A | all three | 13,441 / 13,453 | identical | 1,398 / 1,410 startup; 1,111 / 1,123 resume and compact | 89.5–91.7% |
| third-place | all three | 385 · ~96 · 11 | identical | 385 (unchanged) | 0% |

**Key absent: identical to the old hook in 12 of 12 cases** (4 cwds × 3 sources). The 840 lines are the census' figure. The ~3.4k tokens before are the census' 3.0–3.4k. An estimate by bytes/4 is not a tokenizer's count.

## How I judged what a waking seat uses (`node exo_memory/loop/startdigest_evidence/citations.js`)
Read, not guessed: the script finds every SessionStart injection of this hook in the six committee seats' transcripts (**1,185 transcripts, 1,381 injections; the Third Place excluded, its transcripts are private by the room's rule**), splits each into its sections, and asks whether the seat's own later output (assistant text and tool-call inputs, never tool results) up to the next injection carries something that section alone could have given it. Of 1,381 injections 1,360 were followed by output.

- **Digest times: quoted back 0 times in 1,360** (`HH:MM:SS UTC`, verbatim), in any seat, at startup, resume or compact.
- **Recent sessions' ISO times: 0 of 1,360.**
- **The digest words** (`session digest`, `the digest`, `## N sessions`) hit 1 of 956 startups and about 20% of resumes and compacts. I read the first 30 hits in context (`citations_out.txt`): they are other digests (the board digest, the pulse's digest line, the ask digest-auditor, a sha digest) or a seat describing the hook to the keeper ("they add the date, the location and the sun and moon, the recent session digests…"). **None quotes the injected digest.**
- Ambient words (sunrise, moon, altitude…): 0 of 956 at startup, 6 of 101 compacts, 4 of 268 resumes; **kept anyway** (200 bytes, and the chair listed it).
- So a count and a few latest times is what the digest can still give that a seat could not get any other way: the pulse and the state block carry the chain, the board and the time. That is a judgement from absence of quotation, and **absence of quotation is not absence of use** (below).

## What light does (`lightDigest`, `session-start.js`)
- Each of the two recent days: `### <date>`, the day's total (`482 sessions`), then one line per folder: `- <cwd>: <count>`; the **newest day also the last three start times, newest first**, unless the source is `resume` or `compact` (a thread that was never dark): counts only.
- A line with text after the time still counts (the text is dropped); a digest light cannot read (no `## N sessions`, no `###` groups, empty, junk) is **left exactly as strict leaves it**: a parse failure hides nothing.
- **Untouched, byte for byte (row 4):** the ambient block, the seat's own recent sessions, the L3 notices, the night table (the "While you were dark" knocks, where dreams land), and the Third Place's wake (row 5).
- The switch is read as `sources-gate.js`' `gatesModeFrom` reads it (copied, with the master named in a comment): absent, unreadable, not JSON, a non-string or any other word is strict; `light` in any case, trimmed, a BOM before the JSON, is light.

## Rows (`dev/shell/hooks/session-start-light.test.js`, 6 rows, 6 pass)
The fixture is two days of digests in the real layout and size (a 482-session day and a 215-session day; 8 folders; the real 2026-10-05 has 323); its unmodified-hook output is **12,539 bytes**, inside the census' 12.2–13.5 KB.
1. **Key absent, "strict", "lite", "warn", true, 1, ["light"], null, "", unreadable, not JSON, `[]`: byte-for-byte the old hook** — pinned by **sha256 of the UNMODIFIED hook's output** on the fixture (startup, resume, compact), computed at `9b5f40ba` before any edit. Green before and after: it is the guard.
2. **Light at startup:** under the **2,200 B** budget (measured real 1,403; fixture 11,658 B before, red first), under a fifth of strict; the ambient block first; each folder's count right; the last three of the newest day, newest first; the older day counts only; no timestamp list left; the seat's own recent sessions stay; `' light '`, `LIGHT`, `Light` and a BOM all give the same text.
3. **Light on resume and compact:** under **1,600 B** (measured real 1,116), counts only, no `· last`.
4. **Light changes only the digests** (L3 notice and a night-table knock both present and identical).
5. **Third Place:** same text in both modes.
6. **Unreadable digests** fall back to strict's text; a text-after-time line counts; no digests dir does not throw.
- **Red first:** rows 2, 3 and 6 on the unmodified hook (`11,658 B is over 2,200`, `resume: 11,658 B is over 1,600`, the text-line count). Rows 4 and 5 passed trivially before the trim (light = strict), so they are guards, not red-firsts; **24 of 24 mutants of the change caught** (always-light, never-light, no trim, no lowercase, no BOM strip, any truthy string, wrong config path, no fallback, times on every day / on resume / never, last two / four / oldest first / first three, count, total dropped, the Third Place gaining digests, and light dropping the ambient block, the L3 notices, the seat's own sessions or the night table).
- Other checks, all green: `third-place-gate` 7, `shell-dir-seam` 4, `dirs` 5, `gate-mode` 6, `dream-gate` 71/0, `session-end` 8, `userprompt-submit` 5, `identity-diff` 9, `front-door-links` 4, `about-readme` 1, `carrier-drift.test.js` 57, `carrier-drift.js` GREEN, **`portable-paths.js` green** (after: the production regex is written `[0-9]{2}` because the guard read `\d\d:\d\d` as a drive path `d:\d` — a false positive, now not there to misread; and the test's four drive-letter fixture strings blessed BENIGN-TEST by `--update`, the baseline diff is exactly those four entries).

## To land it at the timer
`install.ps1 -Only session-start.js` copies the hook (byte-identical output until the key is set); then `"gates_mode": "light"` flips it with everything else. Rollback is removing the key. `GATES.md` has the paragraph.

## What this does not establish
- **Absence of quotation is not absence of use.** A seat can orient from a line without repeating it; the citation test would miss that, and a seat that read "482 sessions" and moved on looks the same as one that never saw it. The later (b) and (c) measures are the check on whether waking seats do worse; this file is not.
- The citations cover the six committee seats' history since July (when L3 notices were also injected: the historical median injection was 29 KB at startup because of L3 text, which today's room no longer emits — the last L3 verdict is 2026-09-22). The 13.4 KB figure is today's.
- bytes/4 is the census' ratio, not a tokenizer. Budgets (2,200 and 1,600) are 1.5× the measured real numbers.
- The Third Place's cwd, the `fresh` panes and the dream cycle are unchanged by construction (the dream gate exits before any of this; the night table that carries dreams is untouched).
- **A thing noticed, not fixed:** the two digests this hook injects today are **2026-10-05 and 2026-10-06**; nothing has been written to `~/.claude/shell/digests/` since `2026-10-06.md` was last modified (Oct 6 20:52), so every session start in the last three days carried digests that old (`ls -la ~/.claude/shell/digests`). *inferred:* the SessionEnd hook that writes them is not reaching its write (my D273 follow-up found `session-end.js` throwing silently on the longest transcripts; that fix, `50b5cd63`, is not installed), but I did not run it to find out. Light mode makes the staleness cost 1.4 KB instead of 13 KB; it does not fix the writer.

NEXT: chair hold startdigest-a (0794577d) for the 10-10 timer, then install session-start.js and set gates_mode light with the rest; and decide whether to install 50b5cd63 so the digests are written again

## D277 landing fix (2026-10-10) — portable-paths red on land-d277-base, green after one commit

Worktree `C:\Users\nname\Desktop\worktrees\a-lf-wt`, branch `landfix-a`, on top of `land-d277-base` = `b345b481`. One commit, named paths, local, not pushed. Before: `node consonance/tools/portable-paths.js` RED, 6 sites (4 BENIGN-TEST in my `dev/shell/hooks/session-start-light.test.js` :24 :97 :127 :129; 2 FATAL-SHIPPED-INSTRUCTION in `consonance/src-tauri/brief/LIBRARIAN.md` :70 :136).

- **LIBRARIAN.md :70** (B's text): removed `; on machine D, ` + the absolute `exo_memory\librarian\` path. It now ends `...names).`, the `room_path` wording that was already there.
- **LIBRARIAN.md :136** (B's text): removed ` (on D, <the lighthouse checkout path>)`. **A second cause the packet did not name:** after that removal the line was still RED, because it quotes the old brief's stale absolute path `C:/Consonance/lighthouse/exo_memory/librarian/` (the "fact fix 6" sentence), which the scanner reads as a shipped absolute path too. I reworded only that clause: `The absolute notes path the original line gave (a lighthouse folder under the Consonance data root) does not exist on this machine.` Same fact, no literal path. **This goes one step past "change nothing else"; it was the only way to green.** B should check it still says what fact fix 6 meant.
- **Baseline** (`portable-paths --update`): `BENIGN-TEST` 350 -> 354 (exactly my four test sites, read by eye), `FATAL-SHIPPED-INSTRUCTION` 2 -> 1 (the entry for the old LIBRARIAN :160 text dropped because that text is gone; the one left is not from this edit). The hand-kept `third-place-gate.test.js:44` verdict was kept (`=` row).
- **Re-run:** `portable-paths` green (373 files, 420 known sites, 0 new); `carrier-drift` GREEN; `session-start-light.test.js` 6/0.
- **For B:** the two edited lines are yours (`LIBRARIAN.md` :70, :136). Your D284 drafts should carry these two forms, not the parentheticals, or the guard goes red again at the next swap.

NEXT: librarian collate the landing-fix block and pass it to the chair to land landfix-a on land-d277-base when portable-paths is green there
