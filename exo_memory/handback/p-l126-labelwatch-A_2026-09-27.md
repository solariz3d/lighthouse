# L126 — the label-watch instrument, BUILT. Pane A, 2026-09-27

Packet: `[chair:MAIN] L126 — BUILD the label-watch instrument`. **Committed by path at
`3d6397822f00fe97846b1d5cc160d566f5b07a6c`** (`consonance/tools/label-watch.js` +316,
`consonance/tools/label-watch.test.js` +118). **Not pushed. Read-only:** it runs git, reads files, and writes nothing.

## HEADLINE: the rule has reached NO seat, so there is nothing post-rule to count yet

- **All six seats are NOT DELIVERED** by E§1.4. No instance `CLAUDE.md` carries the pointer line, and all six were
  regenerated at 10:04–10:05Z, before R (`1e7520a`, 10:35:57Z).
- **Why, checked:** `room_brief_at` (`consonance/src-tauri/src/main.rs:3458`) reads a brief from, in order, (1) an
  editable copy in the data dir, (2) the running app's bundled resource, (3) the repo.
  - There is no (1): `C:\Consonance\data\{BUILDING,COMMITTEE,LIBRARIAN}.md` are absent.
  - (2) is the running `C:\build\lighthouse-target\release\consonance.exe`'s bundled copies, which hold **0 pointer lines
    and 0 item 7**.
  - **So a seat waking now still gets the pre-rule brief.** The rule reaches seats only after the keeper's rebuild
    (tier 2), or if an editable copy is placed in the data dir (tier 1). **Neither was done here**; tier 1 is named as
    the keeper's option.
- **The post-rule run therefore counts 0 units.** H: 11 hand-backs added after R, all excluded (4 in the landing lap, 7
  from undelivered seats). K: 10 keeper replies after R, all the librarian's, all undelivered.
- **The DG-A3 clock (E§4) is running regardless:** fewer than 20 units within 14 days of R means NOT TESTED at that
  read, so delivery needs to happen well inside the 14 days.

## 1. Design

- **CLI:** `node consonance/tools/label-watch.js [--control] [--json] [--since <sha>]`. `--since` defaults to `1e7520a`.
- **Pure functions, exported and fixture-tested:**
  - `analyzeText`: per-line labels, coverage, owing, and §3 checks;
  - `keeperUnits`: the K frame over transcript rows;
  - `handbackUnits`: the H frame over git;
  - `exposureOf`: E§1.4.
- **Output:** the command, R, `LABEL_RE`, a delivery table per seat, H and K totals (labels, owing lines, labelled
  share, §3), exclusions with reasons, K per seat, and per-unit rows. `--json` gives the same as one object.
- **Paths:** repo-relative, `path.resolve(repo, '..', 'instances')`, and `os.homedir()`. portable-paths: `green — 332
  files in scope, 223 known sites, 0 new`.

## 2. Each definition — E's, and what was implemented

| E§ | E's definition | implemented | mechanical? |
|---|---|---|---|
| §1.3 marker | "one case-sensitive regex, `LABEL_RE` … pinned at landing" from the rule **as landed** | `/(?:^|[^A-Za-z0-9_])(checked|inferred):/g`, taken from item 7's `checked: <command or path:line> → <result>` / `inferred: <the claim>`. **NOT PINNED in E's file by the landing commit** (E flags the same in its uncommitted clarification). **No post-rule unit was analyzed before this regex was fixed:** the control ran first, and the post-rule run excluded every unit before counting. The pin can still be made validly | yes |
| §1.3 coverage | the claim's line, its nearest heading or bullet parent, or its table row | heading label covers its section until the next heading; bullet ancestry by indent; indented continuation lines inherit; table rows are their own line | yes |
| §1.3 MIXED | both labels on one claim count as labelled, and are printed | counted in both `checked` and `inferred`, and labelled. **Not printed as a separate MIXED count** | partly |
| §1.3 control, DG-A1 | the last 30 H and 30 K before R; above 0.05 means refix before reading post-rule | `--control` implemented and **run first** (§4) | yes |
| §1.4 exposure | the first session start after R whose loaded shell carries the rule (a grep of the instance `CLAUDE.md` for the pointer); the landing lap excluded | the pointer in the instance `CLAUDE.md` **and** that file's mtime ≥ R. **Mtime stands in for "the session start"**: historical shells are not kept, and session-start rows are not read. Landing lap: H by filename `p-l122-*`; K has no lap tag, so a seat regenerated during L122 would have its L122 replies counted. **Named gap** | approximated |
| §1.1 H unit | files under `exo_memory/handback/` whose first commit is after exposure; the claim text is the whole file | `git log --diff-filter=A R..HEAD`, the first add. Seat from the filename's `-<LETTER>_<date>.md`. Letterless files (librarian, chair) are "seat unknown", excluded, **named**. Text is the file as first committed | yes |
| §1.1 K unit | keeper-typed prompt: not `isMeta` / `isCompactSummary`, no `tool_result`, not starting `[` or `<` after a `<pasted_content>` opener is stripped, not "This session is being continued"; unit = the last assistant message with text before the next non-tool-result user row | exactly that | yes |
| §1.1 K text | arm 1's §1 rule (R19:63) | text blocks + Write / Edit / MultiEdit + Bash heredoc bodies. **Narrower than R1:60:** no redirected echo/printf, no whole-command fallback, no MCP input strings. **Named** | partly |
| §1.1 machine | "This watch reads L's rows only", split by the hook command path | the nearest preceding hook row's user folder = this machine's home folder name. **Flag:** E's new clarification (uncommitted, for §2) says "on L" means both machines' rows. For §1 I followed §1.1's text | yes |
| §1.2 extraction | arm 1's model reader, K = 3 per unit, each quote located verbatim, UNLOCATED counted, DG-A2 | **NOT IMPLEMENTED: it is a model run (`claude -p`), not a mechanical count.** This tool measures at the **line** level instead. So its "labelled share" is **lines owing a label that carry one**, not E's claim-level share, and **F1 is defined on E's share, not this one** | no |
| §1.5 N and reads | first read = the first 30 H and 30 K after exposure; second read = the next 30 | **no cap**: every unit in the window is counted. The two-read split is not implemented | not done |
| "owes a label" | not E's term. The packet's "claims §1 says would owe a label" is taken from **item 7's own text**: "a figure, a verdict ('fixed', 'green', 'safe'), or a 'so …'" | a line with a **figure** (after removing code spans, shas, dates, times, `path:line`, versions, id tokens like L126 or W105), a **verdict** word (item 7's three plus fixed/green/safe/clean/red/pass·/fail·/works/broken/correct/wrong), or a **"so"** connective. Excluded: code fences, `NEXT:` trailers, and `I'll` / `Next` / `Plan` openers. **Not excluded:** future or opinion phrased otherwise, and "plain prose around a shown check" (item 7's exemption). Both over-count owing | proxy |
| §3 | E's §3 is the agreement between the self-label and the **B+C-agreed kind** on the §2.3 verifier sample | **NOT IMPLEMENTED: it needs the verifiers.** Built instead, as the packet asks: for each `checked:` line, is a check shown? **inline** (`checked: X → Y`, both non-empty) or **block** (the next non-empty line opens a code fence). Otherwise **NOT SHOWN**. This follows item 7's form and E's F2 "shows no check with its result". Other checks shown further away are **not seen** (named) | proxy |
| DG-A3 | fewer than 20 units within 14 days of R | not computed. The per-read counts are printed | not done |

## 3. Tests — fixtures only (`label-watch.test.js`), 9/9

- **Red first:** `Cannot find module './label-watch.js'`.
- **One fixture fixed before the implementation existed**, named: the vocabulary-guard's third line had no item-7
  trigger, so it could never owe a label. A figure was added so the line tests what it is meant to test.
- **The 9 tests:**
  1. LABELLED: `checked:` / `inferred:` counted by kind, and a labelled figure line does not owe.
  2. UNLABELLED-OWING: a figure, a verdict word and a "so …" each owe, with the reason recorded; plain prose does not.
  3. §3: a bare `checked:` is NOT SHOWN; the inline arrow is SHOWN; a following fence is SHOWN.
  4. EMPTY input (three forms): zeros everywhere, no throw.
  5. VOCABULARY GUARD: the KIND word `CHECKED:`, `unchecked:` and capitalised `Checked:` are not labels.
  6. COVERAGE: heading and bullet-parent cover; a new heading ends the cover.
  7. NOT CLAIMS: fenced lines, `NEXT:` trailers, and shas / dates / `path:line` / times are not figures.
  8. K FRAME on fixture rows: the keeper prompt is kept; `[chair:`, pasted `[pane:`, `isMeta` and the continuation
     summary are not; tool_result rows do not end the unit.
  9. H FRAME + EXPOSURE on a **throwaway git repo**: only files added after R by an exposed seat; the landing lap and a
     NOT DELIVERED seat are excluded with their reasons.
- **Mutants, on copies** (`scratchpad/l126/mutants.js`, control 0 failing): **listed 14 · applied 14 · caught 14 ·
  survived 0 · NOT APPLIED 0 · NO RESULT 0.**
  - **M1 (LABEL_RE case-insensitive) SURVIVED on the first run.** A case-insensitive match set `out['CHECKED']`, a key
    nothing read, so a second, accidental guard hid it.
  - **Fixed** by lowercasing the matched token (no change under the real regex), which leaves the regex's case as the
    one guard. **Caught on the re-run.**
- **Command:** `NO_COLOR=1 node --test consonance/tools/label-watch.test.js` → `tests 9 · pass 9 · fail 0`.
  **The full suite was not run:** no shared code was touched, per the packet. `js-suite` will pick this test file up on
  its next run.

## 4. The first runs, over the real window — in E's order

**1. The control, FIRST** (`node consonance/tools/label-watch.js --control`, output in
`C:\Consonance\retrieval\l126\control.txt`):

```
H — hand-backs: 30 unit(s) · labels: checked: 6 · inferred: 3 · lines owing a label: 1052 · labelled 1 · UNLABELLED 1051 · share 0.1%
K — replies to the keeper: 30 unit(s) · lines owing a label: 82 · labelled 0 · share 0.0%
DG-A1 (H): 0.1% — does not fire (≤ 5%)      DG-A1 (K): 0.0% — does not fire
```

- **The detector counts labels, not this room's vocabulary.** The 9 pre-rule markers are in C's rule draft and B's
  merge note, which quote the markers.
- §3 in the control: 2 `checked:` lines show their check inline, and 4 show none.
- K per seat in the control: librarian 30, chair 30, A 4, B 3, C 2, E 5, pooled to the last 30.

**2. Then the post-rule window** (`node consonance/tools/label-watch.js`, output in `…\l126\post.txt`): **0 H units and
0 K units counted.**
- All six seats are NOT DELIVERED (HEADLINE).
- H excluded: 4 × landing lap (L122), 7 × seat NOT DELIVERED (A 3, B 2, C 1, E 1).
- K: the librarian has 10 post-R keeper replies, not delivered; the other seats have 0.

## 5. What was NOT verified

- **Every proxy against a human reading:** "owes a label" and §3's "check shown". No hand-labelled sample was compared.
- **E's claim-level share** (§1.2's reader run) and E's §3 kind agreement. Neither is built here.
- **The tool on a real post-rule unit.** There is none yet. The first delivered seat's units are its first real test.
- **The §1.1 machine question** (L rows only, against E's §2 clarification), and whether hand-backs without a seat
  letter should be seats.
- **Delivery.** The keeper's rebuild, or an editable brief in the data dir, is what starts the measurement. Neither was
  done, and the tool only reports it.

NEXT: librarian — B reads label-watch against E's registration with its own fixtures; the rule needs delivering before any number exists
