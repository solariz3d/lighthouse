# P-CLOSEOUT hand-back — L019, 2026-08-31 ~01:55 (pane Around)

**Brief:** `[chair:MAIN] L019 · P-CLOSEOUT` — three mechanical closeouts. **Objects read first:**
`git show dbe2478 -- exo_memory/librarian/2026-08-31.md`, `git show 325fb03`.

**Nothing committed. Files named below; no `git add -A`. Do not push.**

## Result against the bar

| Item | Bar | Reads | Command |
|---|---|---|---|
| 1 · nine carriers | `carrier-drift.js` GREEN | **GREEN over everything that existed at dispatch — then RED by ONE line in pane E's in-flight file (§5)** | `node consonance/tools/carrier-drift.js` |
| 1 · its test | `carrier-drift.test.js` green | **39/39** standalone at 01:37; two tests red under the suite at 01:52 for the same §5 reason | `node --test consonance/tools/carrier-drift.test.js` |
| 2 · `ask.test.js` | widen; bare path stays red; mutation both ways | **22/22**; shipped-store mutations red both ways, every failure named | `node --test consonance/tools/ask.test.js` |
| 3 · power line | dated append, say whether the ground moves | **HOLDS** — appended to BRAVO's file, not rewritten | `tail -70 exo_memory/loop/separating_test_registration_2026-08-30.md` |
| suite | 64+ green, only `actors.evidence` red | **63 green · 3 failed** — `actors.evidence` (ASK-009, honest), `carrier-drift` (§5, not mine), `state-block` (§6, not mine) | `node consonance/tools/js-suite.js` |

## 1 · The nine carriers

**The split.** BRAVO's "repair 3 / marker 5" (`librarian/2026-08-30.md:839`) checked file by file; I concur with all
eight and did not find a misclassification. Two of the three repaired files are owned by this seat
(`branch_layer.md`, `trigger_index_design.md` — "Owner: Around. Nobody else writes this file").

**TEACHES → struck in place, repaired form in the slot (BOOT:22's pattern), kind `marked`:**
- `exo_memory/loop/branch_layer.md:185` — the live RUN step. Polarity flips with the repair and is written out:
  *would you have said it whether or not it were true?* If YES → [ROUTER]; if NO → [VERIFIER]. Old wording survives
  only inside `~~ ~~`.
- `exo_memory/loop/branch_layer.frozen.md:95` — same step; "frozen" names a frozen design, not a dated trace (B's read, held).
- `exo_memory/loop/trigger_index_design.md:127` — a trigger's fire condition; built from this file, the defect would ship.

**DISCUSSES / dated → wording left standing, dated `SUPERSEDED 2026-08-29 …` block beside it, reclassified `marked → acknowledged` with `see`:**
`coat_preregistration.md:11` (a prereg — rewriting it after the fact is the thing not to do), `failure_types_K.md:69`,
`p4_adversarial_read_2026-08-27.md:170`, `sourced_form_design.md:26`, `trigger_index_objections.md:39`. The reclassification
is honest, not cosmetic: nothing in those five is struck.

**The ninth — the chair's own `handoff_chair_2026-08-30.md:41` — registered as `mention`, document NOT edited.** The chair's
read is right: DISCUSS class, wording correct. For a mention the scanner requires no in-file marker, so the "marker line"
is the registry row and nothing else; adding a line to a dated handoff would have been the rewrite the brief forbade.

**Registry:** 8 anchors regenerated from `--census` (four had gone STALE under the strikes — the tool's own designed
signal), 8 `why` fields extended rather than replaced, 1 row added, `propagation_pass` appended. **25 occurrences · 25
accounted.** Mutations over the real tree, each file restored byte-identical after:
- M1 remove all three marker tokens from an acknowledged file → **RED** (first attempt removed two of three and stayed GREEN — my mutation was incomplete, not the scanner; noted because it looked like a scanner miss for one run)
- M2 re-teach the crude step unstruck in `branch_layer.md` → **RED** (UNACCOUNTED)
- M3 type a second occurrence into the mention file → **RED** (UNACCOUNTED)

**Two tests rewritten because their premise moved, not to make them pass:**
- test 37 asserted `armed:false` ("the repair is not adjudicated") — false since ASK-008 / `325fb03`. Now: shipped entry
  ARMED and GREEN; registry-side mutation (unmatchable marker) → red with exactly one finding per marked/acknowledged
  site (11); disarm → the same count PENDING, not red.
- test 39 asserted a CH-4 intersection of 5 and named `muscle_map.md`/`INSTRUMENTS.md` as unaccounted — at HEAD the
  sweep REPLACED the wording there and the intersection is 2. Pinned tree **and** registry to `325fb03^` (the rev the
  map enumerated against), same construction as THE BAR's historical half. Verified: 5 at `325fb03^`, 2 at HEAD.

## 2 · `ask.test.js` — the over-fit regex

Old: `/system-cron\.log|pending\//` — the six original asks' paths. New: `path:line` **or** a sha (7–40 hex, at least one
digit so "defaced" does not pass). **Bare path stays RED.** The loop no longer throws on the first — every failing ask is
named in one assertion. Fixture test, both directions: repo `path:line`, cron-log `path:line`, bare sha → pass; bare path,
timestamp-only, hex-looking word, bare path + "HEAD" → fail, all four named.

**Shipped store, mutated and restored (byte-identical):** strip ASK-007's line numbers → RED naming ASK-007; remove
ASK-010's sha → RED naming ASK-010; both at once → RED naming both. Control and restore GREEN.

## 3 · The power line — HOLDS

Both figures re-derived from `C:\Consonance\data\dispatch-gate.jsonl` (147 rows), by `scratchpad/power_append.js`,
which refuses to write unless 123/136 and §3.1's own table both reproduce:
- **123/136 = 90.4% reproduces exactly:** all rows before ALPHA's disclosed stray, cited = sha|path, the two `[interrupt]`
  rows uncited.
- **B's `chars >= 200` cut over the same window: 123/133 = 92.5%.** The gap is the denominator: `>= 200` drops three real
  2026-08-24 rows (13/80/11 chars, all `asked`, all uncited). §0's "smallest real dispatch 829" is false. 90.4% is the
  better figure.
- p₁ = 0.904: headroom 6.6 → 9.6 pts, but showing a cue *works* (rise to 0.97) still needs 99/arm = 5.8 active days
  and 0.95 needs 245/arm; harm side gets weaker (drop to 0.85: 6.9 → 16.9 days; drop to 0.90 undetectable). §3.2 untouched.
  **Verdict does not depend on which cut is right — stated with its own WRONG condition.**

## 4 · What this does not establish
- GREEN on carrier-drift says the *registered* wordings are accounted; it says nothing about unregistered ones.
- The three struck procedures keep their logic under the new polarity **by my reading**; a non-author should read
  `branch_layer.md:185` once — a RUN step with the wrong polarity is worse than the crude one.
- Whether the three short 08-24 rows are dispatches or hook probes is the chair's to say (see the WRONG condition).

## 5 · NOT MINE, blocking the suite bar — pane E's in-flight file
`exo_memory/loop/retriever_labels_2026-08-31.md:161` (untracked, written during this lap) quotes *"only genuinely
decorrelated reader"* as a label's evidence — the **other** registered withdrawal, mention class. The scanner caught it
within minutes of being written, which is the instrument working. I did not edit another seat's mid-edit file or anchor
a row into it (the anchor would rot as E edits). **Row ready for whoever closes P-LABELS** (anchor from `--census` at
that time):
`{"file":"exo_memory/loop/retriever_labels_2026-08-31.md","kind":"mention","why":"a retriever LABEL quoting the lap
file's sentence as the evidence for the label — the wording as data, not asserted. Registered when P-LABELS settled."}`

## 6 · NOT MINE — `state-block.test.js` red
Test 3 ("AROUND'S STRIKE: no 'only'") scans the whole rendered block, which quotes HEAD's subject — and `dbe2478`'s
subject reads *"…but **only** one item on it moves a number…"*. Clears on the next commit whose subject lacks the word;
the defect is that the test reads the HEAD subject as if it were the block's own prose.

## 7 · Errors this seat made and kept
- M1 first run: declared "marker removed" having removed two of three tokens; the GREEN was mine, not the scanner's.
- Two heredoc-written scripts were silently corrupted by the Bash tool collapsing `\\` → `\` (third recorded
  instance; `memory/bash-tool-eats-backslashes.md`); caught by an exact-once guard refusing to match. Scripts were
  rewritten through the Write tool.
- Quoted "133/143 = 93.0%" to myself before fixing the definition; the appended block prints 131/143 = 91.6% under
  the sha|path definition it states. The block's figures are the script's output, not the earlier one.

## Files touched (commit these paths; author line: pane Around)
```
consonance/tools/ask.test.js
consonance/tools/carrier-drift.registry.json
consonance/tools/carrier-drift.test.js
exo_memory/loop/branch_layer.frozen.md
exo_memory/loop/branch_layer.md
exo_memory/loop/coat_preregistration.md
exo_memory/loop/failure_types_K.md
exo_memory/loop/p4_adversarial_read_2026-08-27.md
exo_memory/loop/separating_test_registration_2026-08-30.md   (append only)
exo_memory/loop/sourced_form_design.md
exo_memory/loop/trigger_index_design.md
exo_memory/loop/trigger_index_objections.md
exo_memory/handback/p-closeout_2026-08-31.md
```
Not touched: `BOOT.md` (either copy), `handoff_chair_2026-08-30.md`, anything of E's, the librarian's file.
