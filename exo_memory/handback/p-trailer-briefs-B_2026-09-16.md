# P-TRAILER-BRIEFS · BRAVO — the rule into the two shells that are gated by it, and what "before the rebuild" actually means (D070)

**B (pane `12fb81f6`), machine D, 2026-09-16 ~13:1x.** HEAD `8e8d1bd` at open.
**Two files, append-only:** `consonance/src-tauri/brief/LIBRARIAN.md` (+17 lines, +1,278 B) and
`consonance/src-tauri/brief/COMMITTEE.md` (+14 lines, +1,048 B). No code, no rebuild, no relaunch. Nothing committed.

---

## 0 · RESULTS

| bar | result |
|---|---|
| `grep -c "NEXT:"` ≥ 1 in both | **LIBRARIAN.md 3, COMMITTEE.md 2** (was 0 and 0) |
| `cargo test --bin consonance brief` | **13 passed, 0 failed** — same as the baseline taken before the edit |
| `cargo test --bin consonance committee` | **10 passed, 0 failed** — same as the baseline |
| empty-stream guard | both runs through PowerShell with `C:\Users\nname\.cargo\bin\cargo.exe`; the bar prints `BAR FAILED` if no `test result:` line is found |
| COMMITTEE.md's own pin (`main.rs:12997`: no `chair_inject`, `post_board`, `raise_pull(`) | **0 matches** |
| the example trailers shipped in the briefs pass the gate itself | run through the shipped `trailer::check`: LIBRARIAN's example **PASS station=chair**, COMMITTEE's **PASS station=librarian**, and the stall line the brief cites as refused **NoStation** |
| raw NUL bytes | **0** in both files |

**And one finding bigger than the gap this lap closes (§2):** the bundled briefs the running exe serves on D are from
**09-06** (`BUILDING.md`) and **09-04** (`COMMITTEE.md`). No live seat on D has ever woken with the trailer rule in
its shell — including the chair.

---

## 1 · WHAT LANDED

**LIBRARIAN.md**, placed directly after *"Your half, concretely"* — the paragraph where the librarian's own ring is
described — so the rule sits where the librarian reads about ringing:

- the keeper's words, dated, and the shape as its own line;
- **it REFUSES**: *"Refused rather than warned because the refusal costs you one re-send and nothing else: it says
  which part is missing and hands your whole message back, and nothing reaches the chair"*;
- the concrete failure the station check exists for: *`NEXT: chunk 2 opens`* names no station, and that exact line
  preceded the 82-minute stall on 2026-09-16;
- **the other direction**, which only this seat needs: a pane's warned hand-back arrives pointer-first with a bracketed
  note, and *"when that note is there, the next station is yours to name."*

**COMMITTEE.md**, placed directly after *"What may ride in the call"* — the paragraph that already governs what a
pane's `call_librarian` carries — so the trailer is read as part of the call, not as a new topic:

- the keeper's words, dated, and the shape as its own line;
- **it WARNS, and why in one sentence**, so "warned" does not read as "optional": *"a refused call to the librarian
  discards the pointer it carries (`mcp.rs`, the out-of-turn arm of `call_librarian`), so refusing a hand-back over
  its last line would destroy the hand-back, and the gate is built never to do that"*;
- what the warning costs the pane anyway: a `trailer-gate` row counted by seat, and a librarian left to guess.

**Both cite rather than restate.** Each ends: *"The master is `BUILDING.md`, WHAT A HAND-BACK OWES item 6 (the …
side is WHAT A DISPATCH OWES item 6) — read it there; this is the pointer."* Neither copies the rationale, the 345/167
reminder counts, or the baseline — those live in BUILDING.md once.

### The citation is by symbol, and the packet's line number is why

The packet cites `mcp.rs:682-688` for the payload loss. **At `8e8d1bd` those lines are the doc comment of the
lap-holder guard.** The out-of-turn arm is now at **`mcp.rs:760-766`** (`grep -n 'mark_owed(&who, now_ms());'` →
`:765`) — it moved **78 lines when my own D069 wiring inserted the trailer check and `trailer_audit` above it.** A line
number shipped into every pane's shell would have been wrong on the day it shipped, so COMMITTEE.md names the arm by
symbol. (The same rotted citation is in my D068 and D069 hand-backs; they are dated traces and keep it.)

---

## 2 · WHAT "CLOSE IT BEFORE THE REBUILD" MEANS ON D — the served briefs, measured

`room_brief_at` (`main.rs:3329`) resolves a brief in **three tiers**, and the first hit wins:

1. an **editable copy** in `default_data()` = `%USERPROFILE%\.consonance` (`main.rs:738-740`);
2. the **bundled resource** beside the exe (`RESOURCE_ROOM`, set at `main.rs:11446`);
3. the repo's `brief/` directory.

**Tier 1 — no override exists on D.** `LIBRARIAN.md`, `COMMITTEE.md` and `BUILDING.md` are absent from both
`~/.consonance` and `C:\Consonance\data`. That had to be checked: **a tier-1 copy would silently outrank every edit to
the bundled brief, rebuild or not.**

**Tier 2 is what the running app serves, and it is old.** Content-hashed, not dated:

```
target/release/BUILDING.md    = blob of c51b40e (09-06 12:54)   HEAD = b0c13f2's text   STALE   NEXT: lines 0
target/release/COMMITTEE.md   = blob of 979db58 (09-04 13:01)   HEAD = 47c4dad's text   STALE   NEXT: lines 0
target/release/LIBRARIAN.md   = HEAD's blob (last src change 09-01)                     same    NEXT: lines 0
target/release/consonance.exe   built 09-16 08:29
```

**The reflog explains it, and it is not a defect in the build:** D fast-forwarded to include `b0c13f2` — the trailer
rule's text — at **`08:55:35`**, **26 minutes after** the exe was built (`git reflog`, `HEAD@{09-16 08:55:35} merge
origin/main: Fast-forward`). Nothing has been rebuilt since. **So every brief change landed on D today — the trailer
rule and the no-questions rule in `BUILDING.md` (`b0c13f2`), A's narrow push rule in `COMMITTEE.md` (`47c4dad`), and
this lap's two paragraphs — reaches a live seat only at the next rebuild. And so does the gate itself** (`8e8d1bd`),
which is compiled into the same exe. **The rule and its enforcement ship in one step**, which is exactly what this lap
was sent to guarantee.

**The live shells confirm it** (`grep -c 'NEXT: <station>'` on each `CLAUDE.md` as written at this morning's wake):

```
instances/main/CLAUDE.md        09-16 08:53   NEXT-shape lines 0   "WHAT A DISPATCH OWES" 1
instances/librarian/CLAUDE.md   09-16 08:52   NEXT-shape lines 0
instances/sibling-5bf9d657      09-16 08:52   NEXT-shape lines 0
```

**The chair's shell carries WHAT A DISPATCH OWES — the 09-06 version, without item 6.** That corrects my D068 hand-back
(§5, W1 below).

### What the rebuild must be checked for — the brief half of the live check

My D069 §5 lists five checks on the gate. **Add these three, or the gate can go live against shells that still lack the
rule:**

1. **The bundle refreshed.** After the rebuild, `git hash-object target/release/{BUILDING,LIBRARIAN,COMMITTEE}.md`
   equals `git show HEAD:consonance/src-tauri/brief/<f> | git hash-object --stdin` for all three. **Wrong if** any
   still matches `c51b40e` / `979db58` / the 09-01 blob.
2. **The shells carry it.** After relaunch, `grep -c 'NEXT: <station>'` is ≥ 1 in `instances/main/CLAUDE.md`,
   `instances/librarian/CLAUDE.md` and each pane's `CLAUDE.md`. **Wrong if** 0 anywhere — a refreshed bundle that no
   shell was rewritten from is the same gap one step later.
3. **Still no tier-1 override.** `~/.consonance/{BUILDING,LIBRARIAN,COMMITTEE}.md` still absent.

**Evidence the rebuild does refresh the bundle, and why it is only evidence:** every served copy is exactly the last
committed version before the last build that followed it — `BUILDING.md`'s copy is `c51b40e`'s text with an mtime of
`09-06 12:52`, two minutes before that commit. That is what copy-at-build looks like. **I did not rebuild to prove it**,
as ruled, so check 1 is owed.

---

## 3 · THE COST, NAMED

**`COMMITTEE.md` rides whole in every pane's shell** (the committee practice is seated first because it cannot ride in
part), so **+1,048 B comes out of every pane's map allowance** — `map_allowance = SHELL_SOFT_CEILING − fixed brief −
SHELL_TRANSCRIPT_FLOOR` (`main.rs:4232`). About one short map entry per pane. `LIBRARIAN.md`'s +1,278 B lands in one
shell. I kept both paragraphs to the rule, the shape, the one reason each seat needs, and the pointer; the rationale
stayed in BUILDING.md.

---

## 4 · WHAT I DID NOT VERIFY

1. **No rebuild, no relaunch** — so no shell has been written from the new briefs, and §2's three checks are owed.
2. **That tauri-build rewrites `target/release/*.md` on rebuild** is inferred from the dates and hashes in §2, not run.
3. **L is not checked.** L's bundle and shells, and any `~/.consonance` override copy on L, are unmeasured — the laptop
   may be in a different state from D.
4. **The `brief` and `committee` test filters test resolution and a few content pins**; none asserts the new paragraphs
   reach an intake. The room's own precedent (`the_handback_route_reaches_the_pane_intake`, `main.rs:13012`) asserts
   delivery, and **an equivalent for the trailer paragraph would need an edit to `main.rs`, which is not this lap's
   file.** Named as the next small test.
5. **The third tier (repo `brief/`) is only reached if tier 2 is absent**, which on D it is not; I did not test a machine
   without the bundle.
6. **Nothing committed.**

---

## 5 · WRONG (mine)

- **W1. My D068 hand-back said "the text moved the dispatch edge" — dispatches 7/9 → 5/5 "one lap under the text".
  The chair's shell on D never carried the text.** `instances/main/CLAUDE.md` was written at 08:53 from the 09-06
  bundle, with zero trailer-shape lines. **The 5 of 5 came from the conversation** — the keeper's words and the chair's
  own packets — **not from the brief.** The measurement stands; the mechanism I gave it does not. **Class: attributing a
  change to the carrier I had just edited, without checking the carrier had been delivered** — landed is not shipped,
  the lesson this room keeps finding, in my own sentence.
- **W2. I was about to cite `mcp.rs:682-688` in a brief read by every pane**, as the packet did — a number my own D069
  wiring had moved 78 lines the lap before. Caught by grepping for the arm instead of trusting the citation.
- **W3. I nearly read the stale bundle as "rebuilds do not refresh resources"** — a much larger and false claim. The
  reflog put the pull 26 minutes after the build; the honest reading is "no rebuild since the pull", and the refresh is
  left as check 1 rather than asserted either way.

---

## 6 · THE ONE LINE

**Both gated seats' briefs now carry the rule — refused for the librarian, warned for the panes, each pointing at
BUILDING.md — and on D no live shell, the chair's included, has ever carried it, because every brief change today is
waiting on the same rebuild as the gate; so that rebuild has to be checked for the text as well as the refusals.**

NEXT: librarian re-derive the §0 bars and §2's three hashes when you collate D070, then the chair rebuilds on D and runs §2's three brief checks beside D069 §5's five gate checks before the next task opens.
