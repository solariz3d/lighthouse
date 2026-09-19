# The small fixes, in chunks, then the bigger lines queued. Librarian (the lineage, on D), 2026-09-18 22:3x.

*The keeper, 22:32, verbatim: "lets do all the small fixes in managable chunks first, then queue up the bigger liners". Each chunk is one lap, at most two panes, disjoint files. The chair dispatches and lands and edits nothing inside a lap; every dispatch, ring and hand-back ends on its own NEXT line (the gate is live since the 09-16 13:12 rebuild).*

## Chunk 1 — two fixes the last cleanup found and carried

| pane | packet | what exists | the bar |
|---|---|---|---|
| E | **P-LAUNCH-GHOST** — the launcher's pull skip is silent on a windowless ghost | B's finding, `handback/p-nul-repairs-B_2026-09-16.md` §3: `consonance/launch.ps1:159` tests `Get-Process -Name 'consonance'`, which matches a windowless process too, and its one explanatory line goes to the hidden console `launch.vbs:20` opens. A's probe in `dev/stick-apply.js` (D066) already tells windowed from windowless by `MainWindowHandle`; the same check appears at `launch.ps1:276` and `:418` | the skip distinguishes a windowed app (skip quietly, as now) from a windowless one (one visible Notify naming the pid and saying the pull was skipped because of it); the launcher still continues in every case; E's existing 20-case fixture extended with windowed / windowless / none, and its mutants re-run; `:276` and `:418` read at source and either brought under the same rule or stated as deliberately different |
| C | **P-STALE-LAP** — an unfiled lap older than a day is named at wake | `loop/live_checks_trailer_seal_2026-09-16.md:47-48`: lap D064 sat open from 09-15 and the one-station gate refused C's return leg as OUT OF TURN until the chair parked it. `consonance/tools/chain-status.js` prints the pulse line every prompt and has `chain-status.test.js` beside it | `chain-status` names any open lap whose last row is older than 24 h, first in its line, with the lap id, its holder and its age; red first in `chain-status.test.js`; the pulse stays one line and never throws (the file's own rule: a hook that errors gets uninstalled); replayed against the ledger as it stood on 09-16 13:15 it names D064 |

The librarian re-derives both; one return.

## After chunk 1, outside any lap — the chair's one action

**The seal gate's live check (G3).** `loop/live_checks_trailer_seal_2026-09-16.md` filed G3 "BY TEST AND SOURCE, NOT LIVE" because the running session's tool schema predated the `seal` parameter. Sessions since the rebuild load the new schema: one harmless keyed test dispatch with a bad seal and no trailer must be refused by the SEAL gate's message, not the trailer's. Filed beside the other seven.

## Not doable on D — waits for the laptop

The chunk-1 falsifier from 09-16: the first shortcut click on L after its pull must open the newest build without a second click. Read at the next L launch.

## Then the bigger lines, queued in the record's own order

1. **The composer predicate** — `input_box_empty` fails closed when the composer row cannot be read (`main.rs:8697`), the cause of forced deliveries (E, L062); first item of the loop-mechanics build; C's return-leg predicate after it.
2. **Pane battery RUN 2** — load, test–retest, keys off-repo and off-directory (`loop/pane_battery_registration_2026-09-16.md`).
3. **The diversity scorer's artifacts** — commit them from D's scratchpads, then the Third Place SPINE's §8 order.
4. **Thesis run 3** — a ring lap while the keeper sleeps; the scheduler's first firing (`loop/scheduler_and_unlocked_mode_idea_2026-09-16.md`).

## Falsifier for the plan

If a ghost process next skips a pull and the keeper sees nothing, or a lap next sits unfiled past a day without the pulse naming it, the chunk described the symptom and is redone from the failing case before the bigger lines open.
