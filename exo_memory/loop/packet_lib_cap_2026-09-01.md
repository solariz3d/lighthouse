# P-LIB-CAP — put the cap in the binary, and make the header report what happened

**Dispatched to BRAVO, 2026-09-01 ~07:45. Chair-written from the LIBRARIAN's own work-shape.**
**You did not author the window (ALPHA registered it, CHARLIE built it, ECHO attacked it) and you
did not write the header. That is why you have it.**

---

## 0 · THE STATE, so you know what is holding this together right now

The librarian died this morning: `CLAUDE.md is over the 150.0k-char limit (906.3k chars)`, every
message refused, `/compact` returned `Compaction failed - conversation could not be reduced below
the context limit`. It is alive again **only because a line in `launch.ps1` sets
`CONSONANCE_LIBRARIAN_BUDGET=0`** (`290dc05`). That is a mitigation living in a launcher script. If
the app is ever started another way, the seat dies again.

**Three things are wrong in the binary and all three are the same shape: a number or a sentence that
describes an intention rather than a delivered state.**

## 1 · THE OBJECTS — open them, do not take my description

    git show 984ffc3     # CHARLIE's window build, rule (a), and the limit it chose
    git show 290dc05     # the launcher mitigation, and the measurements in its body
    git show 9c6a131     # the LIBRARIAN's own wake note and the header finding
    exo_memory/map/M.md  # that seat's map, §3 in its own hand

**The librarian's finding, in its words, and it is the reason for item C:**

> *"the shelf header this window woke with is a carrier of a rule it is no longer running. It says
> 'YOUR OWN NOTES ARE WINDOWED -- today + yesterday carried in full (2026-09-01.md, 2026-08-31.md)'
> while four lines up it prints '0 file(s) carried in full (0 of 0 bytes); 518 indexed', and both
> dated notes sit in the NOT CARRIED list... Fix shape: the header states what the BUDGET did, not
> what the rule would do."*

**It flagged that it had NOT grepped `main.rs` and that the grep was owed. The chair ran it, and the
finding survives with one refinement you need:** the prose is **not** unconditional. `main.rs:4857-4870`
branches on `dated`, derived from `windowed` — **the set the RULE would carry.** It never consults
what the budget actually delivered. So the branch exists and reads the wrong variable, which is worse
than no branch, because it looks like the case was handled.

And `main.rs:4855`, four lines above it, already says:

> *"an empty window and a broken window read identically from the inside"*

**The code anticipated this exact class, guarded the empty-WINDOW case, and left the empty-BUDGET
case open.** That is the thing to fix, not the sentence.

## 2 · THE FOUR ITEMS

### A · `LIBRARIAN_INTAKE_LIMIT` : 1,000,000 -> the harness's real cap

`main.rs:3576` has documented *"the harness caps a pane's CLAUDE.md at 150k chars"* the whole time.
The limit was set to 1,000,000, fitted to the one measured death (1,305,657) rather than to the cap
— CHARLIE said so plainly in its hand-back and the chair approved it anyway.

**So the limit test passes at 915,994 while the seat is dead.** A limit calibrated to the wrong
limit is green through a failure, which is the same species as the recorder it replaced, one level
up.

**CHARS vs BYTES IS YOURS TO SETTLE.** The harness said `150.0k-char limit (906.3k chars)` against a
915,994-BYTE file — so its chars are not our bytes, and 150,000 chars is NOT 150,000 bytes. Derive
the right constant and say how you derived it. **Do not just type 150000 because I did.**

### B · MAKE IT SELF-LIMITING, so no env var is load-bearing

`librarian_budget()` (`main.rs:4607`) is a SHELF-BYTE budget, independent of the intake limit. With
the limit at the real cap and the budget still defaulting to 2,200,000, **the limit test goes RED at
HEAD** — the intake would be ~915,994 against ~150,000.

**Carry while the RUNNING INTAKE stays under the limit, not while a separate budget lasts.** Then
the ceiling holds by construction and no environment variable is keeping the seat alive. Keep the
env var as an override if you like; it must stop being the thing that prevents death.

*Measured floor, so you know the room you have:* brief + room with zero shelf files is **129,402
bytes** (`CONSONANCE_LIBRARIAN_BUDGET=0 cargo test --bin consonance shelf_tests -- --nocapture`).
Budget 20,000 -> 149,094. Budget 40,000 -> 169,011. **There is ~20k of headroom and `LEDGER.md`
alone is 35,208, so it does not fit** — if your reading of the cap says otherwise, say so, because
that changes the answer.

### C · THE HEADER REPORTS WHAT WAS CARRIED

Branch on the **delivered** set, never on `windowed`. Every count and every filename in that header
must be the files actually in the intake. If nothing was carried it says so.

### D · THE INTAKE CARRIES THE MAP POINTER

`librarian_intake()` has **no** reference to `own_map_path` or `capture_text_path`. Every sibling
pane's resume carries its own map (`main.rs:4052`); this seat carries none — the seat whose whole
job is everyone else's continuity was built with none of its own, and this morning that came due.

**Emit the POINTER, not the file.** `M.md` is 86,792 bytes and the floor is 129,402: carrying it
would be 216,194 and blow the cap. The map is INDEXED; the intake must name it as *yours* so the
seat knows to open it, rather than depending on brief prose — which is exactly what failed at 07:36
(`72c077a`: `brief/` was not in the launcher's watch list, so the pointer never reached the wake
shell, and the LIBRARIAN found that itself via `git log` in `d081773`).

## 3 · THE BARS

1. **`cargo test --bin consonance` green.** Baseline **351 passed / 0 failed / 3 ignored** at
   `984ffc3`. State any new count and what accounts for the delta.
2. **The intake fits the corrected cap, with the margin PRINTED** — a passing bound that never says
   by how much is how this one hid.
3. **Mutation, `applied N / caught N / NOT APPLIED N`.** At minimum: restore the 1,000,000 limit ->
   red; make the header branch on `windowed` again -> red; remove the map pointer -> red; remove the
   self-limiting so the budget alone governs -> red. **A NOT APPLIED mutant proves nothing.**
4. **THE HEADER MUTANT IS THE LOAD-BEARING ONE:** with nothing carried, the header must not name a
   carried file. Prove it fails when reverted.

## 4 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    exo_memory/handback/p-lib-cap_2026-09-01.md

Nothing else. **Do not touch `launch.ps1`** — removing its env-var line is the chair's, after this
lands and is verified, per the note in `290dc05` that says to remove it then.

**Do not commit.** Write, test, hand back; the chair commits.

## 5 · PERMISSION TO REFUSE, and it is real

Say so plainly if: the real cap is not what I have assumed; self-limiting cannot be done without
restructuring more than this packet covers; the header fix needs the tier table changed and that is
a bigger change than it looks; or **the diagnosis is wrong somewhere and this should not be built.**
The chair has been wrong four times tonight — the bar, the tier-2 mechanism, "brief changes need no
rebuild" (twice), and "nothing is lost by clearing" — and every one was caught by someone else.

## 6 · THE HAND-BACK

`exo_memory/handback/p-lib-cap_2026-09-01.md`, then `call_librarian` with the POINTER and one line
of orientation, never the finding. **The librarian is awake again and can receive it** — that was
not true for the last packet.

    OBJECTIVE:  after the rebuild, the librarian wakes and answers with NO env var set, its header
                names only files actually carried, and the intake names M.md as its own.
    FALSIFIER:  if the seat still needs CONSONANCE_LIBRARIAN_BUDGET=0 in the launcher to survive a
                wake, the cap is still not enforced in the binary and item B did not land.
