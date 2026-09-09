# OneDrive inventory — measured before anything moves (Third Place seat, 2026-09-09 ~04:35)

*At the keeper's ask: "remove everything from OneDrive and copy it to where it should be on disk,
then push… if it has outdated material drop it. But make sure to measure it first." This is the
measurement. No file has been moved, deleted or committed. Every number below came from a command
run at this seat; the commands are in the transcript.*

## 0 · The finding that started it

The "standing rule" that private content travels through OneDrive and never the repo **was never
said by the keeper.** It first appears 2026-08-11 in a compaction summary as a "standing
constraint (preserve)," was carried forward verbatim by eleven summaries, asserted to the keeper
by the chair on 08-29 as "your standing rule," and committed into `.gitignore` the same day
(`2fc006c`). The keeper's only OneDrive instruction in any transcript is 07-28: *"do the move from
onedrive"* — the opposite direction. Consequence: `exo_memory/third_place/` (9 files, the Third
Place's private record) exists **only** on this laptop, gitignored, on no channel. The desktop has
never had it.

## 1 · What is on OneDrive, measured

| location | files | size | git? | newest | what it is |
|---|---|---|---|---|---|
| `Desktop/606/` | 423 | 109 MB | no | 2026-08-29 (a game's imgui.ini) | the **pre-Lighthouse June project folder**: 44 experiment scripts/CSVs (attention_flow, coupled_lyapunov, cosmic_web, feigenbaum, sandpile…), the dreamzone game (3 dirs, 33 MB), NonEuclidean (51 MB), gateway_pages (16 MB), two source PDFs, an `exo_memory/` copy (26 files) and a `lighthouse/harness/` (5 files) |
| `Desktop/projects/lighthouse/` | 0 real files; 35,710 entries | 25 MB | no | 2026-08-09 | **only** `consonance/src-tauri/target/` — a stale cargo build cache. Nothing else. |
| `Desktop/projects/lighthouse-FROZEN-2026-07-28/` | 205 working files + `.git-frozen/` | 35 MB | archived | 2026-07-28 | the deliberate capsule from the 07-28 move out of OneDrive |
| `consonance-migration/` | 23 | 43 MB | no | 2026-08-18 | two bundles: `room-20260728-0121/` (a **desktop** room snapshot: its board, 33 MB; a sibling transcript; memory files) and `pane-data-2026-08-18/` (suggestion-scoring data a seat kept out of the repo on purpose) |

Not repo material and not measured for the repo: `Desktop/FIC/` (the keeper's imprints), `Pictures/Screenshots/`, `Documents/`, the school .docx files at OneDrive root, game shortcuts.

## 2 · Against the live repo, file by file

**606/exo_memory (26 files):** 22 byte-identical to live. 4 differ:
- `BOOT.md`, `journal/2026-06-24.md` — the 606 copies are **older** and their exact content **is in repo history**. Nothing to keep.
- `loop/ESCALATIONS.md`, `loop/state.json` — the 606 copies are **newer** (06-29 vs live 06-24) and their content is **not in repo history**. The delta is three lines: one caretaker escalation entry, `[2026-06-29] NEEDS HUMAN — loop dormant`. A trace of the retired June caretaker loop. Small, real, unrecorded.

**606 loose files (44 scripts/CSVs/PDFs):** **none** is tracked anywhere in the repo, by basename. These are the June experiments the room's early journals refer to (the attention-flow consensus runs, the coupled-Lyapunov work, the cosmic-web renders, the sandpile). Whether the repo should hold them is a scope question, not a sync question — they predate the repo and were never in it.

**FROZEN working tree (205 files):** 191 exist byte-identically in repo history. 14 do not: 4 generated Tauri schemas, 8 `__pycache__` files, `FROZEN.md` (the capsule's own note, never committed), and **`NOTHING_WASTED.md` — the frozen copy is an earlier, longer draft (84 lines vs 65) under the keeper's real name with the personal lineage paragraph that the live version removed.** That is the only privacy-relevant item found anywhere on OneDrive. The capsule's own claim ("2,041 files byte-identical, zero missing") is confirmed for everything that was in the repo at the time.

**projects/lighthouse:** a build cache. Zero source files. Droppable without measurement of content.

**consonance-migration:**
- `room-20260728-0121/`: the desktop's board (`board-ZACHSLEGION`, 33 MB — the live laptop board is 47 MB and a different file), one sibling transcript + its `.orphaned` twin, three memory files, captures. Everything except the board, the transcript, `around.md`, `zach.md`, and `manifest.json` also exists under `C:\Consonance\`. This is the **desktop's** state from July 28 and is the only copy of it here.
- `pane-data-2026-08-18/`: 5 files, **nowhere else on disk.** Kept out of the repo on 08-18 by a seat, in writing, because `main-suggestions.jsonl` is predicted keeper prompts, "several personal." The scoring REPORT and PROTOCOL are room instruments and are also nowhere else.

## 3 · What "consistent, no conflicts, drop the outdated" would mean, per item — proposed, not done

| item | proposal | why |
|---|---|---|
| `projects/lighthouse/` (cargo cache) | **delete** | zero content; 25 MB of build artefacts syncing for nothing |
| FROZEN: 191 identical files | **delete** (after the two below are pulled) | in history already |
| FROZEN: `NOTHING_WASTED.md` (real-name draft) | **keeper decides** — keep privately or delete; do **not** commit | the one personal item |
| FROZEN: `FROZEN.md` | copy into `exo_memory/attic/` and commit | the move's own record; one page |
| FROZEN: schemas + pycache | delete | generated |
| 606/exo_memory: 22 identical + 2 older | delete | in history |
| 606/exo_memory: `loop/ESCALATIONS.md`, `loop/state.json` | copy the 3-line delta into `exo_memory/attic/caretaker-escalation-2026-06-29.md`, commit; then delete | a real trace, unrecorded |
| 606: 44 June experiment files + `lighthouse/harness/` | **keeper decides**: `exo_memory/attic/606/` in the repo (~1 MB without PDFs/images), or leave on OneDrive, or drop | never in the repo; the room's prehistory; the record cites them by name |
| 606: dreamzone, NonEuclidean, gateway_pages, PDFs, PNGs (~100 MB) | leave or delete — not repo material | games and renders |
| `consonance-migration/room-20260728-0121/` | **keep off the repo**; move to `C:\Consonance\backups\desktop-room-20260728\` | the desktop's board is 33 MB and is data, not corpus; the repo rule the librarian measured yesterday (board 90.7% replay, files over GitHub's limit) applies |
| `consonance-migration/pane-data-2026-08-18/` | **keeper decides**; move REPORT + PROTOCOL to `exo_memory/attic/` and commit; keep `main-suggestions.jsonl` off the repo | the seat's own reason on 08-18: predicted keeper prompts, personal |
| `exo_memory/third_place/` | **keeper decides**: commit it (drop the 08-29 ignore rule — the repo is private) so the desktop gets it, or keep it laptop-only knowingly | the finding in §0 |
| `.gitignore` comment at line 72–75 | rewrite: the rule was a summary artefact, not the keeper's; state whatever he decides | it currently attributes to him a rule he never made |

## 4 · What is NOT proposed

- Nothing under `Desktop/FIC`, `Pictures`, `Documents`, or any non-Consonance OneDrive path.
- No `git add -A`. Every commit by pathspec.
- No deletion before the item's content is confirmed in the repo or in `C:\Consonance\backups\`
  by a `cmp`, not by this table.

## 5 · Re-derive

    # 606 exo_memory vs live: cmp each file; history check: git hash-object <f> | git cat-file -e
    # FROZEN: same, excluding .git-frozen — 205 files, 14 not-in-history
    # consonance-migration: find -type f; basename lookup under C:\Consonance
    # the rule's origin: grep "travels through OneDrive" ~/.claude/projects/C--Consonance*/*.jsonl
    #   -> first: instances-main 2026-08-29T07:16 assistant; first "standing constraint": 08-11 summary

---

## 6 · Done, 2026-09-09 ~04:50, on the keeper's "okay sure" for the safe set

- `exo_memory/attic/`: `FROZEN-2026-07-28.md`, `caretaker-escalation-2026-06-29.md`,
  `suggestion-scoring-REPORT-2026-08-18.md`, `suggestion-scoring-PROTOCOL-2026-08-18.md` — each
  `cmp`-verified against its source before the source was touched. Commit `a58385a`.
- `OneDrive/consonance-migration/` → `C:\Consonance\backups\onedrive-migration-2026-09-09\`: 23
  files, 44,575,865 bytes, every file `cmp`-identical, then the OneDrive copy removed. Off the
  repo, off the syncer, on disk. The prompts file travelled with it and is nowhere else.
- `OneDrive/Desktop/projects/lighthouse/`: zero non-`target/` files confirmed, then removed.
- `OneDrive/Desktop/606/exo_memory/`: all 26 files accounted for (22 in repo history or live, 2
  older-and-in-history, 2 captured in the attic), then removed. **The rest of `606/` untouched.**
- `.gitignore` comment rewritten to say the rule's true origin; the rule itself left in place.

**Kept on OneDrive by the keeper's decision:** `lighthouse-FROZEN-2026-07-28/` whole ("it is okay
to keep it where is"). **Still his to decide:** the 44 June experiment files in `606/`; whether
`exo_memory/third_place/` is committed.
