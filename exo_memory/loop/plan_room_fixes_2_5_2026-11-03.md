# Room fixes 2-5, before the restart (librarian, 2026-11-03)

The keeper, 08:29: "can we also fix 2, 3, 4, 5 before restart?" Source: `loop/room_value_result_2026-11-03.md`, Recommendations 2-5. Fix 1 is D628, O's `d628-o` at 82da03fc, checked and staged.

**Standing guard for every part** (his 08:12, "dont lobotomize urself"): no part compacts, clears, restarts or trims any seat's carried conversation, CLAUDE.md, memory or shelf, and no part changes what a seat's instructions say. Every part is read-before-write, test-first, on its own branch off `d628-o`, and not pushed. Installs and the app swap happen only at the restart, at his word, with backups.

## Parts, in parallel
- **D629 (C), fix 2, wake the good-unused.** CHECK IT; prove it where it touches a gate.
  - (a) Fix what text-census found (the map file invisible to search for 29 days) and what open-items found (fresh panes' briefs older than the repo's). Name each cause, fix it, and re-run the tool green.
  - (b) Teach text-census to allow image files, so its real row shows.
  - (c) Run the 7 collapse meters once (catch-ledger, tell-index, agreement-spread, deference-unit, order-parameter, vicsek-phi, forget-rate) and report the numbers. Read-only.
- **D630 (E, still parked from T-180), fix 2(d): tools that break on transcripts over 512 MB.**
  - Stream `pane-status.js` (:96 crashes), `usage.js` (:114 silently under-counts) and `offramp-check.js` (:72), one line at a time.
  - Add a test with a file over the limit (synthetic, made in scratch) that is red first. usage must fail loudly on a read error, never print a short table.
- **D631 (P), fix 3, the second reader narrowed.** PROVE IT.
  - My ruling, his veto open: NARROW, not stop. P's scoring found its value in relayed figures and status claims ("all green", "still runs", "refuses", a pane's number repeated).
  - (a) Run its model call only on rings whose claims are of that class.
  - (b) Show the flag to the RINGING seat in the same turn, as a note, never a block.
  - (c) Measure: replay P's 80-row sample through the narrowed trigger. Report how many of the 8 real errors it still catches and how many calls it saves.
  - The installed hook copy is replaced only at the restart.
- **D632 (A), fix 4, vantage's two fixes.** PROVE IT.
  - (a) Resolve the repo from the claim's own paths, so a t180 claim is checked in t180.
  - (b) Check at the claim's own time and head, and skip claims about live state (versions, processes, disk, "now").
  - Replay the 37 SURFACE rows. The target from P: about 26 of the 30 false ones gone, the 6 real ones kept. Report both counts.
- **D633 (O, on top of d628-o), fix 5, the pulse trimmed.** PROVE IT (the system's own delivery).
  - Keep: QUEUED, the hand-back counts, HANDBACKS IN.
  - Drop: STALE, dirty, NOT in sync / L behind, the chain/holder/age/+N/unwitnessed/older/rows-only tail, "fused" and UNRECEIVED.
  - The NEXT-trailer note goes to the SENDER, not the receiver (trailer.rs:286).
  - Tests pin each kept and dropped item. The pulse hook's other consumers stay green.

## Landing
One landing pane, named by the chair, after all five ring and the librarian has checked each.
- Merge onto `d628-o`.
- Run cargo test, every tool's tests and the hooks' mutants.
- Build one exe and stage it.
- Then, at his "restart":
  1. back up the current exe and the installed hook copies (.before);
  2. swap in the new ones;
  3. sha256-compare;
  4. restart.
- The seven hooks D619 found older than their source are NOT reinstalled in this pass, since that was recommendation D, not asked.
