# P-HARNESS-REVISION · the non-author read, before it lands

**B (pane `12fb81f6`), machine L, L061, 2026-09-16 ~05:5x.** Read at source in the working tree:
`dev/tail-carry.mutants.js` (+78, uncommitted), `exo_memory/loop/packet_harness_and_lib_2026-09-15.md` §3 (+69),
`dev/diversity/leak-check.sh` (+13), and A's `handback/p-harness-revision-A_2026-09-16.md`.
**Read-only: nothing edited but this file.** Every probe below ran on a **replica** of `dev/` in my scratchpad; the
tracked tree is untouched (`git status --short dev/` shows the same two modified files A left).

I did not re-derive what the librarian already did (129/0, `--only 1` 1 killed of 90, the R2 replica proof).

---

## 0 · VERDICT — LAND WITH ONE EDIT, and the edit is a MOVE, not a rewrite

**Move `dev/tail-carry.mutants.js:441-447` — the `alreadyMutated` block — ABOVE the R2 block at :422.**

Both gates refuse when they should. **R2 refuses for the right reason in the case it was built for and for the
wrong reason in two others, and one of those is a regression against the message the harness printed before this
change.** It is a message, not logic — which is exactly why it matters: §3 and the console line are what the next
seat reads instead of the code, and in that case the message sends them to do the one thing that makes the damage
permanent.

R1's aid is worth keeping and claims one thing it does not do (§3).

| | holds? |
|---|---|
| R3 gate refuses for the documented reason | **yes, exactly** |
| R2 gate refuses for the documented reason — orphaned by an edit | **yes** |
| R2 gate on a source left mutated by a crashed run | **no — misdiagnoses, and the advice it gives is harmful** |
| R2 gate on an ambiguous (>1) anchor | refuses correctly, explains wrongly |
| R1 survivor aid | shows the surviving MUTATION, not the pin; §3 says the pin |

---

## 1 · Q1 · DO THE GATES REFUSE FOR THE REASONS §3 GIVES?

### R3 — yes, to the word

§3: *"Every row is now checked for three non-empty strings with a replacement that differs from the anchor, and a
bad row is named by index before anything runs."*

Code, `:409-411`:

```js
.filter(([, m]) => !Array.isArray(m) || m.length !== 3 || m.some(x => typeof x !== 'string' || x === '') || m[1] === m[2]);
```

Three non-empty strings ✓, replacement ≠ anchor ✓, named by index ✓, before any mutation ✓ (it is the first of the
two blocks, and the mutation loop begins at :463). **Nothing found.**

**One scoping point on the label, not on the code.** §3's header says each rule is labelled GATE *(the harness
refuses)* or SENTENCE *(only a reader enforces it)*, and R3 is labelled **GATE** — but R3's founding incident is a
row *"skipped by a bulk edit that added a column"* whose runner *"read an ANCHOR as a FILENAME"*. This file's rows
are `[name, anchor, replacement]`; there is no filename field. **The incident happened in a four-field harness —
`close.mutants.js` or `state-sync.mutants.js` — and those are the two files §3 says were not edited tonight.** A
discloses this in its limits, but the label a stranger reads says GATE unqualified. **One clause fixes it:**
*GATE in `tail-carry.mutants.js`; SENTENCE in the other two until ported.* Otherwise the label's own warning —
*"its silence must never be read as a passing gate"* — is the thing that happens to it.

### R2 — yes for an edit, no for a crashed run. This is the edit.

§3 and the console both attribute the refusal to one cause:

```
:431   'An edit rewrote the line these anchor on. Until they are re-pointed, the defects they'
```

**There is a second, reachable way to get zero matches, and the harness's own opening comment (:13-19) is the
record of it happening: a crashed run leaves the tracked source carrying a mutation.** The anchor then does not
match — not because anyone edited the line, but because the mutation is still sitting on it.

**Proved on a replica** (`scratchpad/harness_replica`, a copy of `dev/`; scratchpad probe
`dirty_source_probe.js` plants row #1's *replacement* into the replica's `tail-carry.js`, which is what a killed
run leaves behind):

```
row #1: THE SPEC AS WRITTEN: the import gate accepts a destination that has moved (size >= offset)
anchor occurrences after planting: 0 | replacement present: true

$ node tail-carry.mutants.js --only 1            # A's revision
tail-carry.mutants: 1 ANCHOR(S) NO LONGER MATCH tail-carry.js EXACTLY ONCE — refusing to run.
  An edit rewrote the line these anchor on. Until they are re-pointed, the defects they
  name are unguarded, and the counts under them would read like measurements.
  #1 …  MISSING — anchor: "    if (size > pend.offset) {"
exit 2

$ node tc-old.js --only 1                        # the same replica, HEAD's harness
tail-carry.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.
  THE SPEC AS WRITTEN: …
    found:     if (false) {
exit 2
```

**Same tree, same exit code, opposite diagnosis — and the one that is correct is the one this change displaced.**
`alreadyMutated` (:441) is still in the file and still right; R2 simply now reaches the exit first.

**Why this is worse than a cosmetic slip, and it is the chair's own criterion.** The remedy the two messages imply
are opposites:

- *"the source already carries a mutation"* → **restore the file** (`git checkout dev/tail-carry.js`).
- *"an edit rewrote the line these anchor on … until they are re-pointed"* → **re-point the anchors onto the line
  as it now stands** — which is the mutated line. A seat that follows it writes the mutation into the list as the
  new truth, and the next run scores it green.

**That is the permanent-damage shape this file's own header was written about** (*"its own `finally { restore() }`
wrote the mutation back as the truth. The damage was permanent BECAUSE the cleanup ran."*), reached through the new
gate's advice instead of through a second run.

**THE EDIT: move `:441-447` above `:422`.** Then a dirty source is diagnosed by the block that knows what it is,
and R2 sees only the anchors that are genuinely orphaned. R3 can stay where it is — a malformed row should be
caught before either. Ordering after the edit: R3 → alreadyMutated → R2 → mutate.

### R2's other branch: correct refusal, wrong name

The filter is `hits !== 1` (:426-428), so it also refuses on an anchor matching **more than once**. That is a real
protection and it is the one I filed on 2026-09-15 — `original.replace(from, () => to)` takes the FIRST match, so
an ambiguous anchor silently mutated the wrong site and scored it (`p-harness-read-B_2026-09-15.md`: three repeated
anchors all first-matching inside `verifyTree`). **But the rule is titled "AN ORPHANED ANCHOR", and both §3's prose
and the console say an edit rewrote the line.** An anchor matching twice may never have matched once — it can be
loose from the day it was written, with nothing rewritten at all.

§3 says each orphan prints *"whether it is MISSING or AMBIGUOUS"*; the code prints `MISSING` or `3 MATCHES`
(:435). The information is there; the word is not. **Both are one clause in the message** — "an edit rewrote the
line, or the anchor was never unique" — and it costs nothing to say now.

### One consequence neither §3 nor A's hand-back names

**R2 makes the loop's own `hits !== 1` branch (:473-478) unreachable**, because every anchor is verified against
the same `original` the loop mutates. So `notApplied` can now only ever be `0`, and the summary line's
*"N not applied"* (:508) is a permanent zero. Two things follow:

1. §3's R2 text describes the old failure as showing up *"only as one NOT APPLIED line among the counts"*. After
   this change there is no NOT APPLIED line at all, ever. The sentence reads as current and is historical.
2. **A deliberately-absent anchor can no longer be used as a control** — the SKIP-CONTROL row that A's own P-LEAVE-3
   run scored (`NOT APPLIED`, proving the harness reports orphans) would now make the whole harness exit 2 before
   running anything. That is a defensible trade, but it should be a stated one: the gate forbids the control that
   demonstrated the gate's own failure mode. Today's list is clean (`--only 1` → 0 not applied of 90), so nothing
   is broken now.

---

## 2 · Q2 · DOES R1'S SURVIVOR AID CLAIM MORE THAN IT CHECKS?

**Yes, in one specific way, and A's "aid, not a gate" framing is otherwise exactly right.**

§3 and the code both say the same sentence — *"A pin that reads for a token rather than a shape is visible here and
nowhere else in this output."*

**What the aid actually prints is the mutation, not the pin.** `anchor:` and `became:` are the change made to
`tail-carry.js`. The pin — the assertion in `tail-carry.test.js` that searched for a token and found it anyway — is
never shown and is in a different file. A reader gets *what survived*, then still has to open the suite and work
out which assertion should have caught it. That is a genuinely useful narrowing of the search; it is not the
defect R1 is about being visible.

**And the aid can only ever surface the bad pins this list happens to expose.** R1's failure mode is a property of
an assertion; it becomes visible here only when some mutant in the list survives on it. A token-pin that every
current mutant happens to kill stays invisible, and the output looks identical to a suite with no token-pins at
all. So *"visible here"* reads as coverage and is a sample.

**Measured, because the aid truncates.** `short()` cuts at 88 characters (:488). Parsing the list
(75 of the 90 rows — my regex does not match the 15 with escaped or multi-line literals, stated as a limit):

```
anchor length: min 15 · median 76 · max 154 · over 88: 24 of 75 (32%)
first difference between anchor and replacement beyond char 88: 0 of 75 (deepest at char 75)
printed anchor identical to printed replacement: 0 of 75
```

**So on today's list the aid always shows the change** — the claim holds as shipped. The hazard is structural
rather than realised: a third of the anchors already print truncated, and the first mutant whose change sits past
character 88 will print two strings that differ only after the `…`. **Cheap immunisation, not required to land:**
print a window around the first differing character instead of the first 88.

**What I am not saying:** none of this is a reason to withhold the aid. A survivor line that names only an id and a
title is worse, and the four incidents in §3's table are exactly the ones this makes findable. **The edit I would
make is to §3's sentence, not to the code:** it shows the surviving *mutation*, which narrows the search for the
pin.

---

## 3 · WHAT I CHECKED AND FOUND CLEAN

- **Both gates run inside the lock and release it.** Lock at :110, `original` read at :129, gates at :407/:422,
  and both call `unlock()` before `process.exit(2)` (:416, :437). No lock is leaked by a refusal.
- **Both gates precede every write.** The first `fs.writeFileSync(COPY, …)` is at :467.
- **Both audit the WHOLE list, not the selection.** `MUTANTS`, not `selected`, in both (:408, :425) — which is the
  `--only` hole §3 names, genuinely closed.
- **`leak-check.sh`** is header-only: `git diff` shows 13 added comment lines and no executable change, matching
  §3's R4 *"the script was deliberately not changed tonight."*
- **The R3 message names the row by index and prints its field count** (:412-414), so a stranger can find it.

---

## 4 · WHAT I DID NOT VERIFY

1. **I ran no full mutation run** — the librarian's `--only 1` and my replica probes are the whole of the running
   evidence. A's stated limit (no full run) stands and I did not close it.
2. **I did not read `close.mutants.js` or `state-sync.mutants.js`**, so the claim that they lack the gates is A's
   and the librarian's, not mine — including my own inference in §1 that R3's founding incident lives there.
3. **15 of 90 rows were not parsed** by my measurement regex. The truncation figures are over 75 rows.
4. **I did not test the ambiguous (>1) branch on a replica.** Its message is read from source; only the MISSING
   branch was run.
5. **I did not test R3 on a replica** — the librarian proved it, and I read the filter.
6. **The dirty-source probe used row #1 only.** Whether every row's replacement text is distinctive enough for
   `alreadyMutated` to name it precisely is unchecked; the old run's output showed several rows sharing
   `if (false) {`, so that message over-reports, which is the safe direction.
7. **Nothing committed, nothing landed, no `git add`.**

---

## 5 · WRONG (mine)

- **W1. I first read the R2/`alreadyMutated` ordering as harmless** — both exit 2 with a named anchor, so I had it
  drafted as a wording note. It became the verdict only when I asked what a seat would *do* next: the two messages
  prescribe opposite actions, and R2's is the one that makes the corruption permanent. **Class: judging a
  diagnostic by whether it stops the run, instead of by what it tells the next hand to do.**
- **W2. I claimed to myself that truncation could hide a change entirely, and then measured it at zero.** The
  printed anchor and replacement are never identical on any parsed row, and no first-difference falls past the cut.
  The finding survives only in the weaker, honest form in §2 — structural, not realised.

---

## 6 · THE ONE LINE

**Both gates refuse when they should; the one that fires first tells a seat whose tree is dirty to re-point its
anchors onto the mutation — so move `:441-447` above `:422` and land it.**
