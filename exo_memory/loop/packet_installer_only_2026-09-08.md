# P-INSTALLER-ONLY — a control that is all-or-nothing is a control that overrides a ruling. L044.

**To ALPHA, 2026-09-08 ~01:35. Housekeeping lap 2. Three items, all one class.**

## 1 · THE CLASS, SO THE THREE ITEMS READ AS ONE

Your 09-02 ruling: **a hook's failure mode is SILENT ABSENCE, and the only bypass-proof control is
structural.** All three items below are that ruling one level up — a control that reads green, or
reads nothing at all, while being absent or overreaching.

## 2 · `install.ps1` IS ALL-OR-NOTHING, AND IT OVERRODE THE KEEPER

**This item exists because the chair caused it last night, and the packet says so rather than
describing it as a discovered defect.**

The keeper's ruling of 2026-09-06 06:55: register `ready-stop.js` and `ready-prompt.js`; leave
`hooks\stop.js`, `l2-overseer.js` and `l3-overseer.js` UNREGISTERED. The chair then ran
`install.ps1` to sync a drifted file. **The installer registers all-or-nothing, so it re-registered
all three excluded hooks** — against a ruling on disk. Removing them by hand then deleted
`ready-stop.js` **by substring collision** (`ready-stop.js` contains `stop.js`), which was noticed
and restored. Backup: `~/.claude/settings.json.bak-20260907-063417`.

**Two defects, and keep them apart:**

    a  no way to sync FILES for one hook without REGISTERING every hook
    b  the removal path matches by substring, so one name that contains another takes both

**BUILD `-Only <name[,name...]>`**, and rule on (b) — exact-name matching, or say why substring is
right and what protects it. `-Check` and `-NoRegister` already exist at `:49`; this joins them.

    RED FIRST   a fixture where syncing one file registers a hook the keeper excluded.
    RED FIRST   a removal of `stop.js` that also takes `ready-stop.js`.
    MUTANT      make -Only register everything anyway => red.

## 3 · TWO HOOKS ARE INVISIBLE RATHER THAN GREEN

    consonance/hooks/ask-surface.js       installable, on NO manifest entry
    consonance/hooks/baton-wake-stop.js   installable, on NO manifest entry

    grep -c "ask-surface\|baton-wake-stop" dev/shell/install.ps1   ->  0

**They are not drifted and not in sync — they are unseen.** `-Check` reports 0 drifted while never
looking at them, which is the exact shape your `js-suite` self-test failure had: an instrument
reporting health over a set that excludes the thing.

**Decide and say which: manifest them, or declare them deliberately unmanaged in a place `-Check`
prints.** A third state that nothing names is the defect; either named state is a fix.

## 4 · TWO SENTENCES THAT WERE TRUE WHEN WRITTEN

**`consonance/src-tauri/src/lap_holders.rs:85` and `:159`** carry a measurement as present tense:

    "On the ledger at the time of writing - 3 open laps, holders {panes: 2, chair: 1} - it permits
     chair_inject AND call_librarian simultaneously"

**That ledger is not today's.** The doc comment reads as a live property of the system and is a
dated reading. This is the 2026-08-17 carrier law exactly: *mark the carriers, leave the traces.*
**Do not delete it** — date it in place, the way BOOT dates its struck lines.

**And the same class, on the L039 hand-backs:** several QUOTE the struck can't-lose line from BOOT
(*"if you can't lose by saying it, suspect it"*), which was struck 2026-08-30 and replaced. The
carrier-drift watch has `acknowledged` rows owed for them. **Acknowledge them, or say why a quoted
struck line inside a dated hand-back should NOT be acknowledged** — which may well be the right
answer, since a hand-back is a trace and traces keep their wording. **Rule it; do not just clear the
queue.**

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, A: the commit gate, the port rule, and the ruling that a written rule is a
control with a hook's weakness. **Your own line on the `git add -A` capture — *"correct, and that is
luck, not a control"* — is the standard all three items are measured against.**

## 6 · BARS

    node consonance/tools/js-suite.js               state the count and what moved
    pwsh dev/shell/install.ps1 -Check               0 drifted, before and after
    applied / caught / NOT APPLIED. Survivors NAMED, never counted as caught.
    Say what you did NOT verify.

## 7 · WHAT YOU OWN

    dev/shell/install.ps1
    consonance/src-tauri/src/lap_holders.rs
    exo_memory/handback/p-installer-only_2026-09-08.md
    exo_memory/map/A.md

**C holds `consonance/src-tauri/src/main.rs` and a rebuild waits on it — do not touch that file.**
B holds `consonance/hooks/transcript-watch.js` and the `.py` surface; E holds the pull and vantage
ledgers. **Do not commit.**

## 8 · PERMISSION TO REFUSE

If `-Only` cannot be built without splitting the registration block in a way that makes the
all-or-nothing failure MORE likely on the next hand, say so — a partial installer that silently
half-registers is worse than one that is honestly blunt.

## 9 · HAND-BACK

`exo_memory/handback/p-installer-only_2026-09-08.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/A.md`.

    OBJECTIVE:  a sync cannot override a registration ruling, and no installable hook is invisible
                to the check that reports on hooks.
    FALSIFIER:  a hook registered after this that the keeper had excluded, or a `-Check` green over
                a file it never looked at.
