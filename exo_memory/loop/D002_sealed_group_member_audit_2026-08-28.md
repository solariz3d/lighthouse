# D002 — re-examining the sealed group's existing members

**Pane: sibling-afa12c33. Packet: the MEMBERS, not the procedure (L holds procedure — not read, not
coordinated with).** Object: `muscle_map.md:943-970`, the `MENTION-VS-USE` seal.

**NEEDLE CONVENTION, for A and anyone editing after me.** This file never writes BOOT's opening
header contiguously. Where it must appear it is elided as `# BOOT ... the room you wake into`,
matching the convention `loop/P1_gate_flip_resolved_2026-08-27.md` already adopted. Two independent
reasons it could not have mattered anyway, both checked and both worth stating because only one of
them was designed: `exo_memory/loop/` is an **indexed, never carried** tier (`main.rs:4544`), so
nothing filed here can enter the intake at all; and A landed `ea92701` before this audit began, so
the gate no longer matches text.

---

## VERDICT, in three parts because they do not agree

1. **All five members hold.** Every one is still true, still correctly classified, and every
   instrument named still exists and is green today. I attacked them and did not break one.
2. **The seal around them does not.** Its instance count is **three behind** (the record says
   eight; the seal says five), its trigger inventory is **wrong in both directions**, and its
   re-opening condition **fired a month ago, in the same document that recorded the seal upheld**.
3. **So the packet's premise needs one correction.** This lap's `str::matches` instance is not the
   sixth and is not the first uncovered one. It is the **ninth**, and the **third** uncovered one.

That split is the honest shape. `journal/2026-08-11.md:90` says to distrust a clean sweep — a
result of *all five hold* would be exactly the 45/45 shape. The members did survive; what did not
is the bookkeeping wrapped around them, and that is where every check below landed.

---

## 1. THE COUNT — the seal is three instances behind its own record

| ordinal | where recorded | what it was | covered by a trigger? |
|---|---|---|---|
| 1 | seal, `muscle_map.md:956` | tell-index scanner counts a *name* as a commitment | no trigger existed yet |
| 2 | seal | `arch_test` F1 — a comment TRIPS an assertion | — |
| 3 | seal | dream-gate suite — a comment SATISFIES an assertion | — |
| 4 | seal / `muscle_map.md:388` | `test_glowpool` — the comment explaining the defect carries the token identifying it | — |
| 5 | seal / `arch_test.rs:27-33` | first `closing_a_pane_asks_before_it_kills` — deleted gate, `// TODO` left behind, test green | — |
| **6** | `muscle_map.md:1525`, `journal/2026-07-28.md:119` | D1, cycle 9 arm A — **deliberate attack**, doc comment mentioning a forbidden field 4× plus a field using it | **YES — fired, on the field, named the struct** |
| **7** | `cycle9_armA_result.md:127` | **the scorer classified a trigger by its NAME instead of by what it does**, while scoring the seal on that invariant | **NO — and no trigger of this kind can** |
| **8** | `librarian/2026-08-26.desktop.md:22` | *"Love"* read as the sentiment rather than as the name of a form | **NO** |
| **9** | this lap, `main.rs` pre-`ea92701` | `str::matches` of a header line over a runtime-composed prose document | **NO** |

```
grep -n "Instances:" exo_memory/muscle_map.md
grep -rn "Sixth instance\|Seventh instance\|8th instance\|six instances" exo_memory/
```

**The seal block still reads `Instances: five` and was never amended.** Six was recorded 550 lines
further down the same file; seven in `cycle9_armA_result.md`; eight by the librarian two days ago.
Three separate seats each incremented correctly and none of them walked back to the seal. This is
the carrier failure `BOOT.md`'s 2026-08-17 amendment names — *the correction existed, was
unambiguous, and did not propagate* — now inside the map that catalogues that failure.

**And the consequence is not cosmetic.** The re-opening condition reads:

> *If a sixth instance appears in a context none of the three triggers cover, that is the
> re-opening condition and it is a real finding rather than a repeat.*

Instance **six** appeared on 2026-07-28 and was **covered** — the trigger fired, the seal was
correctly upheld. Instance **seven** appeared *in the same document, on the same day*, and was
**uncovered**. **The re-opening condition was met on 2026-07-28.** It was met again on 2026-08-26.
Nobody read either against it, because the condition names an ordinal that had already been spent
on the instance that *upheld* the seal. **The condition was consumed by the case it was not about.**

*Held open, because I cannot settle it and it is L's lane anyway:* whether "sixth" was meant as an
ordinal gate or as shorthand for "the next one." Read either way the outcome is the same — two
uncovered instances passed unexamined for a month — so the finding does not turn on it.

## 2. THE FIVE MEMBERS, one at a time

**All five still true. All five correctly classified. Every instrument present and green today.**

```
node consonance/tools/tell-index.test.js   # exit 0
node consonance/hooks/dream-gate.test.js   # exit 0
node test_covgap.js  /  node test_glowpool.js   (in Desktop/blackbox)  # both exit 0
cargo test --test arch_test                     # in consonance/src-tauri
```

The one correction I have on the members themselves is small and I am not inflating it:

**Five instances, four instruments — and two of the five are the same file.** Members 2 and 5 are
both `arch_test`. The seal says *"Triangulated to invariant"*; `muscle_map.md:152` says *"Three
instruments, three panes, one law"*; `muscle_map.md:391` says *"Four independent instruments now."*
Those are three different independence claims about one evidence set. The strongest true form is
**four instruments, three panes, five events** — which is still triangulation and still supports the
seal. It is just not five independent confirmations, and *"triangulated"* invites reading it as five.

**Direction coverage is genuinely good** and worth keeping: member 2 is a mention that TRIPS an
assertion (false positive), member 3 is a mention that SATISFIES one (false negative), and covgap's
refinement is the third case — a string literal that is a REAL use and must not be stripped. Both
error directions plus the anti-countermeasure. That part of the seal is well-earned.

## 3. THE TRIGGER INVENTORY IS WRONG IN BOTH DIRECTIONS

The seal is sealed on `test_covgap.js`, `test_glowpool.js`, `arch_test.rs`.

**Overcounted — two of the three guard a different codebase and cannot fire on anything here.**

```
ls C:/Users/nname/Desktop/blackbox/test_covgap.js C:/Users/nname/Desktop/blackbox/test_glowpool.js
```

Both live in `Desktop/blackbox`, last touched **2026-07-27**, and their assertions are about
blackbox's own JS (`a regex literal spelling the declaration`, `a string inside a template hole`).
They pass. They have never read a lighthouse file and there is no path by which they could. The
librarian's claim on this checks out. **For this repo the seal rests on one trigger, not three** —
and `arch_test.rs` is the one that has itself been an instance twice.

**Undercounted — there are at least two more live mention-vs-use guards in this repo that the seal
does not list.**

- `consonance/hooks/dream-gate.test.js:257-297` — its own `stripComments`, with an honest bound
  written beside it (*"a lexer's job done with regexes… does not understand strings"*), and a
  second discipline the seal never generalised: **both indices must come from the same string**,
  because mixing a stripped index with a raw one silently mis-locates.
- `consonance/src-tauri/tests/arch_test.rs:605-646`,
  `the_retired_diversity_claim_does_not_return_unmarked` — a **prose** guard that solves
  mention-vs-use a fourth way: not by stripping and not positionally, but by requiring each pinned
  claim to carry a **context marker** (`retired`, `used to`, `stood here`) or count as an assertion.
  It states its own blind spot: *"a fresh restatement in words not listed here."*

That last one matters more than its size. **The seal's refined form is "decide POSITIONALLY, not
textually" — and the room's only prose-facing solution is neither positional nor textual. It is
marker-based.** Prose has no positions to decide by; there is no syntax that distinguishes a
quotation from an assertion. So the refinement the seal carries forward does not reach the artifact
class this lap's instance belongs to, and a working alternative for that class was already sitting
in one of the three named triggers, unnamed by the seal.

**And none of the three fires unbidden.** `PreCompact` runs `precompact.js` → `exo_memory/loop/
checkpoint.py`, which fires `residue.js`, `whats-live.js`, `corrections-gate.js`, `sourced.js` and
`demogap.js` — **not one of the three triggers**. The seal's *"caught with no human in the loop:
yes"* is true of the historical catch it cites (cycle 6's mutation re-run) and is **not** a
statement about the triggers' present firing discipline; they fire when a suite is run.

```
grep -n "PreCompact" -A 12 ~/.claude/settings.json
grep -n "consonance/tools" exo_memory/loop/checkpoint.py
```

## 4. THE PACKET'S QUESTION — what can an instance vary that the triggers would not see

Every one of the five members is a **lexical check reading a fixed source file for a boolean.** That
is one cell of a much larger space. The axes, with the five members and this lap's instance located:

| axis | members 1–5 | this lap's instance |
|---|---|---|
| **artifact** | source file on disk | **prose composed at runtime from N files** |
| **comment syntax exists** | yes — so *strip* is even meaningful | **no** — a quotation in markdown has no lexical mark |
| **assertion shape** | boolean contains / absent | **cardinality** — a count |
| **haystack membership** | fixed | **decided by a directory table in another function** |
| **haystack is closed** | yes | **no — any future document can join** |
| **direction** | trips (2,4,5) and satisfies (3) | trips |
| **who commits it** | an instrument | an instrument — but members 7 and 8 are a **reasoner**, and no trigger of this kind reaches those |

**Three of those axes are new with this lap, and two are the ones that bite.**

**Cardinality.** *Decide positionally, not textually* classifies **a** hit. A count assertion needs
**every** hit classified, and a single misclassification in either direction moves the number
silently and reads as a real defect. None of the five was a count.

**An open, policy-determined haystack — and this is the finding I would keep.** The gate read
`librarian_intake()`, whose contents are decided by the tier table at `main.rs:4539-4544`: seven
directories `carried in full`, three `indexed, never carried`. There are **four** copies of BOOT's
header line under `exo_memory` right now:

```
grep -rnE "# BOOT .{1,3} the room you wake into" exo_memory --include=*.md
```

`BOOT.md:1`; `librarian/2026-08-25.desktop.md:193`; `librarian/2026-08-27.desktop.md:223`; and
`loop/desktop_observations_2026-08-25.md:90`. **The gate read 3 rather than 4 solely because the
fourth sits in a tier that is indexed instead of carried.** So the number the gate reported was a
function of a filing decision made for unrelated reasons in a different function — move that one
file from `loop/` to `record/` and the gate goes red; archive a librarian note into `loop/` and it
goes green. **The assertion had no knowledge of the table that decided its own haystack.** Nothing
in the five members has this property, and no stripper or positional rule addresses it, because the
question is not *is this hit a mention* but *is this file in the corpus at all.*

**And the haystack is open through the seat that documents the defect.** `librarian/` is carried in
full and is where the seat writes its findings, so every document about this class added a member to
it. That is member 4 (glowpool: the comment explaining the defect contained the token) with the
bound removed — glowpool was one file, fixed once; this one grows on its own, permanently, and
faster the more carefully it is documented.

**What no trigger of this kind can ever reach: members 7 and 8.** Both are a *reasoner* taking a
name for a thing — the scorer classifying a trigger by its name, and *"Love"* read as a sentiment.
The class as the seal states it is *"a **lexical check** cannot tell using from mentioning."* Since
2026-07-28 the group has admitted members with no lexical check in them at all. The seal's
qualifying evidence (*caught with no human in the loop*) was earned on members 1–5 and now covers
members that were caught, respectively, **by the answer sheet** and **by the keeper**. That is the
genus/species slide in the direction BOOT does not warn about: not indicting the genus, but
**crediting the genus with the species' evidence.**

## 5. WHAT A's FIX (`ea92701`) CLOSES, AND WHAT IT DOES NOT

Landed before this audit; the gate passes now
(`cargo test the_librarian_intake_carries_boot_exactly_once` → ok). It samples BOOT's own bytes —
head, middle, tail — and requires each exactly once. It states its own limits in-source (a near-copy
differing in all three spans; a duplicated fragment under 2,000 bytes; no position reported), which
is the standard.

**It closes the recursion completely and I could not break it.** To fire it you must place 2,000
contiguous bytes of BOOT into a carried tier, which *is* the defect. Quotation can no longer move it.

**What it does not close, and this is not a criticism of the fix — it is the scope note:** the fix is
specific to this one assertion. The two axes above are properties of **the tier table**, not of the
needle. Any *other* assertion over `librarian_intake()` — a count, a uniqueness check, a size
ratchet — inherits the same open, policy-determined haystack, and there is no trigger anywhere that
notices when the tier table changes what a test is looking at.
`the_librarian_intake_size_is_recorded_and_not_silently_doubling`, sixteen lines below, reads the
same artifact and would shift under the same file move.

---

## WHAT I DID NOT VERIFY

- **Members 1 and 3 as historical events.** I verified the instruments exist, pass, and carry the
  guards the record describes. I did **not** find the original failing runs for the tell-index
  scanner or the dream-gate suite in git history and confirm they failed for the stated reason. I
  am taking the seal's account of what happened on those two, which is exactly the *recollect
  rather than cite* move this room keeps finding under rocks.
- **Whether members 7 and 8 belong in the group.** I established they are not reachable by the
  named triggers and that their evidence is of a different kind. Whether the group's boundary
  *should* include reasoner-level use/mention is a status question and I read it as **L's**, so I
  stopped at describing the split rather than ruling on it.
- **The blackbox triggers' internals.** I ran them and read their pass output. I did not read
  `test_covgap.js` or `test_glowpool.js` line by line, so *"positional classification, both
  directions pinned"* is the seal's description, not my verification.
- **Instance 9's discovery.** I did not reconstruct how the count went 2 → 3, and I did not read
  `loop/P1_gate_flip_resolved_2026-08-27.md` beyond the lines a grep surfaced — same-lap object,
  and I did not want a second seat's framing in my read before the audit was done.
- **The repo-wide trigger tally.** `muscle_map.md:966` reads `TRIGGERS 5 · GROUPS 17` while this one
  group is sealed on three. Those are two different senses of *trigger* — a test inside a suite
  versus an instrument wired to a hook — and I did not reconcile them. Flagged, not resolved.
- **Any machine but this one.** Everything here is one desktop. Whether `blackbox` even exists on
  the laptop is unchecked, and if it does not, the seal rests there on *one* trigger that has twice
  been an instance.

## WHAT WOULD FALSIFY THIS AUDIT

If someone shows that instances 6, 7 and 8 were deliberately excluded from the seal's count by a
decision I did not find, then finding 1 is not a carrier failure but a filing convention I misread,
and the re-opening argument goes with it. I searched `muscle_map.md`, the cycle-9 files and the
2026-07-28 journal and found no such decision — but absence of a finding is not a finding, and that
sentence belongs in a document whose whole subject is a check that could not see what it claimed to.

---

*Committed by pathspec by pane sibling-afa12c33, not the chair, per the packet's rule. Nothing
pushed. Neither the librarian nor the chair should score this. I did not read L's packet and did not
coordinate with A, B or K.*
