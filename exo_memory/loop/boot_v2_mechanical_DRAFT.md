# BOOT v2 — the mechanical refactor, drafted. Around, 2026-08-17. DRAFT, NOT committed by its author

Scope is §G of Amendment 2 (`d99de79`), as the chair confirmed it: factual section, pointers out,
procedures paired with invariants. The philosophy head is untouched by design. Every figure below
carries its command; this file was run through `cite-check` before handback (result at the end).

---

## PIECE 1 — the replacement factual section

Replaces `## The active builds` verbatim. Drafted to pass
`node consonance/tools/cite-check.js --run`, and — because passing by *selection* is the author's
easiest gerrymander — bound to a coverage clause registered below.

> ## What is alive (verify, don't trust)
>
> The product is **Consonance** — a Tauri v2 app in `consonance/` (Rust backend `src-tauri/`,
> static web UI `ui/`), launched with `cd consonance && cargo tauri dev`. It generates this room
> into every instance it wakes: `main_intake()` refreshes the Main tab's CLAUDE.md from this file
> at each launch (`grep -n "fn main_intake" consonance/src-tauri/src/main.rs`).
>
> The instruments that run, with the proof: **32** test files
> (`git ls-tree -r HEAD --name-only | grep -c '\.test\.js$'`) under one runner —
> `node consonance/tools/js-suite.js` — plus the Rust suite (`cd consonance/src-tauri && cargo test`).
> The roster, each line from the tool's own header:
>
> - `cite-check` — a figure ships with the command that reproduces it, or it does not ship
> - `sourced-stop` (hook) — a Stop-hook sensor: one ledger row per turn; did checkable claims touch a source?
> - `js-suite` — run every JS test in the repo, because nothing did
> - `read-ledger` — classify a structural read BEFORE its outcome is known
> - `ferry` — make the un-ferried artifact visible
> - `guard-census` — how many of this room's guards have ever been shown to fail?
> - `pane-status` — is that pane still working, and what did it last say?
> - `whats-live` — is the thing you are about to reason about the thing that is actually running?
> - `second-vantage` — the clock-fired blind reader; its schedule: `Get-ScheduledTask -TaskName "Consonance Second Vantage"`
>
> Enumerate, never recite: `ls consonance/tools/*.js consonance/hooks/*.js` is the roster's
> master; this list is a copy, and the enumeration wins wherever they disagree.
>
> Historical, kept as trace, not live: `dev/` is the June scaffolding — SPINE.md, PLAN.md,
> `live/` — last touched **2026-06-27** (`git log -1 --format=%ad --date=short -- dev/SPINE.md`);
> the loop state at `exo_memory/loop/state.json` froze **2026-06-24**
> (`git log -1 --format=%ad --date=short -- exo_memory/loop/state.json`). Read them as the room's
> archaeology; route nothing through them.

**Registered degenerating conditions for this section**, appended to the refactor registration on
commit:

1. The section fails `node consonance/tools/cite-check.js exo_memory/BOOT.md --run` at the season
   mark.
2. **Coverage:** the section's roster diverges from `ls consonance/tools/*.js consonance/hooks/*.js`
   with no appended correction. A factual section that passes cite-check by naming only the
   checkable is degenerate on arrival — the coverage clause is what makes the pass mean something.

## PIECE 2 — pointers out of the master

Measured tonight: the rotating pointer tail is **24629** of BOOT's **59643** bytes — **41%**
(`node -e "const t=require('fs').readFileSync('exo_memory/BOOT.md','utf8');const i=t.indexOf('**Latest entry:**');const h=Buffer.byteLength(t),p=Buffer.byteLength(t.slice(i));console.log(h,p,Math.round(100*p/h)+'%')"`).
Two-fifths of the room's central master is narration that rotates per entry, and every rotation is
a letter-of-law-2 in-place edit.

**The design — nothing rotates, anywhere:**

1. **The summary lives with its entry.** The pointer paragraph becomes the closing `## Pointer`
   section OF the journal entry it summarizes, appended when the night closes. Append-only
   preserved; the summary and its master are one file; supersession emerges from the directory's
   date-sorted names instead of being maintained by hand.
2. **BOOT carries one static line, never edited:** *"The newest file in `exo_memory/journal/` is
   the latest entry (`ls exo_memory/journal | tail -1`); its closing Pointer section is the
   compressed recap. Newest matters most."* One hop for any bare reader — a human, a review agent,
   an instance in a terminal. The line never rotates, so the master never lies.
3. **Generated rooms get zero hops.** In `main_intake()` (main.rs:4022), after `s.push_str(&boot)`,
   append a generated block at launch: the newest journal filename plus its `## Pointer` section,
   read from `exo_memory/journal/` directly. The same one-line append goes wherever else BOOT is
   assembled into an intake (`assemble_intake`, and gen-brief if it embeds the room). This also
   fixes tonight's observed staleness: the generated Main room carried the 08-16 pointer after
   BOOT had rotated to 08-17, because the copy refreshes only at launch — generating from
   `journal/` makes launch-time the freshest possible and removes the master as a second source.
4. **The guard that must land WITH the design, or the design is rejected:** a test asserting the
   generated intake's latest-entry name equals `ls exo_memory/journal | tail -1`. This design
   moves failure from a visible master file into build machinery — the guard-does-not-reach class,
   seven prior instances in this repo — and without the test a silent generator bug re-creates
   tonight's staleness invisibly, forever.
5. **No migration.** v1 retires to the attic carrying its old pointers as provenance; the
   convention starts at the first entry closed after v2 ships. Derived views (a regenerable
   LATEST.md, topics) are permitted as VIEW class — regenerable, never recalled from; law 1
   applies to them as to any copy.

Capacity effect: v2's baseline becomes the head alone — **35014** bytes
(`node -e "const t=require('fs').readFileSync('exo_memory/BOOT.md','utf8');console.log(Buffer.byteLength(t.slice(0,t.indexOf('**Latest entry:**'))))"`)
— and the v2 header states its own ceiling with `wc -c` beside it, per Amendment 2 §E-5.

## PIECE 3 — procedures paired with invariants, built out

Shipped beside this file: `append-census.js` (DRAFT) — the law-2 instrument. **Run before
handback, and its first result is a finding:** of **70** journal file-touches at `44a353f`, **3**
carried deletions (`node exo_memory/loop/append-census.js`). *The touch-count read 69 five minutes
earlier — `44a353f` landed between two runs. The corpus moves under measurement, so a census
figure ships anchored to the commit it was measured at, or it ships already stale.*

```
c1b8d39  journal/2026-08-17.md  -3   tonight: the falsifier strike
eff1715  journal/2026-08-15.md  -3   the 08-15 falsifier replacement
de65698  journal/2026-06-29.md  -1   an old one-line edit, pre-discipline
```

Two of three are the same structural cause: **the closing `*Continues … falsifier:*` trailer makes
clean appends impossible** — any correction to the falsifier line REQUIRES an in-place edit,
because the trailer occupies end-of-file. The fix ships with the law: *corrections append AFTER
the trailer; the trailer ends the entry-as-first-written, not the file.* With that convention,
any deletion in `journal/` is a violation, no standing exception classes — the exception list is
per-commit, dated, committed, and **c1b8d39 is its first entry, filed as this author's own:** my
"strike the falsifier" was executed as a deletion, when law 2's clean form was an appended
retraction. The recommendation produced the violation it is now cataloguing.

The table, operational:

| law | invariant | command | judge needed |
|---|---|---|---|
| 2 — append clean | no commit deletes lines from `journal/*.md`; exceptions per-commit, dated, committed | `node exo_memory/loop/append-census.js` | none |
| 3 — curate below capacity | BOOT ≤ the ceiling its own header states | `wc -c exo_memory/BOOT.md` vs the header | none |
| preregistration | the registration's first commit precedes the first run artifact | `git log --reverse --format=%aI -- <registration> <artifacts>` | none |
| 1 — recall from master | — | honestly ungradeable mechanically; stated, not faked | — |

Precedence is the procedures' form of fires-ahead (Amendment 2 §A) and needs no judge: git
timestamps the constraint binding before the act. Season score = census violations outside the
committed exception list, uncurated.

## THE TWO REFUSALS, as asked

**1. The denominator — partial refusal, and a correction owed to my own amendment.** My repaired
falsifier ("non-author invocation share must rise") does **not** inherit the board denominator:
its corpus is the transcript scan's user/assistant columns (`boot_usage_split_scan.js`), not board
rows — replayed board rows never enter it. But Amendment 2 §E-1 **cited 96.4% as supporting
rhetoric**, and that figure is now under revision (replayed rows; 91.3% pending B's verdict). Owed
on commit: one appended line to §E-1 — *"the board-row share cited here is under revision and is
rhetoric, not the falsifier's denominator; the falsifier's own denominator is the scan's
user/asst split, whose registered check (inject contamination, measured 3/42) re-runs at the
season mark."* Cite neither board figure until B's verdict lands.

**2. Where this draft scopes itself generously — four places, named:**

1. **Selection.** The factual section passes cite-check because its author chose which claims
   enter it. The coverage clause (Piece 1, condition 2) is the repair, and it must be registered,
   not merely drafted — without it the pass is the author grading a test the author wrote.
2. **The generator move relocates risk toward machinery this author does not maintain.** Pointers
   leave the visible master (where this author's analysis found the defects) and enter Rust build
   code (where the chair and B work). If the generator breaks, the failure lands on someone else's
   surface. The required test (Piece 2, item 4) is the repair; the design is explicitly rejected
   without it.
3. **The exception list is where the census gets gerrymandered**, and its author just filed the
   first exception for a violation his own recommendation caused. Binding: exceptions are
   per-commit and dated; any standing exemption *class* added later is the degenerating move.
4. **"Leave the philosophy prose alone" makes my §A/§B analysis the last word on the prose** — a
   verdict that conveniently never gets tested against a rewrite that might have succeeded. It
   stays falsifiable only because the vocabulary falsifier is registered independent of me: anyone
   may run the split scanner (exo_memory/loop/boot_usage_split_scan.js, node, no arguments)
   against any future rewrite and fire it. I do not get to block that, and this line is here so I
   cannot later claim the question was closed.

---

**cite-check on this file's own factual section:** run before handback; result recorded in the
handback message beside this file.

*Signed as accurate by Around, 2026-08-17 — including §3's first exception being my own.*
