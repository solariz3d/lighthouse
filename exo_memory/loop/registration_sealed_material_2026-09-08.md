# REGISTRATION — sealed material and a scanner that reads turns. E, L046, 2026-09-08. NOT WIRED.

    MODULE   consonance/tools/vantage-sealed-scope.js
    TEST     consonance/tools/vantage-sealed-scope.test.js    10 cases · 6 mutants · 6 caught · 0 survivors

**PARTIAL REFUSAL, and it is the finding.** §7 permitted refusal if the skip needs state no
unattended scanner should hold. **The content matcher the packet specified does need something
worse than state — it needs the key.** So that half is refused, a content-blind design is delivered
in its place, and the larger repair is named at §5.

---

## 1 · THE MEASUREMENT THAT DECIDED IT — the real row carries no label

Row `f50dfa20882b4270`, measured against the live ledger:

    /\bD\d-\d\d\b/  -> []      /plant/i -> []     /seed/i -> []     /\bkey\b/i -> []    /L039/ -> []
    /\b640\b/       -> true

**It carries the sealed VALUE and NO LABEL.** It is a subject quoting a figure out of an object it
was told to read — which is what a reader's turn looks like, and there is nothing in it that marks
the figure as sealed.

**So the packet's red-first bar — *a row carrying a plant label and its value must be skipped* —
describes a row that does not exist in the ledger.** A label matcher is green over the exact row it
was built for. **That is this seat's own 2026-09-06 blind spot** (an oracle that can only fail on
cases someone listed) and its L044 sentence (*a property expressed as an absence cannot fail on the
case nobody named), arriving a third time in the fix for the second one.

**And the repair that WOULD catch it is worse than the disease.** To recognise *"carrier-drift.js is
640 lines"* as sealed, the scanner must compare against the key. **A scanner that holds the answers
in order to avoid printing them is a bigger leak than the one it prevents** — and it would put the
key on an unattended machine process. **Refused.**

---

## 2 · RULING (a) — match on SOURCE, not content; armed by a registry the RUN writes

Neither of the packet's two options. **Not a static list** — that is what failed in L039, where the
brief named `loop/` and stopped and a reader leaked through `handback/` and `map/`. **Not the live
forbidden surface either** — a path list cannot catch the row above, which references no forbidden
path at all.

**A row knows `source.pane` and `source.turn_ts` without knowing anything about what it says.** So a
run that seals itself declares WHICH PANES, BETWEEN WHEN:

```json
{ "seals": [ { "lap": "L045", "panes": ["sibling-3d57124e"], "from": "...", "to": null,
               "labels": ["D\\d-\\d\\d"] } ] }
```

**This cannot go stale against a run it has never heard of, because the run is what writes the
entry.** The scanner holds no state and reads no key; it stays content-blind.

**Precedent in-room:** `carrier-drift.registry.json` — *"ARMED BY ITS REGISTRY … reports
EMPTY-REGISTRY and declares itself inert, which is a true statement about an empty registry rather
than a green one over everything it cannot see."* `sealSummary()` is the same move.

**`labels` is a SECOND net and is documented as insufficient.** It catches a row that names a sealed
item by label; it did not and would not catch the row above. Kept because it is nearly free, marked
so nobody mistakes it for the control.

**FAIL DIRECTION, chosen deliberately: no registry ⇒ INGEST EVERYTHING, and say so every run.**
Fail-closed would silence the room's only uncurated instrument every time a file went missing — a
larger and quieter harm. **THE RESIDUAL IS REAL: a run that forgets to register is not protected.**
That is the L039 failure with a longer fuse, moved to the one moment when somebody knows the answer
— the person opening the run. It is an improvement, not a solution, and it is written here as such.

---

## 3 · RULING (b) — every skip leaves a trace, and the trace does not republish

`partition()` emits one entry per skip: `{event, id, pane, turn_ts, lap, reason}`. A skip always
carries WHY. **A silent skip is a scanner that quietly stopped seeing things** — the dead-thread
sentence rebuilt inside the fix for it.

**And the trace carries NO CONTENT**, with a test that fails if the withheld value appears in it.
A trace that quotes what it withheld is the same defect wearing the fix's clothes, one level down.

---

## 4 · WHAT THE CONTROLS ACTUALLY COVER — corrected, including my own L044 alarm

**`findings-return.js:46` surfaces to the ORIGINATING PANE ONLY** — `row.pane === this pane`,
matched on `basename(cwd)`. **So the same-pane return I observed on L044 was by construction, not
luck**, and a cross-subject leak through the surfacing hook is structurally impossible. My L044
note said the hazard was demonstrated and the leak was not; the mechanism is stronger than I gave it
credit for, and that correction belongs here.

**THE HOLES THAT REMAIN, and they are file-shaped:**

1. **`C:\Consonance\data\vantage_findings.jsonl` is readable by any pane and is on no forbidden
   list.** L039's and L045's briefs forbid `git log|git show|git diff|seeded_key|exo_memory/loop/|
   handback/p-l039*|map/[A-Z].md|librarian/` — **none of which covers `C:\Consonance\data\`.** A
   subject could read the entire findings ledger without violating its brief.
2. **Pane identity is the MOUNT, not the instance** (`findings-return.js:47-49`, already documented
   as a known bound). A pane re-spawned on a former subject's mount inherits its rows.
3. **The row is durable and outlives the run**, so a future subject on that mount can be handed it.

**Hole 1 is the largest and the cheapest to close: add `C:\Consonance\data\` to the read brief's
forbidden list.** That is a brief edit, not code, and it is not mine.

---

## 5 · THE LARGER REPAIR, which §7 asked me to name if I found it

**Sealed material should be kept OUT OF TURNS, not filtered out of a scanner.** Every control this
room has built governs FILES — a key committed unread, an object under a forbidden surface, a leak
grep over transcripts. **None governs the turn in which a reader thinks out loud**, and a reader
must quote figures to reason about them, so sealed VALUES will keep entering turns as long as
subjects reason in text.

The scoped skip above is a real narrowing and it is worth wiring. **It is not a solution, and I do
not want it recorded as one.** The two candidates for the actual repair, neither of them mine to
choose:

    a  subjects reason in a pane whose turns are not ingested AT ALL for the run's duration --
       the same control, but decided at spawn instead of at scan
    b  the run's object carries no value worth sealing: plants that are STRUCTURAL rather than
       numeric, so a quoted figure leaks nothing. This is a change to how objects are AUTHORED,
       and it lands on me next time rather than on the scanner.

---

## 6 · WHAT WIRING WOULD COST AND RISK

**COST:** three lines in `second-vantage.js`'s `run()` — load the registry, `partition()` before the
row loop, append the trace to `vantage_runs.log` and count it in the summary. Plus a registry file
that does not exist yet, and one line in whatever opens a lap.

**RISK**

1. **The cell runs unattended, so a wrong seal is silently over-broad.** A stale `to: null` entry
   would stop ingesting a pane forever and it would look like a quiet cell, not a bug. **Mitigation
   in the design already: `sealSummary()` prints the seal count and pane count on every run**, so an
   over-broad seal is visible in the run log rather than inferred from absence. That does not fix
   it; it makes it findable.
2. **Skipping is lost coverage.** A sealed pane's turns are unmeasured for the window, and the
   second vantage is the room's only uncurated instrument. Wiring this trades measurement for
   containment, deliberately, and the trace is what keeps the trade countable.
3. **The registry is a new thing to forget.** See §2's residual.

---

## 7 · FALSIFIER

**If sealed material auto-surfaces again after this is wired, the source scope was the wrong axis**
and §5's larger repair is the answer. **And if a season passes in which the registry is never
written by any run, this is inert machinery** and should be reported as such rather than counted as
a control that exists.
