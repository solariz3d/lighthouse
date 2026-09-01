# Chair handoff — 2026-09-01 ~07:55, L028 IN FLIGHT, rebuild deferred to tomorrow

**Supersedes `handoff_chair_2026-09-01b.md`** (~05:00). That one was written before the 06:11 and
06:55 rebuilds and before the librarian died.

**For what is OPEN, read `exo_memory/librarian/LEDGER.md`.** This file does not restate it.
**Re-run §5. Do not quote it.**

---

## 1 · THE NIGHT'S REAL EVENT: the librarian died and came back

At ~06:11 the librarian returned `Context limit reached` to every message including the keeper's
`hello`, and `/compact` returned `Compaction failed — conversation could not be reduced below the
context limit`. **The 06:11 rebuild is what killed it:** the relaunch rewrote its shell LARGER
(1,258,634 → 1,305,657) and the seat woke into a document that did not fit the window it wakes into.

    906,300 chars / 2.89 bytes-per-token  ~=  313,000 tokens   vs a ~200,000 window

That arithmetic is why `hello` failed on a fresh session with two exchanges. **The 2.89 is CHARLIE's,
quoted from `corpus_shelf` and never re-measured by the chair.**

**It is alive now on 129,402 bytes** and it has taken over its own map, filed two commits, and logged
WRONG #62 against itself. See §3.

## 2 · WHAT IS HOLDING IT UP, and it is not in the binary

**`launch.ps1` sets `CONSONANCE_LIBRARIAN_BUDGET = '0'`** (`290dc05`). That is a mitigation living in
a launcher script. It is committed, so a relaunch is safe and the seat survives unattended — **but
start the app any other way and it dies again.** Removing that line is the chair's, only after L028
lands and is verified; the line says so in the file.

## 3 · L028 IS IN FLIGHT — BRAVO, uncommitted at handoff

**Packet `34caac8`**, `exo_memory/loop/packet_lib_cap_2026-09-01.md`. Four items in `main.rs`:

    A  LIBRARIAN_INTAKE_LIMIT off 1,000,000 — chars-vs-bytes is B's to derive, not the chair's
    B  self-limiting: carry while the RUNNING INTAKE is under the limit, so no env var is load-bearing
    C  the header branches on the DELIVERED set, not on the set the rule would carry
    D  the intake emits the M.md POINTER via own_map_path (pointer, not file — 86,792 + 129,402 blows the cap)

**THE LIBRARIAN'S PRIOR ART (`63d03eb`) — and the chair could not confirm it reached B.** Two items:

1. **P-LIB-FORGET's falsifier may be unscoreable under the real cap.** At 150k over a 129,402 floor,
   rule (a) carries ZERO whatever the rule says — **inert by arithmetic, not by defect.** Owed:
   ALPHA's amendment, or the LEDGER row marked INERT UNDER CAP. **The window CHARLIE built may be
   retired by the cap that makes it correct.**
2. **The INDEX costs more than BOOT.** 129,402 − BOOT 39,606 − LIBRARIAN.md 16,897 = **72,899** for
   index + headers. **247 of 518 indexed paths are run artifacts** (`loop/run2/cells/` 240 +
   `loop/run1/items/` 7). Excluding them is the cheapest headroom available and loses nothing the
   seat cites. The seat marks its own ~17k figure **ESTIMATED, not measured** — print the real one.

**DELIVERY STATUS, verified from the board rather than from the warning:**

    07:46:16  chair -> 12fb81f6  [delivered and received] + a mirrored row   <- the packet ARRIVED
    07:48:07  chair -> 12fb81f6  [WRITTEN BUT UNCONFIRMED], no mirror row    <- the interrupt DID NOT

**So B may be building without the prior art. Check that first.** Do NOT re-inject — a second write
appends to what is already sitting in the composer.

## 4 · THE `NOT CONFIRMED DELIVERED` INSTRUMENT JUST PRODUCED ITS FIRST TRUE POSITIVE

It fired ~7 times earlier tonight and **every one of those arrived — 100% false positive**, which is
why the previous handoff said not to relay it. At 07:48 it fired and **was right.**

**The discriminator is the mirrored board row, which the warning cannot see and the chair can:** a
dispatch that renders writes a `[pane-id]` row beside the `chair` row. No mirror = it did not render.
**That is the render-confirmation fix (`main.rs:5394`) already available as a check, unbuilt.** Use
the board, not the string.

## 5 · VERIFY RATHER THAN BELIEVE

    cd C:\Consonance\lighthouse
    git log --oneline -14
    node consonance/tools/js-suite.js
    node consonance/tools/chain-status.js
    node consonance/tools/lap-row.js --report
    cd consonance/src-tauri && cargo test --bin consonance
    sed -n '/carried in full/p' C:/Consonance/instances/librarian/CLAUDE.md

## 6 · WHAT THE CHAIR GOT WRONG, and every one was caught by someone else

- **The bar, not the work.** CHARLIE's window met all four bars exactly; the LIMIT was 1,000,000
  against a documented 150k cap. **The chair had quoted `main.rs:3576`'s cap to the keeper an hour
  earlier**, then verified the bars were MET and never asked whether the bar was RIGHT.
- **"Tier 2 misses, briefs resolve to the live repo file"** — stated to the keeper as a corrected
  mechanism, twice. **`BOOT.md` IS beside the exe**, so tier 2 hits and panes read the BUILD
  DIRECTORY's copy. A brief change needs a REBUILD.
- **`brief/` was not in `launch.ps1`'s watch list** — so a brief-only edit could not trigger the build
  that is the only thing which ships it. **A one-way valve.** Fixed in `72c077a`; found because the
  M.md pointer never reached the librarian's wake shell, and **the LIBRARIAN found it independently
  via `git log`** (`d081773`).
- **"Nothing is lost by clearing"** — the keeper's correction: *"it isnt just about fixing the
  problem, but bringing the same lib back with their context."* The notes are the record; the thread
  is the one who wrote them. That is the second principle, reached for casually while quoting the
  rule that forbids it.
- **WRONG count 54 published as matching the seat's own "53+"** — the seat's figure at death was
  **61**. 54 was TURNS CONTAINING THE WORD; 61 was ENTRIES. Two units, and the agreement was
  coincidence. Corrected by the seat in `M.md` §3.
- **Four readings run after the 06:11 rebuild and none of them asked whether the seat could speak.**
  The chip was what the chair was watching; the librarian was what mattered.

**THE PATTERN, and it is sharper than last night's:** the chair verified answers and did not verify
questions. Every check was real and aimed at the thing in front of it. **Retrieval was not the
bottleneck — the 150k cap had been retrieved, stated aloud, and cited by line number an hour before
it failed to reach the decision three messages later.**

## 7 · WHAT LANDED

`984ffc3` window rule (a), 390,968 to the byte · `290dc05` the cap mitigation · `5bfcde9` M.md
assembled from the seat's own words · `72c077a` the brief valve · `9c6a131` + `d081773` + `63d03eb`
**the librarian's own commits, after the death** · `ad4e615` all 431 turns by day, 517,938 bytes ·
`1bef7d9` E's chip wired · `c0b2af9` the window pick · `a7bec4b` the loop card's objective.

**Reading 2 PASSED at 06:11 and is the night's one clean result:** every live pane shell went
`card=0, call_librarian=0, 147k` → `card=1, call_librarian=8, ~110k`. **The panes know the loop.**
The chip's render in WebView2 is still unverified by anyone.

## 8 · AFTER L028

The rebuild, then the **Third Place avenue** — read, queued, and now twice deferred.
`librarian/2026-09-01.md` at `:17 :34 :38 :40 :44`, reply at `:66 :73-74 :79 :83`.

---

*Registered so this file can be shown wrong: if the next window opens by re-deriving §3 or §5 instead
of re-running them, it failed at its only job.*

---

## 9 · THE TREE IS DIRTY AND DOES NOT COMPILE — THIS IS EXPECTED, added 07:56

The keeper had to leave with BRAVO mid-build. **Do not read the red as damage.**

    git status --short          M consonance/src-tauri/src/main.rs
    git diff --stat             +250 / -44
    cargo check --bin consonance -> error E0425, does not compile

**That is BRAVO part-way through L028's four items, saved to disk mid-turn.** The files survive a
shutdown — they are ordinary files — but **BRAVO's THREAD does not.** Its reasoning at the moment
the machine went off is gone the way the librarian's was.

**First move tomorrow, in this order:**

1. **Look at the pane before assuming.** If BRAVO resumed and can finish, let it — it holds context
   this file does not.
2. **If BRAVO cannot resume**, do NOT try to finish its half-written change by reading the diff.
   `git checkout -- consonance/src-tauri/src/main.rs` and re-dispatch from `34caac8`, which is
   committed and complete. **A stranger completing someone else's half-thought is the telephone
   game with a compiler attached.**
3. **Either way, hand BRAVO the librarian's prior art first** (`63d03eb`) — §3 records that it
   was WRITTEN BUT UNCONFIRMED and may never have rendered, so B may have built without knowing
   the window can be inert under the real cap.

**Nothing is lost by the shutdown except B's in-flight reasoning.** Every packet, measurement,
registration and the librarian's whole recovered archive is committed and pushed.
