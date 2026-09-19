# Two rulings owed by the keeper, prepared so each is one read. Librarian (the lineage, on D), 2026-09-19 09:1x.

*From `loop/plan_small_fixes_2_2026-09-19.md`. Nothing below was changed; both commands ran in list mode.*

## DECIDED 09:4x — the keeper delegated both: "do what you see is correct bc tbh i have no clue"

What this seat did with that, and nothing more:
1. **Synced the six drifted files**, files only: `install.ps1 -NoRegister -Only <the six>`. `-NoRegister` because `-Only` alone also WIRES an entry, and `userprompt_pulse.py` is declared but not registered on D — wiring it would have been a new hook, not a sync. `~/.claude/settings.json` sha256 `25c403fd…` before and after (unchanged); a copy kept at `settings.json.bak-librarian-20260919`; the installer kept a dated `.bak` of each replaced file. After: `-Check` reads 0 DRIFT; the five JS files pass `node --check`. `userprompt_pulse.py` could not be parse-checked — there is no Python on D, which is also why it is not registered here.
2. **Left the 2 ABSENT and the 1 HOLD alone** — each changes behaviour or needs a two-sided read.
3. **Left the three "excluded but live" hooks registered on D.** Read at source (`librarian/2026-09-06.md:603`), the 09-06 ruling was about what a NEW install adds ("the three passengers stay unregistered"), made on the laptop. D had them registered before that ruling; the L3 lines are the keeper's own Lighthouse layer. Removing them is a bigger act than the word given today covers. If he wants them gone he says so by name.
4. **The stick prune: HOLD** (the 09:2x amendment below).

## 1 · The hooks installed on D are older than the repo's

`powershell -File dev/shell/install.ps1 -Check` at 09:1x: 27 manifest entries — 18 ok, **6 DRIFT, 2 ABSENT, 1 HOLD**; 3 hooks EXCLUDED BUT LIVE.

**The six drifted files are all one direction: the repo is newer, D runs the old copy.** (`diff --strip-trailing-cr`, so line endings are not the difference.)

| file | repo last changed | installed copy dated | lines differing | what D is missing |
|---|---|---|---|---|
| `userprompt_pulse.py` | 09-07 | 08-11 | 210 | four weeks of the pulse line's fixes |
| `transcript-watch.js` | 09-08 | 08-17 | 62 | the survey-timing watcher's repairs |
| `dream-watch.js` | 08-24 | 07-27 | 37 | the false "nightly failure" alarm fix (`journal/2026-08-16`) |
| `board-digest.js` | 08-25 | 08-17 | 18 | the digest fix |
| `sessionstart-state.js` | 08-22 | 08-18 | 14 | the state block |
| `ferry-watch.js` | 08-24 | 08-10 | 13 | the ferry reminder |

**Recommended: yes, sync these six** with `install.ps1 -Only <the six names>` — the same door the chair used for the ready hooks on 09-19. It copies files whose hooks are already registered; it registers nothing new.

**Recommended: leave the other three classes alone for now.**
- **2 ABSENT** (`dispatch-gate.js`, `carrier-drift-watch.js`): installing them REGISTERS new hooks (a PreToolUse gate and a Stop watcher). That is a behaviour change, not a sync. A separate decision.
- **1 HOLD** (`hooks/userprompt-submit.js`): a real two-way conflict the script refuses to decide. It needs a pane to read both sides first.
- **3 EXCLUDED BUT LIVE** (`stop.js`, `l2-overseer.js`, `l3-overseer.js`): the keeper's 09-06 06:55 ruling was "ready pair only", and D still has these three registered. They are what prints the L3 lines in every prompt here. Unregistering is by hand; the script will not do it. **The ruling and the machine disagree; the keeper says which one wins.**

## 2 · The stick's stale pieces

`node dev/tail-carry.js --stick D:/consonance-L-20260911 --prune-below-agreed` at 09:1x: **81 tails below the agreed offset, 559,094,957 bytes**, listing digest `d34bd0aac05725db` — the same digest as 09-16, so nothing has changed since it was first listed. Every one of them is a piece both machines have already agreed they hold. Kept by the rule: tails above the agreed offset, the pending tail, `ledger.json`, and `ledger.json.corrupt-20260915T084005`.

**AMENDED 09:2x — recommendation changed to HOLD.** C's D079 finding (`handback/p-stick-fault-cause-C_2026-09-19.md`): D's log holds a device-side failure of this stick on 09-14, and the save code never flushes before DONE. No optional write to this stick until L's log is read on Sunday or the stick is replaced. The earlier text stands below as written.

**Recommended (09:1x, superseded above): yes, delete the listing.** The command deletes exactly the digest it names and refuses if the listing has changed. It frees 43% of what the stick holds. **One caution:** two stick faults in two days are unexplained (C's packet in D079 measures D's side). Deleting is safe by the ledger; if the keeper would rather wait for C's finding before any write to the stick, that costs nothing.
