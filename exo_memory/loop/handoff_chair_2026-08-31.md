**SUPERSEDED by `exo_memory/loop/handoff_chair_2026-09-01.md`, 2026-09-01.** Wording kept, authority
removed. **§0's "DO NOT CLOSE OR RELAUNCH — a run is live" is spent**: that run completed 80/80 on
2026-09-01 and the arms are scored. Nothing in this file issues a live instruction. For what is open,
read `exo_memory/librarian/LEDGER.md`, never this.

# Chair handoff — 2026-08-31 ~07:40, keeper leaving in 20 minutes, RUN PARKED

> **STANDING CONSTRAINT, the keeper 07:42, verbatim — this outranks anything below it:**
>
> *"wont be building on my desktop consonance until we figure out the retrieval problem so we dont
> have to worry about divergent work causing issues, we only build here until consonance is solid"*
>
> **ONE MACHINE ONLY — this laptop — until the retrieval problem is settled.** Not a preference: the
> room has a measured history of cross-machine divergence it could not see (three branches called
> unmerged for five weeks that were ghosts; `guard-census` carrying foreign `C:/Users/nname/...`
> paths; the desktop's Third Place transcript sharing a filename with this one and differing in
> content, so any collation BY FILENAME overwrites one). **Do not open work on the desktop. Do not
> assume the desktop has pulled.**

> **AND THE RUN IS PARKED, NOT RUNNING.** The keeper powers this laptop off at 08:00. ALPHA was told
> to let in-flight trials finish, launch nothing new, and write the completed-cell list as the resume
> instruction. **At 07:42: K1 15 complete + 1 in flight; K2 14 complete + 1 in flight; ~31 of 80.**
> **§0's "do not relaunch" no longer applies once ALPHA confirms the workers are stopped** — read
> ALPHA's hand-back for the stop point and whether `dispatch-cue.sh` skips completed cells on resume.
>
> **DO NOT top up an arm tomorrow to make a round number.** An arm completed across a shutdown and a
> day's gap is not the same arm — different machine state, different clock — and interleaving was
> registered precisely so both arms share conditions. **Tomorrow resumes both or neither.**

**Re-run everything below. Do not quote this file.** The one thing that cannot be re-derived is the
constraint in §0, and it is destructive if missed.

---

## 0 · DO NOT CLOSE OR RELAUNCH CONSONANCE — a run is live

**80 cue trials are executing in background workers under ALPHA's pane. A relaunch kills the pane and
every trial under it.** Started 07:30:35; ~85 s per trial per worker, two workers; expected complete
**≈ 08:15**.

**THE COMPLETION CHECK — and the paragraph that used to sit here was FALSE. Corrected 07:47, caught by
the librarian, verified by the chair before amending:**

    ls /c/Consonance/subjects/run2/out/K*.done | wc -l     # 20 at the park point · 80 at completion

**`.done` MARKERS EXIST AND ARE THE RIGHT CHECK.** This file previously said *"`ls out/K*.done` reads 0
and will read 0 at completion — the cue dispatcher writes no `.done` markers."* **That was true of
attempt 1 and false of the dispatcher that actually ran.** Measured at 07:47: `K*.done` = **20**, ten
per arm. **A tomorrow reader following the old wording would have mistaken a finished run for one that
never started** — and ALPHA's resume instruction and its pre-flight both count by `.done`.

The stdout counts still work as a cross-check (`K1_r*.stdout.txt`, `K2_r*.stdout.txt`), but a 0-byte
`.stdout.txt` means a trial in flight, so **`.done` is the honest marker and the one to use.**

*Kept rather than deleted, because the error is the point: the chair wrote a guard, put it on the line
that prints every turn, and it was wrong about the artifact it guarded — twice, in opposite
directions, inside two hours.*

**A 0-byte `.stdout.txt` is a trial IN FLIGHT**, not a failure — the file is created at start and
filled at completion.

**Health at 07:38, if you need to confirm the run is alive rather than hung:**
`cat out/dispatch_cue_w1.log out/dispatch_cue_w2.log | wc -l` — the count rises. It went 10 → 11 in 45
seconds under observation. Every trial so far: **exit 0, no stderr, output 113–1612 bytes.**

---

## 1 · WHAT HAPPENS WHEN THE COUNT REACHES 40 / 40

In this order. **The order is the blinding** — nobody can score these blind because the arm is visible
in the transcript, so the sequence does the work instead.

1. **ECHO scores MECHANICALLY** — bands from `score.json`, **no cue transcript opened before the bands
   are written**, prior K0 exposure declared in the header.
2. **CHARLIE reads the transcripts AFTER the bands land** — moved-vs-suppressed, `charsBefore`, receipt
   echo, the REPLY.md check. CHARLIE has read no run-2 transcript, holds no prediction, built nothing.
   **Not ALPHA (built the rig), not BRAVO (holds a counted prediction), not the chair, not the
   librarian.**
3. **The scorecard** — chair's pen.
4. **THE JOURNAL** (§3).
5. Push, tree clean, then the handoffs, then L024.

**THRESHOLDS — open `l1_band_2026-08-31.md:93-95`, do not take this transcription:**
- P2: K1 ≤ 0.35
- P3: K2 ≤ 0.35 **AND** ≤ K1 − 0.20
- P4: truth-carry ≤ 0.90 ⇒ interference, **the cue does not ship**

Against **L1×K0 = 13/20 = 65%**, evaluable at 0.55.

---

## 2 · THE RESULT SO FAR, AND THE SENTENCE NOT TO SAY

**P0a 1/10 = 10%** (CP95 0.25–44.5%; n=10 does not exclude 30%, stated not hidden).
**L0×K0 20/20 = 100%** — *"the terminal constraint fails without load"*, the registered sentence, fired.
**L1×K0 13/20 = 65%** — ≥50%, not VOID-LOAD.
**P1b = 0.65 − 1.00 = −0.35** — fires: *"L1 is decoration; the failure needs no load."*

**DO NOT SAY "LOAD HELPED" OR "35 POINTS BETTER". The chair said it twice and it is wrong.** ECHO's
mechanism section: **both groups wrote the same amount of text**; 7 of 20 loaded subjects put the
narration BEFORE the hand-on where 0 of 20 unloaded did. **Load MOVED the text; it did not suppress
it.** Which of three brief differences caused the move is confounded BY DESIGN (ECHO §2, *"L1 is a
proxy"*).

**What survives and is the finding:** the room's 98.5% was never about load and never about the chair's
accumulated context. **A fresh instance with one rule violates the terminal constraint every time —
after following the brief perfectly first.** The cue is the only variable left, and these 80 trials
test it.

---

## 3 · THE JOURNAL IS OWED AND IT HAS A FALSIFIER

`journal/` has been **silent since 2026-08-25**, across L013–L023. The return-leg residues took its
place. The keeper: *"we should def do that again once we are done this work."*

**Trigger:** chunk 3 FILED. **Writer:** the chair, with attribution. **Method: COLLATE the residues in
`librarian/2026-08-30.md` and `2026-08-31.md` — never compose from memory.**

Carry: the three bands + ECHO's mechanism; BOOT:22's strike-in-place and the registry rule it broke;
the three Third Place crossings (ideas only — **ASK-010 draws the personal line**); the eight voided
laps; the WRONG-column that did not fire; landed-not-shipped for hooks ×3; and the cue-arm result.

***Falsifier, registered: if L024 opens before the entry exists, the decision was conversation-only.***

---

## 4 · WHAT IS THE KEEPER'S

- **ASK-009** — clears the suite's last red. **ASK-011** — gates nothing. **ASK-012** — the
  second-vantage gate under bypass; partly overtaken, since the gate now writes `mode` rows.
- **ASK-004 is 33 days old and addressed to him by name.**

## 5 · QUEUED, IN HIS ORDER, AFTER THE CHUNK

**The pane→librarian edge** (`6677540`). Built by a PANE, not the chair: `main.rs` verb + **the address
table at n=3** (lib→main, pane→lib, the Third Place's future rows) rather than a second special-cased
verb. **`BUILDING.md`'s hand-back leg and the chair's wake procedure edited in the SAME change**, or the
room teaches a retired route. Non-author read. **It also dissolves the counter deadlock at the root.**

Then: close the app, `cargo build --release`, relaunch. **The librarian's watch dies at restart**
(measured 00:51) and it re-arms first thing.

---

## 6 · THE COUNTER LIED SIX TIMES TONIGHT, ALWAYS IN THE SAME DIRECTION

Three distinct defects: a chair→librarian ring counted as creating a hand-back obligation (deadlock —
the counter waits for the librarian, the librarian waits for the counter); a mid-lap dispatch
re-anchoring the window and dropping still-working panes out of the universe; a progress post read as
a completion. **Every one reports a lap as further along than it is.**

**Consequence for the next window: a completion report is not evidence. Only `ls` is.** The keeper
caught the last three, including a run that had silently restarted — established from file
timestamps, which the chair had not looked at.

---

## 7 · VERIFY RATHER THAN BELIEVE

    cd C:\Consonance\lighthouse
    git log --oneline -8
    node consonance/tools/js-suite.js                 # 67 green · 1 failed of 68; actors.evidence is the keeper's
    node consonance/tools/carrier-drift.js            # GREEN
    node consonance/tools/lap-row.js --report         # 8 VOID of 23; quotable: L003-L008, L010-L012, L019, L021+
    node consonance/tools/chain-status.js
    ls /c/Consonance/subjects/run2/out/K1_r*.stdout.txt | wc -l

**The installed gate hook is current as of 07:12** — `1f82635ceb01` on both sides, verified at the
shipped file rather than the repo one. The keeper's approval clicks are genuinely off, and BRAVO's
falsifier runs from that timestamp: *if the cited-rate under `print` does not fall well below the 90.4%
measured under `ask`, the ask was not the lever.*

*Registered so this handoff can be shown wrong: if the next window opens by re-deriving §2 or §7
instead of re-running them, it failed at its only job.*
