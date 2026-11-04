# T-180: run the test suite in parallel, as a speed-up AND a deliberate crash test. Librarian, on D, 2026-10-05 16:2x. Lap D247.

The keeper, 16:17: "can we do the speed up and test to see if we crash for next lap, like parralel runs or whatever it was".

## What the record already says
- D226 (`handback/p-suite2-E_2026-10-03.md`): the two-lane runner `tools/suite2.cjs` (t180 `01165a09`, NOT landed) made the light lane
  IDENTICAL and 56% faster (615.9 s → 271.3 s), but was DROPPED at a 5.7% projected saving. The heavy lane is 5,404 of 6,167 s (87.6%), and
  the two app mutation harnesses alone are 4,597 s (74.5%): `app/test/core-mutation.test.js` 2,993 s, `app/test/mutation.test.js` 1,604 s.
- E's inference there: the only lever big enough is the mutation harnesses' own inner concurrency, which the shim forces to 1.
- The crashes: 10-03 16:22 came during `core-mutation.test.js` running ALONE (serial). 10-05 00:27 (0xC000A003) and 11:58 (0x7E) also crashed,
  the second with the undervolt OFF. Today's machine state: undervolt off, EXPO on, Realtek audio drivers updated 14:21.
- So serial didn't prevent crashes. A deliberate parallel run is both the speed-up and a controlled test of the current hardware state.

## The lap (pane E, who built suite2; ONLY when nothing else is in flight: after the 960de7c install and A's follow-up have handed back)
1. **Warn first, through the chair:** every seat commits or saves its in-flight state before the run starts; nothing else runs during it.
2. **A crash-proof ledger:** every result line, plus free RAM and a timestamp every 5 s, is appended and fsynced as it lands (as E's
   `run.jsonl` in D243), so a crash leaves the exact moment and load on disk.
3. **On t180 main as it then stands, under the heavy-run lock:**
   a. the two app mutation harnesses with inner concurrency 4 (one harness at a time), then at 6 if 4 survives;
   b. suite2's light lane at 6 with the heavy lane after it (harnesses at the concurrency that survived).
4. **Compare test by test** with a serial reference on the same tree (`suite2.cjs --compare`): the same pass/fail/skip set, and for the
   harnesses the same mutants caught.

## Registered now, before any run
- **KEEP parallel** (land suite2 and the harness concurrency as the new default) if: results identical test by test AND no crash AND the full
  run is ≥ 40% faster than serial AND free RAM never drops below 8 GB.
- **DROP back to serial** if any result differs, OR the RAM floor is crossed, OR it saves < 40%.
- **If the PC crashes:** stop, serial stays, and record the crash time against the ledger's last lines and the Event Log (bugcheck code).
  A crash under this load with the undervolt off points at EXPO or the hardware, not at the tests; the next step is the keeper's (EXPO off).
- **Not changed:** feel-tier laps keep targeted tests only (memory `match-checking-to-risk`).

NEXT: chair dispatch D247 to E when the 960de7c install and A's follow-up have handed back and nothing else holds the lock
