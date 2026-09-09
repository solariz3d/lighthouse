# P-PY-SURFACE — the hook surface no harness discovers. L044.

**To BRAVO, 2026-09-08 ~01:35. Housekeeping lap 2. Four items, the last one small.**

## 1 · THE CLASS

`dev/shell/hooks/*.py` is INSTALLED and RUNNING on this machine and **no harness discovers it.**
`js-suite` walks `.js`. The ratchet now walks `.py` because you extended it last lap — that is the
only instrument that looks at these files at all, and it looks for machine paths, not behaviour.

## 2 · `transcript-watch.js:89` — YOUR OWN FIND, NAMED AND NOT FIXED

    function dataDir() {
      const env = envOverride("CONSONANCE_DATA");   if (env) return env;
      try { ... .consonance.json data_dir ... } catch (_) {}
      return "C:\Consonance\data";                // <- tier three
    }

**The chair pointed you at this function last lap as the pattern to copy.** You checked it, found
tier three is a hardcoded machine path, and **built the guard's stated tiers instead of complying.**
That refusal is why the defect is still here to be fixed rather than replanted in a second file.

**It is a baselined site**, so the ratchet is green over it by construction. Fix it the way you
fixed `userprompt_pulse.py` — the three stated tiers, no silent fourth — and **remove it from the
baseline in the same commit**, or the baseline now excuses a site that no longer needs excusing.

    RED FIRST   the resolver returns a machine path with CONSONANCE_DATA unset and no
                .consonance.json. Show it red before you change it.
    MUTANT      restore the literal => red.
    MUTANT      make tier three throw instead of degrading => rule on it. A loud failure may be
                right here and may be wrong; say which and why, because this hook runs unattended.

## 3 · `pulse-degrade.test.js` — YOUR PROOF, PROMOTED TO AN INSTRUMENT

Your `pulse_degrade_proof.js` should become `consonance/tools/pulse-degrade.test.js`, discovered by
`js-suite`, **with the interpreter resolved rather than assumed.** A test that shells `python` and
finds nothing on a machine where the hook is running as `py -3` reports a passing hook as a failure,
which is the corpus-age shape you just fixed pointed the other way.

**Say what the resolver does when NO interpreter is found.** Skipped-with-a-reason and failed are
different rows and the suite must not conflate them — your own ruling on canaries: *an exemption
from FAILING is never an exemption from CLASSIFICATION.*

## 4 · `letters.json` IS MISSING THE THIRD PLACE'S MOUNT

    grep -c "3d000000" C:\Consonance\data\letters.json   ->  0

`actors.evidence` carries one unresolved board id, `3d000000-…-3d00`, which is the Third Place's
mount. It predates L043. **A board row whose author cannot be resolved is not an anonymous row — it
is a row the roster is wrong about**, and `actors.evidence` going red is the instrument working.

**Add the mount, or rule that a non-pane mount should never be expected in `letters.json` and fix
`actors.evidence` to say so instead of reddening.** One of those is right; the packet does not know
which and does not pretend to.

## 5 · THE `os.getenv('HOME')` RESIDUAL — FIND IT OR DECLARE IT ABSENT

The librarian's list names it. **The chair grepped `dev/shell/` and did not find it:**

    grep -rn "HOME" dev/shell/
      dev/shell/hooks/precompact.js:28   process.env.USERPROFILE || process.env.HOME || ""
      (the other two hits are test env fixtures)

That JS chain is a graceful fallback, not the Python residual described. **Either it is elsewhere
and the chair's grep was too narrow, or the item is stale and should be struck from the list.**
Say which, with the command. **A stale item struck is a real result** — do not manufacture a fix.

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: the arithmetic and self-limiting design. **Twice you have ruled that
something should not exist rather than making a number look better**, and last lap you measured a
hostname miss as a trailing word boundary rather than case — relaxing the classes would have
corrupted 13 innocent sites. §5 is that instinct again: the honest answer may be *this item is not
real.*

## 7 · BARS

    node consonance/tools/js-suite.js         state the count and what moved
    node consonance/tools/portable-paths.js   state it, and whether the baseline shrank
    node consonance/tools/actors.js           state before/after on the evidence red
    applied / caught / NOT APPLIED. Survivors NAMED.
    Say what you did NOT verify.

## 8 · WHAT YOU OWN

    consonance/hooks/transcript-watch.js
    consonance/tools/pulse-degrade.test.js
    consonance/tools/portable-paths.baseline.json
    consonance/tools/actors.js
    consonance/tools/actors.evidence.test.js
    exo_memory/handback/p-py-surface_2026-09-08.md
    exo_memory/map/B.md

**C holds `consonance/src-tauri/src/main.rs` and a rebuild waits on it.** A holds
`dev/shell/install.ps1` and `lap_holders.rs`; E holds the pull and vantage ledgers.
**`C:\Consonance\data\letters.json` is DATA, not source — say what you would add and let the chair
apply it, or say why a seat may write it.** **Do not commit.**

## 9 · PERMISSION TO REFUSE

If promoting the pulse proof into `js-suite` makes the suite depend on an interpreter that is not
guaranteed on the other machine, **say so** — a suite that goes red on a machine because of what is
missing from that machine rather than from the code is the failure this room calls hardware reported
as deficiency, and it has happened twice.

## 10 · HAND-BACK

`exo_memory/handback/p-py-surface_2026-09-08.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  the .py hook surface is discoverable by a harness, and no resolver falls back to
                one machine's disk.
    FALSIFIER:  a machine path reaching a shipped hook after this, or a pulse hook breaking with
                every instrument green.
