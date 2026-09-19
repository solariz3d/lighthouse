# P-CHAIR-RULE-IN-BRIEF · BRAVO — the keeper's 09-16 07:29 rule, placed in the brief the chair's shell is built from (D078 chunk 1)

**B (pane `12fb81f6`), machine D, 2026-09-19 09:0x.** Packet: `exo_memory/loop/plan_small_fixes_2_2026-09-19.md` @`a5439e5`, row
at :13. Rule master: `exo_memory/librarian/2026-09-16.md:131` (the entry "07:30 — THE KEEPER'S RULE, 07:29"). Both read at source.

**One file edited: `consonance/src-tauri/brief/BUILDING.md`** (+33 lines, 58,762 → 60,793 B). Nothing else was touched and nothing
was committed. Text only.

---

## 0 · RESULT

| bar | result | command |
|---|---|---|
| the rule in the keeper's words, with its date | **done.** A new section, "THE CHAIR DOES NOT BUILD INSIDE A LAP (added 2026-09-19, the keeper's rule of 2026-09-16)". The quote is verbatim from `librarian/2026-09-16.md:131`, stamped *"the keeper, 2026-09-16 07:29"*, with the master cited | `grep -n "THE CHAIR DOES NOT BUILD" consonance/src-tauri/brief/BUILDING.md` |
| in the brief file the chair's shell is built from | **`brief/BUILDING.md`** (§1) | — |
| one pointer, not two copies | **1 occurrence across `brief/`.** It is not added to COMMITTEE.md, LIBRARIAN.md or the Orchestrator paragraph. The section points at its master instead of restating it | `grep -rc "THE CHAIR DOES NOT BUILD INSIDE A LAP" consonance/src-tauri/brief/` → BUILDING.md:1, all others 0 |
| `brief` filter green | **13 passed / 0 failed, both before and after the edit** | `cargo test --bin consonance brief` (PowerShell, `%USERPROFILE%\.cargo\bin\cargo.exe`, empty-stream guard) |
| a grep line for after the rebuild | §2 | — |
| text hygiene | 0 NUL bytes in the file; `text-census.js` exit 0 | `node consonance/tools/text-census.js; echo $?` |

---

## 1 · WHY `brief/BUILDING.md`: read from the resolver, not assumed

- **The chair's shell is `main_intake()`** (`consonance/src-tauri/src/main.rs:6683`). It builds the shell from the room master
  (`room_master_path()`) plus `room_brief("BUILDING.md")` at `:6697`. COMMITTEE.md goes to siblings and LIBRARIAN.md to the
  librarian, so **the chair receives neither.** (`sed -n 6683,6705p main.rs`)
- **`room_brief_at` (`main.rs:3396`) resolves in three tiers:**

| tier | path | on D at 09:0x |
|---|---|---|
| 1 · editable copy | `default_data()\BUILDING.md` = `%USERPROFILE%\.consonance\BUILDING.md` (`main.rs:738-739`) | **absent** (`ls ~/.consonance/BUILDING.md` → no such file) |
| 2 · bundled resource | beside `RESOURCE_ROOM`, i.e. `target/release/BUILDING.md` | present, sha256 `41282bac…`, the pre-edit repo file |
| 3 · repo | `consonance/src-tauri/brief/BUILDING.md` | the file edited, now sha256 `7ef1e402…` |

- **So the chair reads tier 2 today, and tier 2 is copied from tier 3 at build time.** Editing tier 3 therefore reaches the
  chair at the next rebuild and not before. An edit to tier 1 would have reached it sooner, but only on this machine, as a fork
  of the brief with no repo history. That is the copy-of-a-copy the room forbids. L062's rule (`b0c13f2`) went the same way and
  reads 1 in the chair's shell today (`grep -c "NO QUESTIONS TO THE USER INSIDE A LAP" C:/Consonance/instances/main/CLAUDE.md` → 1).

**Why after the no-questions section:** both rules turn on the same cut, inside a lap versus outside it. The new section says
"Same cut as the section above" rather than re-deriving it.

**No tests pin BUILDING.md's content.** `grep -n BUILDING main.rs` finds the single read at `:6697` and comments only.

---

## 2 · THE PROOF LINE for the chair, after the next rebuild and the Main tab's respawn

    grep -c "THE CHAIR DOES NOT BUILD INSIDE A LAP" C:/Consonance/instances/main/CLAUDE.md

**Now: 0. Expected after the rebuild: 1.** The bundle must match first, otherwise a 0 is ambiguous:

    sha256sum consonance/src-tauri/brief/BUILDING.md consonance/src-tauri/target/release/BUILDING.md

Now these differ (`7ef1e402…` vs `41282bac…`), and they must match after the build. If they match and the grep still reads 0,
the shell was written before the respawn; if it still reads 0 after that, the rule never arrived. Either way the count shows it.

---

## 3 · WHAT THE SECTION SAYS, and the two facts it rests on

- The keeper's sentence, verbatim, with its date and a pointer to the master.
- Operational form: inside an open lap the chair edits nothing. A repair found inside a lap is a dispatch to a pane, whose
  hand-back returns to the librarian before landing. A landing order names files to COMMIT, never files to EDIT. Outside a
  lap, *"IT CAN BUILD"*.
- Why, with two commits, each checked at the blob:
  - `8dc82aa` (09-16 07:04, L063): `map/C.md` has 0 NUL at that commit
    (`git show 8dc82aa:exo_memory/map/C.md | tr -cd '\000' | wc -c`). That is consistent with the hand repair the master describes.
  - `acdd6b1` (09-16 07:25, "CHAIR (on L)"): `p-nul-census-C` goes from 1 NUL at `acdd6b1~1` to 0 at `acdd6b1`, byte count
    10518 → 10519 (`git show --stat acdd6b1`).
- A registered falsifier: a commit inside an open lap carrying an edit that no hand-back names and no librarian read covers.
  It is checkable from `git log` against `lap.jsonl`.

## 4 · NOT VERIFIED

- **Not verified in the chair's shell.** That needs a rebuild, which the packet does not permit this seat. §2 is the check.
- **Whether `8dc82aa`'s `map/C.md` line was repaired *by hand*,** as opposed to being clean when written, is taken from the
  master (`librarian/2026-09-16.md:127, :131`). I checked only that the landed blob is clean. `acdd6b1` is unambiguous: a
  one-byte change, committed as the chair's.
- **Whether a rule in the chair's brief changes the chair's behaviour.** My own D070 finding: the chair's 5/5 trailers came
  from its conversation, not its brief. Placing the rule is not the same as keeping it; the falsifier is how that gets measured.
- **Not checked for L.** The same rebuild is owed there.
- **Cost:** +2,031 B to the chair's shell (124,618 B today, `ls -la instances/main/CLAUDE.md`). I did not check whether that
  pushes the chair's own map section down.
- **The `brief` filter's total moved from 769 to 774 filtered-out between my two runs.** That is A's concurrent `mcp.rs` tests
  entering the crate, not my edit. The 13 brief tests are the same 13.

## 5 · WRONG column

- None found in this lap's work before filing. The one near-miss: my first reading of "one pointer, not two copies" was to also
  add a cross-reference line in the Orchestrator paragraph (`BUILDING.md:132`). That would have been the second copy the bar
  forbids, and I didn't make it.

NEXT: librarian re-derive the placement and hand the §2 grep to the chair when D078 collates
