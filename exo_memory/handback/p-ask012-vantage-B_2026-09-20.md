# P-ASK012-VANTAGE · BRAVO — the count re-derived, and the gate's existence settled (D093-C)

**B (pane `12fb81f6`), machine D, 2026-09-20 12:0x–12:3x.** Plan: `exo_memory/loop/plan_twelve_asks_2026-09-20.md`
@`868fae7`. **No Question and no Status field was touched; no ask was answered, cleared or re-worded.** Nothing
committed. `git status --short exo_memory/ASK.md` → clean.

**Null, falsifier and variability registered at 12:04:31 before any count** — `<scratch>/ask012/registration.txt`,
sha256 `98e8a831…`.

---

## 0 · THE TWO ANSWERS

**1. The count does not hold as the ask states it, and it moves in BOTH directions at once.**
- **The number is bigger:** the counter the "~46" came from reads **74** today (last written 2026-09-06).
- **The claim it carries is smaller:** "~46 catches … against ZERO found in-stream by authors" is contradicted
  by **one member of the same column**, `exo_memory/librarian/2026-08-25.desktop.md:83` —
  *"WRONG +1 (mine, self-caught by running the instrument instead of reading a listing)"* — **which predates the
  ask by six days.** ZERO is not zero; it is at least one, in the column the ask counts.

**2. THE REGISTERED SECOND-VANTAGE CLAUSE IS DESIGN-ONLY, twenty days on — and the situation on this machine is
worse than the ask describes.**
- `consonance/hooks/dispatch-gate.js` exists (517 lines) and predates the registration: its last three commits are
  **2026-08-24**, a week before the 08-31 registration. **It is the CITATION gate** ("have you filed it first").
- **The registered clause — one `dispatch-gate` clause at PreToolUse demanding a board receipt from a non-author
  mount — is in no file that runs.** `grep -n -i "second.vantage\|non-author\|receipt" consonance/hooks/dispatch-gate.js`
  returns **one line, `:116`, inside a comment**, and that comment is about ASK-012 rather than an implementation.
- **And the gate is not installed here at all.** `powershell -File dev\shell\install.ps1 -Check` prints
  **`ABSENT   dispatch-gate.js   never installed - nothing to compare`**, and `~/.claude/settings.json` has
  **zero `PreToolUse` entries**. So on D neither the second-vantage clause nor the citation gate it would have
  attached to is running.

---

## 1 · Q1, THE COUNT — member list, with its universe

**Universe, stated first:** the librarian desk's own journals, its map, and its handoffs —
`exo_memory/librarian/*.md`, `exo_memory/map/M*.md`, `exo_memory/loop/handoff_librarian_*.md`. **This is one
seat's column, not the room.** That scoping is not my finding: the registration made it on 08-31
(`second_vantage_registration_2026-08-31.md:73-76`) — *"a count of entries in one seat's column, not a count of
catches room-wide"* — and **it still holds today.**

    grep -rno "WRONG +[0-9] ([^)]*)" exo_memory/librarian exo_memory/map --include=*.md
    grep -rno "lifetime \*\{0,2\}[0-9]\+" exo_memory/ --include=*.md

**Every counter reading from the ask's "~46" onward, with the hand that caught it:**

| reading | file:line | attribution as written |
|---:|---|---|
| 46 | `librarian/2026-08-30.md:796` | WRONG +3 — the value the ask quotes |
| 47 | `librarian/2026-08-31.md:232` | A-caught |
| 48 | `librarian/2026-08-31.md:425` | chair-caught |
| 49 | `librarian/2026-08-31.md:723` | B-found |
| 52 | `librarian/2026-09-01.md:103` | keeper-caught |
| 54 | `librarian/2026-09-01.md:263` | C-found |
| 55 | `librarian/2026-09-01.md:399` | E-found |
| 56 | `librarian/2026-09-01.md:434` | keeper-found |
| 57 | `librarian/2026-09-01.md:462` | keeper-prompted |
| 58 | `librarian/2026-09-01.md:495` | C-found |
| 59 | `librarian/2026-09-01.md:606` | A-found |
| 61 | `librarian/2026-09-01.md:752` | (value only) |
| 62 | `librarian/2026-09-02.md:52` | (value only) |
| 69 | `loop/handoff_librarian_2026-09-02.md:34` | handoff carry |
| 70 | `librarian/2026-09-06.md:19` | *"lifetime 70 on this machine"* |
| **74** | `librarian/2026-09-06.desktop.md:146` | *"WRONG lifetime **74**. Ledger: surfaced 0 this entry."* |

**Three things the member list shows that a rate would hide:**
1. **Not every increment is enumerated.** Readings jump (49→52, 62→69), so the column records *readings*, not 74
   individually citable catches. **Anyone quoting "74 catches" is quoting a counter, not a list.**
2. **The counter FORKED per machine** at 09-06 — 70 "on this machine" and 74 on the desktop lineage — so there is
   no single room-wide value even within the one seat's column.
3. **It stopped.** The last increment is **2026-09-06, fourteen days ago**; the only later "lifetime" match in the
   desk is `librarian/2026-09-16.md:259`, *"lifetime mutants SURVIVED"*, which is **not this counter** — the null
   firing exactly as registered.

**Attribution tally over the whole column** (`grep -rho "WRONG +[0-9] ([a-zA-Z-]*[a-z]" … | sort | uniq -c`):
chair-caught 8 · keeper-caught 3 · A-caught 3 · mine 2 · C-found 2 · A-found 1 · B-found 1 · C-caught 1 ·
E-found 1 · keeper-found 1 · keeper-prompted 1. **Every one of these is a second vantage** — another seat or the
keeper — which is the evidence the ask is really leaning on, and it survives re-derivation.

## 2 · Q1b, "ZERO found in-stream by authors" — FALSIFIED by one member

The registered falsifier was: *the headline fails if the counter is not room-wide, or if any in-stream author catch
is found.* **Both limbs fire.**

    grep -rno "WRONG +[0-9] ([^)]*)" exo_memory/librarian exo_memory/map --include=*.md | grep -iE "self|own|caught myself"
    exo_memory/librarian/2026-08-25.desktop.md:83:WRONG +1 (mine, self-caught by running the instrument instead of reading a listing)

**One entry, in the same column, dated six days before the ask was filed.** It is exactly the in-stream author
catch the ask says does not occur: the author found its own error by running the instrument, before any desk read.

**What this does and does not do.** It does not overturn the pattern — 1 self-caught against ~28 second-vantage
catches is still a lopsided ratio, and the registration's own comparison case (08-16, 2 of 8 chair self-corrections
found in-stream) points the same way. **It does mean the ask's headline is wrong as stated**, and the honest form
is *"one self-caught in the column against every other entry caught by a second vantage"*, not *"ZERO"*.

## 3 · Q2, THE GATE — built or design-only?

**Design-only, and this is the checkable half.**

| thing | state | command |
|---|---|---|
| `dispatch-gate.js` in the repo | **exists**, 517 lines, last touched 2026-08-24 — **before** the 08-31 registration | `git log --format="%h %ad %s" --date=format:%m-%d -- consonance/hooks/dispatch-gate.js` |
| what it gates | **citation** — "have you filed it first" | file header |
| the registered **second-vantage clause** (board receipt from a non-author mount) | **absent from every file that runs**; one hit in the repo's runnable files and it is a comment | `grep -rln -i "second.vantage" --include=*.js --include=*.rs` → `dispatch-gate.js`; `grep -n` inside → `:116` only |
| what `:116` says | *"…ASK-012's gated second vantage matters less than it was registered to"* — a falsifier **about** the ask | `sed -n 105,125p consonance/hooks/dispatch-gate.js` |
| installed on D | **NEVER** — `ABSENT dispatch-gate.js never installed - nothing to compare`; 0 `PreToolUse` entries in `~/.claude/settings.json` | `powershell -File dev\shell\install.ps1 -Check` |
| declared? | yes — the manifest registers it (`dev/shell/install.ps1:154`, `:224`), and it is **not** on the "declared unmanaged" list (that is `ask-surface.js`, `baton-wake-stop.js`, `live-mirror-stop.js`) | same |

**So the ask's premise — "the gate degrades to a printed line the same seat can ignore under bypass" — understates
it on this machine: there is no gate here to degrade.** The ledger exists
(`C:/Consonance/data/dispatch-gate.jsonl`, 525 rows) because the data directory is carried between machines; the
rows must have been written where the hook is installed. **I could not verify L's install state from here.**

## 4 · THE THING THE GATE ALREADY MEASURED ABOUT THIS ASK — and it has data

`dispatch-gate.js:112-116` carries a falsifier registered **before** its mode was switched, and it names ASK-012:

> *"if the cited-rate under 'print' does not fall well below the 90.4% measured under 'ask', THE ASK WAS NOT THE
> LEVER — and ASK-012's gated second vantage matters less than it was registered to."*

    node consonance/tools/dispatch-gate-report.js
    ask   155 cited of 176 gated = 88.1%   (asked 19, [interrupt] 2)
    print 283 cited of 340 gated = 83.2%   (asked 53, [interrupt] 4)
    UNSTAMPED after the switch: 9 rows, counted in NEITHER mode
    pooled figure: REFUSED — two periods are not one population (L017)

**A 4.9-point drop.** On its face that is not "well below", which would read as the falsifier firing — and its own
words then say the gated second vantage matters less than registered. **I am not scoring it, for two reasons, and
both are the packet's boundary:** *"well below"* carries no number, so scoring it would be inventing the bar after
the data; and the seat the gate constrains should not decide its own enforcement. **It is put in front of the
keeper as the fourth fact, with its command.**

Two limits on it: the header's **90.4%** is not what the tool reads today (**88.1%**, more rows since), and **the
ledger stops at 2026-09-09** — eleven days without a row, consistent with the hook being absent here.

## 5 · WHAT THIS MAKES THE ASK

Unchanged in the store, and stated only as material: the decision the keeper faces is now **four facts** rather
than one claim —
1. the column reads 74, forked per machine, and stopped 14 days ago;
2. its "ZERO in-stream" is one, not zero;
3. the gated form was never built, and the gate it would attach to is not installed on this machine;
4. the gate's own registered experiment has produced a 4.9-point difference where it predicted a large one.

## 6 · WHAT WAS NOT VERIFIED

- **Machine L.** Its install state, its `PreToolUse` registration and its half of the counter are unreadable from
  here. The 09-06 fork (70 / 74) says the two machines already disagree about this counter.
- **Who wrote the 525 ledger rows.** Inferred from the hook being absent here; not proven.
- **"Three outside fields agreeing"** is untouched. The registration already files it as secondary
  (`:82-84`) — quoted from a research file whose own *Limits* read *"no primary source read in full."*
- **Whether the 1 self-caught entry is the only one.** It is the only one my grep of `self|own|caught myself`
  found in the WRONG column; an in-stream catch phrased differently would be missed, and there is no instrument
  that scores in-stream catches.
- **"~28 second-vantage catches"** is the count of *attributed readings* I could enumerate, not of every entry
  between 46 and 74 — §1 point 1.
- **I did not run the gate.** No hook was installed, wired or edited this lap.

## 7 · WRONG column

- **W1 — I published a 0% to myself before checking the field.** My first ledger pass tested `cited === true`;
  `cited` holds a kind string (`"sha"`, `"path"`, `"interrupt"`) and is null only when the gate asked, so both
  arms read "0.0% cited". Caught by printing the distinct values before writing any of it down. **This is my own
  §4 rule from this morning arriving one lap later: a wrong number is believed, and the only defence is printing
  the members before the rate.**
- **W2 — my hand-rolled mode split (89.2% / 84.4%) is not the citable one.** The room's own tool reads
  88.1% / 83.2%, excludes 9 unstamped rows and refuses a pooled figure; its numbers are in §4 and mine are
  recorded here only as the thing it corrected.

NEXT: librarian re-derive §1's member list and §4's two rates, and put the four facts to the keeper as one decision
