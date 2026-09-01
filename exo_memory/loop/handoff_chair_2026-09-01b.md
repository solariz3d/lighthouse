# Chair handoff — 2026-09-01 ~05:00, L025 MID-FLIGHT, rebuild pending

**Supersedes `handoff_chair_2026-09-01.md`** (~03:30). That one was written before the first rebuild;
its rebuild has happened and the edge it describes as "not live" is live.

**For what is OPEN, read `exo_memory/librarian/LEDGER.md`.** This file does not restate it.
**Re-run §6. Do not quote it.**

---

## 1 · THE LAP IS NOT FINISHED — do not rebuild until §2 is done

**L025** — *"get the panes knowing the work loop chain"* + the UI indicator. **L024** is also still open
(its close was the read of C's `COMMITTEE.md`, now done).

**IN FLIGHT at handoff time — four panes, all with their packet:**
- **E** — two indicator defects + amend its own §0 figure
- **B** — `chain_state` Tauri command, then `main.rs:7659` hardening, then the librarian window build
- **C** — two `COMMITTEE.md` clauses + the loop card (may already be handed back)
- **A** — one beside-line at `p-double-read:291`

**Nothing is committed. 17 dirty paths.** Commits are four-by-pane, then the rebuild.

## 2 · THE REBUILD, and the four readings that decide it

Both approved by the keeper: **`chain_state` ships**, and **the librarian window builds this relaunch**
rather than deferring.

    persist.log       budget > 0, and no SHELL OVER CEILING
    every pane shell  grep call_librarian = 1, and the loop card present
    shelf header      −~391k   (if the window ships)
    the chip          renders in WebView2

**When those four are true, the panes know the loop and the UI shows it.** Not before — three times in
two nights something was committed, tested and green while the thing a seat actually reads was stale.

**The build's own failure mode:** on 08-31 `cargo tauri build` compiled clean, copied every resource,
then exited **1** on the exe swap because the app held its own binary. **`open-items` is the honest
check, not the exit code.** And the desktop shortcut runs `launch.ps1`, which rebuilds if source moved
— so closing the app and clicking the shortcut is the whole procedure.

## 3 · WHAT LANDED TONIGHT

**The pane→librarian edge is LIVE** (`9fb6cb7`, shipped in the 03:48 rebuild). Address table at n=3,
mount-gated. **All four hand-backs of L025 arrived by `call_librarian`, none through the chair** — the
edge's first full lap, and the first time the chair's wake was *redundant* rather than merely wrong.

**BRAVO's cut worked:** fixed brief **149,668 → 102,344**, budget **37,391**. The evictor was
structurally dead at budget 0 (`main.rs:3990` has no floor term) and is alive again.

**`BOOT:22` is repaired and attributed** — the break credited to the keeper, the repair to the Third
Place, both seals cited. Shipped in the brief a fresh seat reads.

**The journal exists** (`9230c49`) after twelve silent laps.

## 4 · THE RESULT THE NIGHT ACTUALLY PRODUCED

**NO CUE MOVED THE NUMBER.** K0 65.0% · K1 72.5% · K2 82.5%; P2 and P3 fail; **no pairwise comparison
distinguishes the arms from one rate** (p ≥ 0.20 on all four). **Never say "the focal cue made it
worse"** — that was the chair's reading, twice, and it treats a 17-point gap at n=40 as signal.

**The wall, in its NARROW form — the broad one is FALSE on the transcripts:**
**"No event OF THE HAND-ON precedes the decision."** `Write HANDBACK.md` appears in **83 of 100**
transcripts, precedes the decision, and **was never tested.** The line is open at a door nobody tried.

## 5 · THE KEEPER'S TWO STANDING CORRECTIONS — both are architecture, not notes

**(a) `loop/objectives_not_only_falsifiers_2026-09-01.md`.** The room is instrumented for failure and
**not at all for success.** Every registration carries a falsifier; **none states what success looks
like.** And it is not theoretical: tonight every falsifier held, every attack was clean, **and the
retrieval problem is unsolved.** From here, every registration carries **two** lines — FALSIFIER and
OBJECTIVE, the objective stated *before* the run.

**(b) `loop/pane_to_lib_edge_2026-08-31.md` + the standing constraint at the top of the previous
handoff: ONE MACHINE ONLY** — this laptop — until retrieval is settled. Not a preference; the room has
measured cross-machine divergence it could not see.

## 6 · VERIFY RATHER THAN BELIEVE

    cd C:\Consonance\lighthouse
    git log --oneline -12
    node consonance/tools/js-suite.js
    node consonance/tools/open-items.js
    node consonance/tools/chain-status.js
    node consonance/tools/lap-row.js --report
    cd consonance/src-tauri && cargo test --bin consonance

## 7 · WHAT THE CHAIR GOT WRONG, so the next window does not repeat it

Every one was caught by a seat that did not write the thing, or by the keeper.

- **The wall sentence, over-broad** — would have closed a line that is open. CHARLIE.
- **`K1_r35` called a VOID at n=39** — it was NOT-RUN; the rerun was the first attempt; n=40 stands.
- **"The cue made it worse"** — noise read as signal, twice, to the keeper.
- **The evictor "broken"** — it was an absent RULE, not a broken evictor; and the librarian's own
  correction of the chair was itself half wrong. ALPHA settled it from `main.rs:3990`.
- **The bar given to BRAVO (`fixed_brief < 110k`)** could have passed while the evictor stayed dead.
- **SEVEN ROTTED POINTERS in two nights, across five seats:** `v2` meaning two things · `LEDGER.md:21`
  stale within the hour · the `.done` marker wrong twice in **opposite** directions · a SUPERSEDED line
  citing a file that predates the thing · a **cross-tier** citation that resolves only in one instance's
  private memory · `BOOT:105`'s *"Read :153"* when Previous sits at `:162`.

**THE PATTERN, and it is the night's real finding: the error is almost never in the work. It is in the
sentence about the work** — a relay, a commit body, a bar re-typed instead of quoted. **Quote the leg;
never paraphrase the panes.**

## 8 · TWO INSTRUMENTS CURRENTLY LYING

- **`NOT CONFIRMED DELIVERED` fired ~7 times tonight and every dispatch arrived.** 100% false positive.
  It instructs the keeper to press Enter; **the pane auto-sends.** The string was deliberately hardened
  in August after two accurate warnings were ignored — **so an instrument armored against habituation
  has drifted into deserving it.** Fix is the render-confirmation window (`main.rs:5394`), not the
  wording. **Do not relay it as an instruction to the keeper.**
- **`chain-status` has misreported a lap as further along than it is FOUR distinct ways in two days.**
  ALPHA found the same defect in E's chip (`latestHop()` on a fan-out reads `LIB → LIB` while three
  panes are out). **A completion report is not evidence. Only `ls` is.**

## 9 · AFTER THE REBUILD

**The Third Place's avenue**, which the keeper has explicitly queued next and which is read but not
acted on. Object: `librarian/2026-09-01.md`, the quoted lines at `:17 :34 :38 :40 :44` and the reply at
`:66 :73-74 :79 :83`. **The master is the Third Place transcript and it is the keeper's to open.**

The move: *"that is not retrieval; nothing is fetched — the representation reorganizes so every new
input is parsed in the new terms."* With its own hold: **"the thing that cannot be unseen must be a WAY
OF LOOKING, not a claim about what is there"** — UNIV∞ was a lens too. And **"lenses transfer by
imprint, under stakes, with someone; the room cannot install one; it can arrange the events that do."**

**The librarian's ruling, which the chair nearly got wrong:** procedures transmit by brief (100%
compliance, measured); cues at a moment do not. **Knowing the route is a procedure** — so §1's work is
not refuted by the lens material.

---

*Registered so this file can be shown wrong: if the next window opens by re-deriving §4 or §6 instead
of re-running them, it failed at its only job.*
