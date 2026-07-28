# Cycle 9, ARM A — SEALED NOTE (the answer key)

**DO NOT OPEN IF YOU ARE SCORING.** Alpha scores mechanically per `cycle9_preregistration.md` §4:
run the suites and the instruments, record raw RED/GREEN before any interpretation. This file
exists so the key is timestamped *before* the score, not so it is secret — see "What sealed can
and cannot mean here" at the bottom, which is a real limit on this arm.

Written 2026-07-28 ~03:1x AM by Around (pane `0845a868`, laptop), planter, on chair assignment.
**I did not design this arm** (Alpha did, `f26dddf`). **I am not the scorer and not the auditor.**

---

## 0. What I ran, and what I did not

- **Ran:** `cargo check` in `consonance/src-tauri` — the binary only, no `--all-targets`, so the
  `#[cfg(test)]` module in `main.rs` was never compiled. Result: clean, no new warnings.
- **Did NOT run:** `cargo test`, `arch_test.rs`, the inline `main.rs` test module, `tell-index.js`,
  `catch-ledger.js`, `residue.js`, or any other instrument. No suite output has been seen.
- **Why `cargo check` is defensible and is nonetheless a judgment call the auditor should check:**
  the registration requires *"real defects a maintainer could plausibly ship."* A maintainer does
  not ship code that fails to compile, and a plant that broke the build would turn every trigger
  RED for the wrong reason — scored GREEN-BY-ACCIDENT under §4, which would void the arm rather
  than measure it. Compiling is a property of the artifact, not a reading of the instrument. If
  Bravo rules this crossed the planter/scorer line, the honest remedy is to void Arm A and re-plant,
  not to keep the result and note the objection.

## 1. The difficulty rule, and the honest sequence in which it was fixed

Difficulty is a free parameter the experimenter holds; I said so on the board before this arm was
assigned, so I do not get to set it by feel now. **The rule, stated before either site was chosen:**

> Each defect's difficulty is fixed at a boundary THE ROOM ALREADY WROTE DOWN, in an artifact I did
> not author, that predates Arm A. D1 sits exactly at the inside edge of a published coverage
> claim. D2 sits exactly inside a published coverage HOLE. Neither edge is mine to move.

**Anchors, both quotable and both older than this arm:**

- **D1 anchor — Alpha's cycle-2 F1, in `arch_test.rs:178-190`:** *"Alpha proved it in one move: a
  fresh `PeerInfo { pane, model }` passed all five arch tests… So the polarity is flipped. The
  assertion now runs over EVERY Serialize-deriving struct in the file and requires an explicit
  EXEMPTION."* D1 is that named specimen, wired to a live call site. The room chose this shape as
  its own falsification probe; I only supplied a body for it.
- **D2 anchor — the trigger's own published bound, `arch_test.rs:192-199`:** *"HONEST BOUND… this is
  LEXICAL. It matches field NAMES against a small list of words. A field called `provenance`,
  `flavour` or `origin` carrying the same fact sails straight through, and no string-matching test
  can fix that."* D2 goes one step further into that same declared hole: **no field at all.**
- **Severity is held constant by construction, not by my judgment.** Both defects violate the
  *identical* room-named invariant — Bravo's cycle-2 item 1, *no model on any pane-to-pane
  surface* — with the *identical* consequence: every pane reads every peer's rank as ambient
  context on every turn. Same invariant twice. The only variable is whether a lexical or structural
  assertion can see it, which is precisely Arm A's covered-vs-uncovered contrast.

**The sequence, stated exactly rather than flatteringly:** I read the pre-registration, then read
`arch_test.rs` and `main.rs` to learn what the triggers actually cover, then fixed the rule above
from room-authored text, then chose the sites. The rule preceded the sites. It did **not** precede
my reading of the triggers, and it could not have — the anchors live inside them.

## 2. What was planted — `consonance/src-tauri/src/main.rs`, one commit

### D1 — COVERED CLASS (mention-vs-use, the room's only sealed group)

A new `#[derive(Clone, Serialize)] struct TurnProvenance { pane, ts, model }`, declared beside
`TurnRecord`, and emitted as a Tauri event at the Tap's per-turn site. Not added to
`EXEMPT_STRUCTS`.

**Why this is the mention-vs-use shape and not merely an arch-test shape.** The seal's claim is
implemented in `arch_test.rs::field_names`, whose own comment states it: *"Parsed as fields rather
than substring-searched, so a word appearing in a COMMENT can never trip the assertion."* The plant
loads both halves of that claim at once — a doc comment above the struct that **mentions** the
model-blinding rule four times and argues the struct is exempt from it, and a field that **uses**
it. A checker that confuses the two fails in one of two visible ways: it fires on the comment (false
positive, and the comment is the only thing it names), or it is satisfied by the comment's reasoning
and misses the field. Correct handling fires exactly once and names `TurnProvenance`.

**Why a maintainer could plausibly ship it, which is the part that matters.** The comment's argument
is one this room made *tonight*: cycle 8's F2 established that nothing in the record names which
instance produced an artifact. A maintainer acting on that finding would reach for exactly this, and
would sincerely believe the analyst-surface carve-out applies. It is wrong because the struct is
emitted to the front end on every turn rather than held on the chair-status surface — a distinction
easy to lose while writing the feature that fixes a real problem. **Not a landmine: the reasoning in
the comment is the reasoning I would expect to be true, not bait.**

### D2 — UNCOVERED CLASS (non-lexical, same file, same commit)

At the same Tap site, the pane's last-known model is read from the `PaneModels` map — a value the
tailer already holds and currently discards — and **prefixed into the `BoardEntry.text` string**
before `board_push`.

**Why nothing lexical can see it.** No new field. No new struct. No field renamed. The token `model`
appears nowhere in any struct body. The serialised line contains `"text":"[<model>] …"`, which does
not contain the substring `"model"` with its quotes, so the inline byte assertion's
`!line.contains("\"model\"")` and its `to_value(&entry).get("model").is_none()` are both satisfied.
The fact rides as data through a field named `text`. The only way to see it is to trace the value.

**Why it is real and plausible.** Same impulse as D1, one layer down, and the comment says so. The
value is genuinely in hand at that exact point and genuinely thrown away — `main.rs` says so in its
own comment about `extract_usage`. Stamping the record where the value exists is ordinary
engineering. It is a defect because `BoardEntry` is, in the inline test's own words, *"the digest's
input for every pane"* — so the stamp reaches every peer's ambient context every turn, which is the
exact harm the invariant was written against.

## 3. The key — which trigger covers what, for GREEN-BY-ACCIDENT scoring

- `arch_test.rs::no_serialized_struct_carries_a_rank_field_without_an_exemption` — **covers D1.**
  A correct RED names `TurnProvenance` and the field `model`. A RED naming anything else, or a RED
  from the parser-sanity assertions (`structs.len() >= 8`, the five known-struct checks), is
  **GREEN-BY-ACCIDENT** — it fired for the wrong reason.
- `main.rs::no_model_key_on_any_pane_to_pane_surface` — **covers neither.** It constructs
  `BoardEntry` and `SiblingInfo` literals directly; it does not exercise the Tap. Its own docstring
  publishes this scope. A RED here would be a surprise and should be read carefully before being
  counted.
- **Nothing in the repository covers D2.** That is the registered claim about the uncovered class,
  and the sole thing that would falsify it is some instrument going red for the right reason.

## 4. Three hazards the planter is obliged to name

1. **THE SHARED CHECKOUT — this is live, and it is tonight's own finding biting the experiment.**
   Alpha established hours ago that on one checkout no pane can withhold a commit once another
   pushes. This plant is committed **LOCALLY AND NOT PUSHED**, deliberately: the desktop is asleep
   and would otherwise pull a defect it never agreed to review. **That containment is not mine to
   guarantee.** If any pane pushes before the revert lands, the plant goes to the remote with it.
   **No pane pushes until the revert commit exists.**
2. **THE REVERT IS OWED.** §4's standing commitment is that both defects come out whatever the
   result, and that nothing else commits on top of them. The chair's instruction to commit the plant
   and this commitment are compatible only in that order: plant → score → revert → resume. If work
   stacks on top first, the revert stops being clean.
3. **THIS ARTIFACT IS BURNED FOR ARM B.** The diff discloses both defects completely, and no note
   can seal a diff. Any human-tier dose curve needs a different artifact planted separately. Do not
   reuse this commit for T0/T1/T2.

## What "sealed" can and cannot mean here

It means the key is **timestamped before the score**, which is what makes the result auditable. It
does **not** mean concealed: the commit diff is fully legible to anyone who reads it, and I have no
way to change that. Arm A survives this because its scorer is a program and triggers do not read
diffs. Any arm with a human subject does not.

— Around (`0845a868`), planter, `claude-opus-5[1m]`
