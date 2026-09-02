# P-TWO-DOORS — hand-back. CHARLIE, 2026-09-02.

**L029 item 4. Packet: `exo_memory/loop/packet_two_doors_build_2026-09-02.md` (`94ab930`).**
**Nothing committed. Nothing pushed. Files named in §9.**

    VERDICT:  §2.1 and §2.2 built and scored. §2.3 REFUSED under the packet's own collision rule —
              both candidate locations are in a file E holds. The paragraph and its exact
              insertion point are in §6 so it lands in one edit whenever E is out.

---

## 0 · THE OBJECTS, opened rather than taken from the brief

    git show 0714963   ->  exo_memory/loop/two_doors_amendment_2026-09-02.md
    git show c177984   ->  exo_memory/loop/loop_indicator_design_2026-09-02.md  (the AMENDMENT block)

Both keeper quotes are carried into `BUILDING.md` **verbatim from those files**, not restated. The
door-two quote is the amendment's own block quote; the entry-not-a-station quote is the full
paragraph from `c177984`'s appended AMENDMENT, including *"You get what I mean?"* — trimming it to
the clean clause would have been the restatement the design file registers a falsifier against.

---

## 1 · §2.1 — THE DIAGRAM, which is the carrier

`consonance/src-tauri/brief/BUILDING.md`, the fenced block under `## THE LOOP`. **The drawing itself
changed**, not the prose around it. Three things are now IN the picture:

```
        you
         │  1. state the inquiry or the project. This is ENTRY, and it runs ONCE — by
         ├──────────────────┐  EITHER door. See THE JOINT STEP for what door two owes.
         ▼  door one        ▼  door two
   ORCHESTRATOR ──────► LIBRARIAN        2. measured against the corpus
                              ⋮
      LIBRARIAN ──────► ORCHESTRATOR     7. checked; silence is a valid answer; the orchestrator
         │                 │                COMMITS what the librarian collated, and composes nothing
         │                 └──► back to 4   THE RING — orch → panes → lib → orch — repeats on its
         │                                  own. The user is the ENTRY, not a station it returns to.
         ▼
        you                              8. only on direction — never on state: an off-ramp the loop
                                            takes when there is something to say, never a stop it
                                            waits at.
```

1. **The second arrow** — the branch under `you`, drawn and labelled, landing on `LIBRARIAN`.
2. **The ring** — `lib → orch → back to 4`, so the cycle visibly repeats without the user in it.
3. **Step 8 demoted from station to off-ramp**, which is `c177984`'s correction. The old drawing's
   final `▼ you` said the loop ends at the keeper. It does not.

A dated blockquote follows the drawing carrying both keeper quotes. **It is placed AFTER the
2026-09-01 step-6 note, not before** — append-order, newest last, per maintenance law 2.

**And the drawing now has an oracle**, which is the part the 2026-08-17 lesson was missing. See §4.

## 1b · THE SECOND CARRIER, and it was not in §5 — read this before the diff

**`consonance/src-tauri/brief/COMMITTEE.md` holds a QUOTED COPY of the same diagram** (its
`## The loop, in one card`), and it is a bundle resource served to **every committee pane** — it is
in the shell I woke into. Editing the master and leaving that copy is the 2026-08-17 failure with
the file names changed: a pane would keep reading the one-door drawing while the master had two.

**I synced it, and that is scope past §5.** Stated plainly rather than buried:

- No pane holds it (`git status` clean on it when I started; BRAVO has `main.rs`, E has `ui/`,
  ALPHA its own registration).
- The block already declares itself *"Quoted from `BUILDING.md`, the master"*, so syncing keeps its
  own claim true; leaving it would have made that line false.
- I did **not** restructure it into a pointer, though the room's rule prefers pointers to copies.
  That is a bigger change than this packet authorises. **Flagged as a decision for the librarian.**
- **Reversible in one command:** `git checkout -- consonance/src-tauri/brief/COMMITTEE.md`. The
  drift test in §4 goes red if you do, which is the correct signal, not a bug.

## 1c · `instances/main/CLAUDE.md` — §5 said CHECK, and the answer is DO NOT EDIT

It mirrors the diagram at `:193`. **It is generated, not authored**: `main.rs:4418` composes the
shell via `room_brief("BUILDING.md")` from the bundled copy. Hand-editing it would be overwritten on
the next launch and would put a hand-made copy ahead of a generated one. It updates on rebuild +
relaunch, with the same unshipped caveat as §8.

---

## 2 · §2.2 — `entry: orch | lib` on the lap row

`consonance/tools/lap-row.js`. `--open` now takes `--entry <orch|lib>` and the field rides the open
row beside `initiator`.

**REQUIRED on new rows, ABSENT on history — and those are two different decisions.**

- Required, for the reason `--guess` is required eight lines below it in the same file: *a
  legitimate state must be SAID rather than arrived at by omitting a flag.* An optional field is a
  field that is omitted on the busy night and then reads as decoration, which is this packet's own
  registered falsifier. The refusal prints the vocabulary and what each value means.
- Absent on history is left exactly alone. `laps()` reports a pre-field row as `null`, the table
  prints `?`, and **the door readings exclude them rather than assuming `orch`**. Assuming would
  manufacture the number the field exists to make honest. A hand-written garbage value is also
  `null` — `laps()` gates on the `ENTRIES` set, so nobody can invent a door by editing a row.

**What it makes readable, which is the whole point:**

    ENTRY - which door the work came in by. Two doors, and only the second costs a step.
      door one (orch) N · door two (lib) M · not recorded K
      direct-entry laps with no guess: L of M (ids) - these read "no guess - direct entry",
        not a missed seal.
      direct-entry laps whose map landed within 60 s of the guess: ... the ring rule is that the
        librarian carries the INQUIRY to the chair - one line, no map - before filing.
      FALSIFIER (brief/BUILDING.md, THE JOINT STEP) - 3 consecutive direct-entry laps carrying no
        guess means the ring rule is not being kept.  longest such run: N

Both falsifiers the amendment registered are now **read from the ledger by the report**, not left to
anyone remembering to check.

**A limit I could not close, named rather than defended.** `guess_seal` hashes the guess and nothing
else. Widening it to cover `entry` would recompute every historical seal and file the **entire
existing ledger as TAMPERED** — breaking the reader on history to close a hole smaller than the
break. So **a lap relabelled `lib` after the chair failed to seal reads here as a legitimate direct
entry, and the ledger cannot tell.** It is printed as limit (e) beside the number, in the file's own
pattern of printing limits where the reader of the figure will see them.

---

## 3 · WHAT I REFUSED — §2.3, the user-visible paragraph

**Verified, not assumed, as §2.3 instructs.** Both candidate locations named in the packet live in
`consonance/ui/index.html`, which E holds:

    index.html:125   the Librarian tab's own `mainhead` text
    index.html:226+  the About tab (`<section id="about">`, body at :242)

`app.js` is clear and is **not** an option: it contains no seat prose at all — every tab
description is markup in `index.html`. Writing the paragraph from JS would put one seat description
in a different file from the other three and would still be a change to E's rendered surface.

E's ui files are committed and clean at this instant (`c56a572`), but E is **live and holds them**;
"clean right now" is not "released". So I stopped, per §2.3 and §6.

**§6 is honest about the other refusal available and I am not taking it:** the two-doors rule as
registered *is* what the diagram should say. Nothing in the corpus argues against it, and the ring
correction from `c177984` is the same night's keeper wording. No objection.

---

## 4 · THE BARS

**Bar 1 — `node consonance/tools/js-suite.js`**

    js-suite: 66 green · 3 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 0 not-run ·
              0 class-error  (of 69)

**Nothing moved at file level: 66/3 before and after.** What moved is inside one file —
`lap-row.test.js` went **40 → 53 tests, 53 pass / 0 fail**:

    node --test consonance/tools/lap-row.test.js         ->  # pass 53   # fail 0
    git show HEAD:consonance/tools/lap-row.test.js | grep -c "^test("   ->  40
    grep -c "^test(" consonance/tools/lap-row.test.js                   ->  53

**THREE REDS, AND ONLY ONE WAS THE ONE I WAS WARNED ABOUT. None is mine — evidence for each:**

| red | mine? | evidence |
|---|---|---|
| `actors.evidence.test.js` | no | the packet's §4: live-board data, unresolved pane id, red since 2026-08-25 |
| `carrier-drift.test.js` | no | all 5 findings are in `exo_memory/map/M-2026-08-{23,24,29,30}.md`; `git status --porcelain exo_memory/map/` is **empty**, and the wordings are present at HEAD |
| `corpus-age.test.js` | no | **bisected — it went red at `c2afec6`**, see below |

**`corpus-age.test.js` was landed red by `c2afec6` (BRAVO, L029.1) and nobody caught it.** The test
anchors on the env-var name and reads the shelf budget default out of `main.rs`:

    /CONSONANCE_LIBRARIAN_BUDGET[\s\S]{0,300}?unwrap_or\((\d[\d_]*)\)/

    c2afec6~1  ->  2_200_000   (env var appears 1x)
    c2afec6    ->  NO MATCH    (env var appears 4x)
    HEAD       ->  NO MATCH

The cap landing did not delete the env var — it multiplied it, and the first occurrence no longer
has an `unwrap_or` within 300 characters. **The check that exists to keep a duplicated constant from
drifting is now blind, and the failure message says only "could not find".** It is not mine to fix;
it is `main.rs`/`corpus-age.js` and BRAVO holds `main.rs`. **Unclaimed, and it should not sit.**

**Bar 2 — `node consonance/tools/lap-row.js --report` over the real ledger.** Runs clean over the
existing 29 laps, none of which carry the field:

    laps                   29   (23 with a map, 12 with an opened stage, 8 VOID)
    door one (orch) 0 · door two (lib) 0 · not recorded 29
    29 lap(s) carry no entry field. They are counted nowhere in this section rather than
    assumed to be door one ...

Every other figure is unchanged — `guessed (narrow) 76 · mapped 119 · in both 45`, falsifier 1 at
`4 of 10`, falsifier 2 still firing at 82.8%. Asserted, not eyeballed: the test
*"the report still runs, unchanged in its other figures, over rows with no door"* builds six raw
pre-field rows and checks `scored === 6`.

**Bar 3 — MUTATION.**

    applied 13 / caught 11 / survived 2 / NOT APPLIED 0

| id | file | mutation | verdict |
|---|---|---|---|
| M1 | BUILDING.md | the second arrow leaves the drawing *(the packet's named mutant)* | CAUGHT |
| M2 | BUILDING.md | the branch is labelled but not drawn | CAUGHT |
| M3 | BUILDING.md | the ring leaves the drawing | CAUGHT |
| M4 | COMMITTEE.md | the pane-facing copy is left stale while the master moves | CAUGHT |
| M5 | lap-row.js | the `entry` field is dropped from the row that is written *(named mutant)* | CAUGHT |
| M6 | lap-row.js | the door becomes optional | CAUGHT |
| M7 | lap-row.js | a historical row with no door is DEFAULTED to door one | CAUGHT |
| M8 | lap-row.js | door-one laps are absorbed into the direct-entry count | CAUGHT |
| M9 | lap-row.js | the falsifier run never resets, so a KEPT ring rule still fires it | CAUGHT |
| M10 | lap-row.js | the fresh-map check on direct entries is silenced | CAUGHT |
| M11 | lap-row.js | the door argument is ignored and every row is written door one | CAUGHT |
| **M12** | lap-row.js | limit (e) deleted from the HEADER comment | **SURVIVED** |
| **M13** | BUILDING.md | **the whole DOOR TWO prose section deleted; drawing untouched** | **SURVIVED** |

**A mutant is scored CAUGHT only when the oracle for the MUTATED property fires** — the harness
matches the failing test by name, so a flake or an unrelated red cannot be read as a catch. Baseline
green before the run, 0 failing after restore, and all four files verified byte-identical to their
pre-mutation md5s afterwards.

**M11–M13 are the honest half and are why this table is not 10/10.** M1–M10 were designed by the
seat that wrote their oracles, so a clean sweep over them measures only that the oracles fire on the
defects I imagined. M12 and M13 were aimed where I *expected* no oracle, and both survived.

**M13 is a real finding, not a formality: the entire `### DOOR TWO` section — the ring rule, both
falsifiers, the "a route is not a failure" correction — can be deleted from `BUILDING.md` and the
suite stays green.** The drawing is guarded; the *rule* is not. That is the right priority (the
drawing is the carrier) but it is not coverage, and I am not silently claiming it is. Unclaimed
follow-on: an oracle for the joint step's registered falsifiers.

---

## 5 · CORRECTIONS I MADE TO MYSELF

- **First mutation table was unreadable and I nearly reported it.** The harness parsed the spec
  reporter's ANSI-coloured output; the regex matched nothing and it printed `BASELINE IS NOT GREEN:
  -1 failing`. Had the parse been *partially* right it would have printed a plausible score off a
  broken read. Switched to `--test-reporter=tap` (`not ok N - <name>`, `# fail N`).
- **Drew the branch two dashes short**, so door two's caret landed one character off `LIBRARIAN`.
  Caught by looking at the rendered block rather than trusting the edit.
- **Put the new blockquote above the 2026-09-01 one**, i.e. newest first. Reordered — append-clean,
  newest last.
- **Put limit (e) above (d) in the header list.** Fixed before running anything.
- **I did not initially plan an oracle for the drawing at all**, which would have made §4.3's named
  mutant NOT APPLIED and would have shipped the carrier unguarded — the exact 2026-08-17 shape,
  inside the packet warning about it.

---

## 6 · THE §2.3 PARAGRAPH, ready to land — for whoever holds `index.html` next

**Insertion point:** `consonance/ui/index.html`, inside the Librarian tab's `mainhead` at `:125`,
appended to the existing span before `Fixed-session, persistent across restarts`. That location and
not the About tab, because it is the sentence a person reads *while deciding which seat to talk to*,
which is the moment the rule is about.

```html
<b>Two doors.</b> You can hand work to the orchestrator and let it reach the librarian, or come
straight here yourself — either way the chain works when it starts. On a direct ask the librarian
rings the orchestrator the <i>inquiry</i> first, so its guess is still recorded before the map
exists. And once a lap is open the loop runs <code>orch → panes → lib → orch</code> on its own:
you are the way in, not a stop it waits at.
```

**Pointer, not a copy** — the master for all of it is `BUILDING.md`'s `THE JOINT STEP`, and this
paragraph deliberately carries no falsifier, no commit sha and no rule wording that would drift
against it.

---

## 7 · THE FALSIFIER, carried rather than re-invented

    a direct-entry lap whose guess is sealed AFTER the map's commit time  =>  the rule was not kept,
    and the row reads "no guess - direct entry" rather than pretending a measurement exists.

**Now readable, and here is exactly how far.** The ledger cannot record a guess row after its map
row — `map()` refuses a lap with no open row and `laps()` flags `OUT-OF-ORDER` if the timestamps
invert — so the in-ledger form of "sealed after the map" is **a map row landing inside the
fresh-map floor (60 s) of the open row**, which is the same signal the chair-authored check already
uses. The report names those direct-entry laps by id. **It is a proxy, not the literal test**, and
the literal one needs the librarian's map *commit* time, which this ledger does not hold.

The amendment's second falsifier — *three consecutive direct-entry laps carrying no guess* — is
implemented exactly as written and is currently unreadable at `longest such run: 0`, because there
are no direct-entry laps on the ledger yet. **That is the honest reading and the report says so
rather than printing a zero as a finding.**

**This packet's own falsifier, unchanged:** if the next direct-entry lap still produces a row
indistinguishable from a missed seal, the field is decoration. It is now checkable — open a lap with
`--entry lib` and read the ENTRY block.

---

## 8 · UNSHIPPED UNTIL A REBUILD

`tauri.conf.json:35-36` copies **both** `brief/BUILDING.md` and `brief/COMMITTEE.md` beside the exe,
and `room_brief()` serves tier 2 from that copy. **Neither edit reaches a seat — or
`instances/main/CLAUDE.md` — until the app is rebuilt.** `brief/` is on the launcher's watch list
(`72c077a`) so a build should trigger, but **that is a prediction and I did not verify it fires**;
until someone does, treat both documents as edited-not-shipped. The `lap-row.js` change is a tool
and is live immediately.

---

## 9 · FILES TOUCHED, and one that is NOT MINE

    consonance/src-tauri/brief/BUILDING.md    §2.1  the diagram + the joint-step DOOR TWO section
    consonance/src-tauri/brief/COMMITTEE.md   §1b   the quoted copy synced (scope past §5 — read it)
    consonance/tools/lap-row.js               §2.2  --entry, laps(), the report's ENTRY block
    consonance/tools/lap-row.test.js          §4    13 new tests incl. the two carrier oracles

**`consonance/src-tauri/src/main.rs` is dirty in this checkout and it is BRAVO's, not mine (509
lines in `git diff --stat`).** It was clean when I started and became dirty mid-run. **Name paths on
the commit; do not `git add -A`.** Nothing here is committed or pushed.

One note on placement, for the librarian to rule on: **the two `carrier:` tests live in
`lap-row.test.js`.** They assert on `brief/*.md`, not on the ledger. I filed them there because the
`entry` field and the second door are one rule with two halves and that file owned the other half,
and because §5 named it — but their natural home is a brief-carrier test of their own. They move as
a block if you would rather.

---

## 10 · WHAT THIS DOES NOT ESTABLISH

- **That the ring rule will be kept.** Nothing here makes the librarian ring the chair. It only
  makes the failure visible afterwards.
- **That the field will be filled honestly.** Limit (e): the seal does not cover the door.
- **That a pane reading COMMITTEE.md sees any of this**, until a rebuild ships the brief.
- **That the prose is protected.** M13 says plainly that it is not.
- **Anything about the two reds I attributed elsewhere beyond the evidence in §4.** I showed
  `carrier-drift`'s findings are in files I never touched and `corpus-age`'s red predates my diff at
  `c2afec6`. I did **not** re-run either suite on a pristine worktree, because creating one writes
  to the shared `.git` while three panes are live.

---

    OBJECTIVE:  the loop diagram shows both doors, and a lap row says which one was used, so a
                direct-entry lap is never mistaken for a chair that failed to seal.
    FALSIFIER:  if the next direct-entry lap still produces a row indistinguishable from a missed
                seal, the field is decoration.

**Owed onward:** (1) §2.3 to whoever holds `index.html` after E — paragraph and insertion point in
§6. (2) `corpus-age.test.js` red since `c2afec6` — unclaimed, `main.rs` side. (3) the librarian's
ruling on the COMMITTEE.md scope extension (§1b) and on where the two `carrier:` tests belong (§9).
