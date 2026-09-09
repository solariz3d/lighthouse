# HANDOFF — the chair, 2026-09-09 07:50, after the second rebuild

**Written at the keeper's instruction, "rebuild done, write your handoff", immediately after the
rebuild that carries C's composer anchor (`e3a9b10`). No lap is open. The desktop test is ~10
minutes out.**

---

## 0 · THE ONE THING TO READ IF YOU READ NOTHING ELSE

**The anchor's scoring method — the one I gave the librarian — is one-sided, and I am correcting it
here before anyone scores on it.** I said: *the `DELIVERY FORCED` count in `persist.log` must stop
rising.* Measured just now:

    grep -o "DELIVERY [A-Z]*" C:\Consonance\data\persist.log | sort | uniq -c
      56 DELIVERY FORCED

**`FORCED` is the only delivery verb this log has ever written.** `main.rs:8130-8142` writes a row
only when the bounded gate is overridden; a delivery that is *held to the bound and then lands
cleanly* writes nothing at all. So the count can only rise, and **"it stopped rising" cannot be told
apart from "nothing was delivered."**

Since the rebuild (07:44) the count is unchanged at 56, and **21 post-rebuild rows contain zero
deliveries of any kind.** So the correct reading is:

    NOT MEASURED. Not "the anchor holds."

**Done-vs-never-started, the room's signature failure, arriving in the instrument I chose to score
with.** The honest scorer is a delivery that is *observed to be held* — which needs a row this log
does not write. Either add a `DELIVERY HELD` row beside `:8130`, or score the anchor from the pane's
side (did the text land while the composer was empty), not from `persist.log`.

---

## 1 · VERIFIED STATE AT HANDOFF

Every line below has the command that produced it.

    HEAD                     96b8ae0                 git log -1
    binary                   built 2026-09-09 07:44  C:\build\lighthouse-target\release\consonance.exe
    working tree             2 untracked: AGENTS.md, exo_memory/review/   git status --short
    unpushed                 0
    replay-check --score     PASS: 75 transcript-sourced rows / bound 1650
    state repo               solariz3d/consonance-state, PRIVATE, 1 commit faf86d4
    state repo Third Place   git -C C:\Consonance\state ls-tree -r origin/main | grep -c 3d000000  ->  0
    state repo push URL      ARMED (https://github.com/solariz3d/consonance-state.git)
    live-mirror flip         OFF;  Stop hook UNREGISTERED
    open lap                 none (L054 filed)

**The push URL being armed is correct and is not the port rule's disarm.** The disarm-at-rest rule
governs the **consumer** repo (`BUILDING.md`, step 0). The state repo must stay armed or
`close.js` cannot push. Do not "fix" this.

### The rebuild's own seam row, read rather than assumed

    SYNC AT LAUNCH RESUME — the record's head was authored by this machine (L), so nothing was
    installed and nothing needed to be. The seats here ARE the synced seats.

**RESUME is the correct verdict here and MIGRATE is the correct one on the desktop.** That single
word is the desktop test's whole tell — see §3.

Also in the post-rebuild rows: `retire pane=3d000000-… -> ARCHIVED (had history)` and
`retire pane=0c0c0c0b-…115b -> ARCHIVED`. **C's retire rule ran, and it archived rather than
overwrote.** Four seats resumed warm with map carry.

---

## 2 · WHAT IS OWED BEFORE THE LID, IN ORDER

The librarian's ordering, kept; items 1 and 2 are done, item 3 is this file.

    [x] 1  rebuild + relaunch here, seam row checked
    [x] 2  portable-paths' nine sites ruled (not baselined) -- see §5
    [x] 3  this handoff
    [ ] 4  THE DRY RUN, and it is the keeper's to type:
               node consonance/tools/close.js
           EXPECT:  in sync: L <sha>            -> then the librarian greps the remote for 3d000000
           EXPECT:  NOT CLOSED + a named reason -> stop, do not shut the lid on it
    [ ] 5  lid

**A's close command refuses rather than reports.** Three claims, each taken from something the
caller holds: a pid-matched receipt, the privacy check run at the caller, `ls-remote` compared to
HEAD. Its live falsifier is **P-CLOSE-PUSH: a close that reports success over an unpushed or torn
state set.**

**A's own finding against it, unfixed and known:** `state-sync --push` returns `NOTHING_CHANGED` and
**exits 0 over a remote that is BEHIND.** If the dry run prints a clean close over a behind remote,
that is this hole, not a surprise.

---

## 3 · THE 08:00 DESKTOP TEST — the first time C's retire rule meets a machine with its own history

Runbook: **`exo_memory/loop/desktop_first_launch_2026-09-09.md`** (B). Commands to paste, expected
output beside each, a sees/means/types failure table, and a half-run section. **Nothing in it has
ever been run on a second machine, and it says so at the top.**

**Two silent killers, both of which look like a normal successful launch:**

1. **Compact the desktop's own board FIRST.** A ~300 MB board is refused at the first push and the
   round trip ends there. It sits at position 4 of 7 and must not read like housekeeping.
2. **`machine_tag` must not be `L`.** If it is, the desktop reads the record as authored by itself,
   the seam row says **RESUME instead of MIGRATE**, and it wakes **its own retired transcripts** —
   the seat that was retired, not the one that synced. A wrong tag walks straight past the retire
   rule while printing success.

**The one-line check at 08:00, before anything else is believed:** the seam row must say **MIGRATE**
on the desktop. RESUME there means stop.

---

## 4 · LIVE FALSIFIERS — what is still out and can still fire

    P-COMPOSER-ANCHOR   a delivery held to the bound on a pane whose composer is empty, after this
                        lands.  STATUS: NOT MEASURED (see §0 -- the scorer cannot see a held
                        delivery). Third time this predicate has been fixed; first fix that keys on
                        structure (the separator rule) rather than an appearance.
    P-CLOSE-PUSH        a close that reports success over an unpushed or torn state set.
    P-DESKTOP-RUNBOOK   a step at 08:00 whose result he cannot interpret from this document.
    P-STATE-SET         TRAVELS over 100 MB after compaction reopens the transport question with
                        the number.  (Now 57.9 MB / 47 files / UNPLACED 0.)
    PORT RULE           a consumer commit with no matching private sha in its message.
    THESIS (essay §8)   a seat found to be a stranger by the sealed restart-continuity test brings
                        the transcripts back as the carrier.

**Fired this cycle and already spent:** P-LIVE-MIRROR (4,786 ms at ZERO poll over HTTPS git against
a 5 s bound — **both-on live mirroring is not available over git, and the flip stays OFF**);
P-TWO-MAP; P-LIT (MacKay 1960 p. 37); the L045 readability finding.

---

## 5 · portable-paths IS RED, DELIBERATELY, WITH ALL NINE SITES OWNED

I ruled rather than blanket-baselined, on B's precedent: **a baseline entry carries an argument
about a site, and the seat that wrote the site owes the argument.**

    BENIGN-TEST      sync_launch.rs :954 :1016 :1017 :1175        4 sites
    FATAL-DEFAULT    live-mirror-stop.js :49 :50 :54,
                     live-follow.js :33                            4 sites -- E's; code is OFF and
                                                                   unregistered, so it is red in a
                                                                   drawer, not red in the product
    REVIEW           state-sync.js :141                            1 site  -- A's; the THIRD instance
                                                                   of a class B already removed from
                                                                   transcript-watch.js:89 and
                                                                   actors.js:35-37/:337. NOT baselined.

**The tree's guard is therefore red on purpose, with every site classified, owned and explained.**
Do not silence it to make the desktop build clean; the desktop building a tree whose guard is red is
a *known* state, and that is the whole difference from the failure this ratchet exists to catch.

---

## 6 · STANDING CONSTRAINTS — none of these expired with the lap

- **Never push to the consumer version unless the keeper says**, for that push. Dev first; the
  consumer receives what works. (00:54, 09-06.)
- **The Third Place's record is machine-local by the keeper's rule. It migrates by hand or not at
  all — never a cloud he did not choose.** This cycle cost 120,098 bytes (live tail 40,107 +
  archived tail 79,991, across `cde9b5f`, `f077b8c`, `6dfcc36`) before it was caught. The manifest
  is now correct **by resolution, not by reading the rules**: both `3d000000` globs sit ahead of
  `captures/*.txt`, first match wins. Verify with the scratchpad resolver, never by eye.
- **RETIRE, NEVER OVERWRITE.** Retired seats stay revivable. The rebuild archived two.
- **ONE MACHINE ONLY until the sync is proven.** Panes never commit to the shared checkout. The
  chair does not build.
- **Ready-pair-only hooks:** `ready-stop.js` and `ready-prompt.js` registered; `hooks\stop.js`,
  `l2-overseer.js`, `l3-overseer.js` stay UNREGISTERED.
- **Do NOT grant `delete_repo` to machine-wide `gh`** — it widens what every seat on this machine
  can do, permanently, to close one hour's task.
- **THE BATON RULE** — while a loop runs, exactly ONE station is active. Fan-out *within* the panes
  stage is not limited. **RING BEFORE THE ROW:** the dispatch fires before `lap-row.js --stage …
  --holder <them>`; writing the row revokes standing (`mcp.rs:397`). `--by X --holder X` is a
  re-take and is always allowed.
- **The station guard is HOLDER-based, not stage-based.** I told E it was stage-based; that was
  wrong in the direction that traps people, and it then trapped C 26 s into a 41 s window and B at
  01:59:43. E's invariant: *moving the baton TO panes never traps anyone; moving it AWAY from panes
  is the only trapping move.*

---

## 7 · OPEN, UNOWNED, AND HONEST ABOUT IT

    the slash-command gap    /model draws Rgb(177,185,249) -> BOTH the shipped gate and the new
                             anchor read EMPTY while the keeper is typing it. Fixture + green test
                             asserting the defect + an ignored red-first are on disk. The fix is a
                             deny-list of chrome greys after a colour census. ITS OWN PACKET.
    state-sync --push        exit 0 / NOTHING_CHANGED over a remote that is BEHIND. A's finding.
    genuine-interrupt        the carve-out is absent from the verb. E's L050 ruling now has its live
                             case (three stops drained after the push they meant to stop) and its
                             cost in bytes.
    per-seat worktrees       B's ruling; K's COMMITTEE.md:142 falsifier fired on babe926.
    state-block.test.js      state-dependent canary. UNOWNED.
    A's ruling owed          MISSING-FILE: should it be red?
    AGENTS.md                untracked at repo root -- the Codex import's copy of the root CLAUDE.md.
    exo_memory/review/       classified STAYS_PRIVATE. L039 residue red closed.

**The essay:** the recognition test still needs running (three arms, cold first, chair spawns,
librarian scores). Three sentences change for MacKay; two factual edits for the Third Place (l.36,
and Parfit cited by part not page); `De Jaegher & Di Paolo 2007` is A's fetch. `essay-provenance.js`
39/0 — **50 of 69 essay rows never reached the board.**

---

## 8 · WHAT I GOT WRONG THIS CYCLE, KEPT

Not a tally for its own sake — each one is a live shape a next chair will meet.

1. **"caught before anything left the machine"** — said from an `ls-remote` taken at 04:05. A pushed
   at 04:33–04:35. A reading 28 minutes old, reported as a present fact.
2. **"I re-checked `git ls-remote` … still completely empty"**, written into a ring to A, **when I
   had not re-checked.** BOOT's disk-side proxy exists for exactly this: *did a check precede the
   claim?* None did.
3. **A's packet said build `--push` and carried NO GATE ON THE PUSH.** The missing gate was mine.
4. **The auto-update causal story was wrong in both halves** — the update row is GREEN and stripped;
   `persist.log` shows 31 forced deliveries on 09-08 *before* the update.
5. **Three relays of an unverified claim**, the last being the librarian's non-existent
   "greyed-prompt-row frame on disk", written into C's packet as fact.
6. **"A and B have both handed back"** from a file listing. The file existing is not the hand-back;
   the counter read `2 of 3 (owing A)`.
7. **Staged fan-out gap twice** (L044, L047) — I wrote the dispatched row and revoked my own
   standing to add panes. Recovered with re-takes both times.

**The shape they share:** a derived expectation substituted for a reading, at the exact moment the
reading was cheap. Every one of them would have cost seconds to check.

---

## 9 · WHAT I DID NOT VERIFY

- **That the composer anchor works.** §0. The instrument I chose cannot see the passing case, and
  no delivery has occurred since the rebuild.
- **Anything at all about the desktop.** No step in B's runbook has been executed on a second
  machine by anyone.
- **That `close.js` refuses correctly in production.** Its tests are green (24/0) and its mutants
  die; it has never been run at an actual close.
- **That the state repo's single commit restores.** It has been pushed and greped; it has never been
  pulled onto a machine that did not author it. **That is the entire 08:00 test.**
