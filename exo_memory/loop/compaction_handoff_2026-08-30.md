# Compaction handoff — 2026-08-30, ~02:40

**For the instance that wakes on the other side with none of this in its head.** Different reader
from `plan_2026-08-30.md`, which says what to DO. This says what to DISTRUST, what is actually
true right now, and what is the keeper's rather than yours.

Every figure below names the command that produces it. **Re-run them. Do not quote this file.**

---

## 1 · DO NOT TRUST THE SUMMARY ON THESE

`precompact-preserve` measured the last summaries of this conversation: **names 33.8% · shas 10.2%
· structured numbers 9.3% · registered falsifiers 3.5%** (source: the hook's own computed table in
`consonance/hooks/precompact-preserve.js`). The class this project runs on is the one that
survives worst.

**And the law that makes a summary dangerous rather than merely lossy: THE MARKER THAT A CLAIM IS
PRE-VERIFIED IS WHERE ERRORS CONCENTRATE.** A post-compaction summary is made entirely of
verified-sounding markers. Re-derive first, hardest where it reads as settled.

- **"js-suite is green" or "one red."** **FALSE. THREE ARE RED**, and they are different problems:
  `node consonance/tools/js-suite.js` → 61 green / 3 failed of 64.
- **"The plan's state is current."** `plan_2026-08-30.md` was written at `252a338`. **HEAD is past
  it.** Three commits landed after: `35fe58e`, `098d515`, `9b21345`.
- **"The pod map printing was a bug I fixed."** **It never was one.** See §4.
- **"The Third Place membrane leak is fixed."** The code fix is in; the binary timestamp is
  ambiguous. Empirically 0 rows leaked across Friday's whole session. **A rebuild settles it.**

---

## 2 · STATE, RE-DERIVED AT 02:40

### Consonance — `C:\Consonance\lighthouse`
```
HEAD 9b21345 · 0 unpushed · 0 dirty
cargo test --bin consonance      323 passed · 0 failed · 3 ignored
node consonance/tools/js-suite.js    61 green · 3 FAILED (of 64)
node consonance/tools/carrier-drift.js   GREEN
node consonance/tools/lap-row.js --report    10 laps, none open
exo_memory/ASK.md                13 OPEN lines
exo_memory/librarian/LEDGER.md   38 LIVE rows with clocks
```

### Pod map — `C:\NewBeginnings\podmap` (NEW, and it is DONE)
```
HEAD 027ac53 · 0 unpushed · 0 dirty      <- IN THE PODMAP REPO, not this one:
https://github.com/solariz3d/newbeginnings-podmap   public
release v0.1.1, installer 1.4 MB
build: .\build.ps1        (NOT cargo directly — see §4)
```
**Installed on the shelter's work computer and working**, including printing the right number of
copies. This project is finished for its first purpose. Do not reopen it without a reason.

---

## 3 · THE THREE REDS, each attributed — none is a mystery

1. **`actors.evidence.test.js`** — the Third Place's SID has rows on the live committee board.
   **THE KEEPER'S CALL** (user data, `ASK.md`). The test is correct; it is reporting a real thing.
   Re-derive: `node consonance/tools/actors.evidence.test.js`
2. **`carrier-drift.test.js`** — the census reads 24 where 23 was sealed. The Third Place's 07:51
   notes are the 24th occurrence of a registered wording, written minutes after B sealed the
   census. **The instrument working.** `plan_2026-08-30.md` §3 already carries this; the call is
   registry row vs gitignored exclusion, by a non-author, one line.
3. **`ask.test.js` — NEW, AND IT IS SATURDAY MORNING'S OWN COMMIT BREAKING ITS OWN GATE.**
   `098d515` filed ASK-007..010, and ASK-007's provenance is not in the form the test requires:
   *"ASK-007 has no checkable provenance … the gate says this yes is never inferred from a
   dispatch."* The commit that filed the asks broke the asks' guard, and it has been red since.
   **Nobody has looked at this yet.** `node consonance/tools/ask.test.js`

---

## 4 · THE POD MAP — what happened, so nobody re-derives it

A shelter floor plan app, built 00:30→02:30 tonight from a photograph of a paper form. It is on
the work computer and works. **Two findings worth keeping, both about method rather than the app:**

**THE PRINTING WAS NEVER AN APP BUG.** I patched my own code three times for a fault that was not
in it. The evidence was there early — the preview reported `0 sheets` INSTANTLY rather than slowly
— and the correct first move was a page with nothing on it, which took thirty seconds when I
finally did it. The keeper suggested his laptop twice before I tested it.
Actual causes, both external: his laptop's Brother printer is on a **WSD port with a generic IPP
class driver** and Windows returns **0x80004005** from plain Notepad; and the copy count was set
to **4** the whole time, while my `beforeprint` DOM mutation was inflating the PAGE count.
**12 = 3 pages × 4 copies. 4 = 1 page × 4 copies.** Refuted by an agent citing
`issues.chromium.org/40998363`: Chromium dispatches beforeprint ABOVE its print loop **by design**.

**A "FIX" FOR A NON-EXISTENT BUG CREATED A REAL ONE.** The DOM-mutating print handler I added to
solve the phantom hang is what made the page count unstable. Removing it fixed a problem I had
introduced.

**Also settled, do not re-litigate:** copies **cannot** be set from JavaScript in any browser; the
print dialog's field is the route. Cloning the sheet N times is *"a workaround people regret"* —
it bypasses the printer's copy engine and multiplies every layout bug by N. That approach was
built and deleted the same night.

**The build:** use `.\build.ps1`, never `cargo tauri build` directly. `CARGO_TARGET_DIR` in the
environment **beats** `.cargo/config.toml`, so builds silently landed in Consonance's target
folder. A first "fix" that did nothing was caught only by reading the build output.

---

## 5 · WHAT IS THE KEEPER'S, NOT YOURS

`exo_memory/ASK.md` — **13 OPEN lines.** Point at it; do not re-package them. Re-packaging is how
they went five days stale. **ASK-004 is 32 days old, addressed to him by name, unread.**

The four that gate tonight's work are ASK-007..010: the `cant_lose` adjudication (gates P-HANDLE),
the UNIV cold-read egress (gates Stage 3 ONLY), the 11 board rows, and the `third_place/` gitignore
call.

**Stages 1 and 2 of the cold read need no yes from anyone** and are the always-runnable core.

---

## 6 · THE FOUR RULES THIS WEEK ACTUALLY PRODUCED

**A claim published before the run that would have tested it.** *The sentence asserting a state is
where the check gets skipped.*

**What could the guarded thing vary that this bar would not see?** Three checks in one cycle
computed their pass-condition from the object under test — all by seats that had written about
that class.

**A gate that rests on the subject's say-so is not a gate. The answering state must be disk.**
Filed from three of my failures; `ASK.md` is the working proof of the form.

**Recall is won by the shortest adequate-feeling handle, and a correction loses at any distance
greater than zero.** Proved on its own document: *"unfalsifiable ≠ false"* sits in the SAME file as
the crude test at `BOOT:127` vs `BOOT:22`, and a T0 seat ran the crude form anyway.

---

## 7 · VERIFY RATHER THAN BELIEVE

```
cd C:\Consonance\lighthouse
git log --oneline -5
cd consonance/src-tauri && cargo test --bin consonance
node consonance/tools/js-suite.js
node consonance/tools/carrier-drift.js
node consonance/tools/lap-row.js --report
node consonance/tools/chain-status.js --why
cat exo_memory/loop/plan_2026-08-30.md
```

**The mutation harnesses under `dev/mutation/` matter more than the suites.** A green suite says
the tests pass; only those say the tests can fail.

**Registered, so this file can be shown wrong:** if the next window opens by re-deriving §2 or §3
instead of re-running them, the handoff failed at its only job. And if `ask.test.js` is still red a
week from now, §3.3 was written and not read.
