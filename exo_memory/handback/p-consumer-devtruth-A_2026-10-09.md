# p-consumer-devtruth-A — D273 lap 5, dev-side truth (seat A, Sonnet 5.5, machine D), 2026-10-09

Commit `f0ad1806` on branch `devtruth-a` (worktree `C:\Users\nname\Desktop\worktrees\a-dt-wt`), from main `a19c876d`.
Four files, named paths, local, **not pushed**: `consonance/README.md`, `consonance/hooks/README.md`,
`consonance/ui/index.html`, `dev/shell/install.ps1`. B6 (BOOT:85) is C's, untouched.

## B4 — consonance/README.md counts, re-derived at a19c876d

Every command is in the README beside its number (its own style). The script that runs them all and prints
claimed-vs-got is `scratchpad/dt/verify.sh`; its output is below, and all 18 count rows agree.

| what | README said | tree says | command |
|---|---|---|---|
| non-test tools | 71 | **79** | `ls consonance/tools/*.js \| grep -v '\.test\.js' \| grep -v '\.mutants\.js' \| wc -l` |
| tools with a `.test.js` beside them | 66 | **74** | the `for f in …; [ -f "${f%.js}.test.js" ]` loop in the README |
| `*.test.js` | 82 | **95** (74 beside a tool, 21 with no tool of their name) | `ls consonance/tools/*.test.js \| wc -l` |
| `*.mutants.js` | 4 | **9** (5 beside a tool; 4 beside none: reply-slot, second-reader, sources-gate, union-at-launch) | `ls consonance/tools/*.mutants.js \| wc -l` |
| tools with no test | five incl. `curate.js` | five: dispatch-gate-report, l039-power, open-items, pane-status, **reply-slot-replay** (`curate.js` does not exist) | the loop with `\|\| echo "$f"` |
| "Three of the N" wired to nothing | 71 | **79** (the three unchanged: live-host, vantage-disposition, vantage-sealed-scope) | `grep -l 'WIRED TO NOTHING' consonance/tools/*.js` |
| non-test hooks `.js` | 14 | **22** | `ls consonance/hooks/*.js \| grep -v '\.test\.js' \| wc -l` |
| copied by install.ps1 | (implied all) | **18** | `grep -c "^ *@{ From = 'consonance.hooks" dev/shell/install.ps1` |
| unmanaged by install.ps1 | – | **4** (ask-surface, baton-wake-stop, live-mirror-stop, jev-flags retired) | `grep -c "^ *@{ Src = 'consonance.hooks" dev/shell/install.ps1` |
| registration entries | – | **22** | `grep -c "^ *@{ Event = " dev/shell/install.ps1` |

Checked and **unchanged, true**: 47 tauri commands, 10 board verbs, ADDRESS_TABLE two rows, 7 tabs, six gates,
the brief listing, fast-forward marks 11, ledger-union FILES `:66-78`, every cited file and commit exists.

Line references moved and are re-derived (the README now prints the grep that reproduces them):
keep-warm block `:11001`, `KEEP_WARM_TEXT :11054`, `AFTER :11027`, `TICK :11028`, `keep_warm_tick :11411`,
not-activated skip `:11207`, `gate_or_queue` call `:11508` in `keep_warm_send :11507` (fn at `:10361`),
`keep_warm_decision :11171`, `keep_warm_off_path :11356`, `chair_audit :11488`, `keep_warm_missed :11267`.
launch.ps1 park comment `:365-383`, `Update-FromOrigin :410-561`, called `:562`. state-sync `installTree :1371`,
`appendOnlyCompare :1347`, stop-before-write `:1386-1476`, re-check `:1527`. The flake figure ("6 of 60 … 0 of 40")
now names its source, `exo_memory/handback/p-lib-cap_2026-09-02.md` — one machine, one night.

Also fixed (same disease, found on the way): `consonance/hooks/README.md` printed the census `files 24 … registrations 13`;
the `derive.ps1` census prints `files 34 (dev\shell 16, consonance\hooks 18, declared libraries 7, held 0)`,
`registrations 22`. Its third-state sentence now names live-mirror-stop and the retired jev-flags.

## B5 — dev/shell/install.ps1, comment text only

The reply slot was described as "in SHADOW … NEVER blocks" at the file entry (`:177-179`) and "SHADOW ONLY … silent on
every path" at the registration (`:296`). `reply-slot.js` has `SHADOW = false` since D220. Both now say: live since D220
(built in SHADOW at D218), blocks the stop once per turn on an unbacked reply for the librarian and chair only, fails open.
Left alone because they are TRUE: ask-ending "SHADOW ONLY" (`:184`, `:307`), second-reader "in SHADOW" (`:169`).
**No behaviour change, checked:** `grep -vE '^\s*#' dev/shell/install.ps1` hashes to `cfadde58…` (sha256) before (`git show HEAD:`) and after;
BOM `efbbbf` kept.

## B7 — consonance/ui/index.html:177

`(consonance/tools/jev-judge.js, L077 3a560a3)` → `(the Jev judge, L077)`, in an HTML comment. No visible text changed.

## Tests (each under the heavy-run lock, serially, on the committed tree)

| test | result |
|---|---|
| `consonance/tools/front-door-links.test.js` | exit 0 |
| `consonance/ui/about-readme.test.js` | 6 passed, 0 failed |
| `consonance/ui/third-place-wiring.test.js` | 10 passed, 0 failed |
| `consonance/hooks/dream-gate.test.js` | 73 passed, 0 failed |
| `consonance/tools/portable-paths.test.js` | exit 0 |
| `consonance/tools/install-only.test.js` | 46 passed, 0 failed |
| `consonance/tools/carrier-drift.test.js` | **RED, pre-existing** (see below) |

## Found, not fixed

**carrier-drift is red at a19c876d without my edits** (`git stash` then run: `fail 2`, same finding). One UNACCOUNTED site:
`exo_memory/handback/p-devreds-A_2026-10-08.md:12` — my own dev-reds hand-back quotes "Light, not lifeguard" while listing the
four B/C hand-back sites I registered. The registry rows I added cover `p-tphooks*`; my own file carries the quote too. Two fixes
exist: register that line as a mention, or reword the quote in my hand-back (a dated trace — the 2026-08-17 precedent says
keep traces, so registering is the consistent one). Out of this packet's scope; I did not touch the registry.

## Does not establish

Counts are for a19c876d only; E's concurrent lap-5 edits to `consonance/README.md` (if any) will conflict textually in the
tools/hooks paragraphs and the numbers must be re-run after the merge (`bash scratchpad/dt/verify.sh`). cargo not run (no Rust touched).
The README's line numbers are as of this commit and will drift again; the greps beside them are the durable form.

## verify.sh output (claimed vs got), abridged to the count rows

All 18 rows `claims N  got N`; the three list rows (five untested, four mutants-without-tool, keep-warm/launch/state-sync lines) print the names and numbers above.

## Follow-up (chair, librarian's ruling): carrier-drift GREEN

The red named under "Found, not fixed" is fixed as a second commit on `devtruth-a`, on top of `f0ad1806`: one `mention` row in
`consonance/tools/carrier-drift.registry.json` for `exo_memory/handback/p-devreds-A_2026-10-08.md` (anchor: the line's own words
about the four hand-backs it registered; reason: a dated trace quoting the retired wording to name sites, not asserting it).
The hand-back itself is not reworded. Checked on the `devtruth-a` tree: `node consonance/tools/carrier-drift.js` prints **GREEN**;
`node consonance/tools/carrier-drift.test.js` 57 pass, 0 fail (under the lock). The commit hash is in `git log devtruth-a -1`.

## Lap 6 (A6) — the LIBRARIAN.md example citation

Commit `9532611f` on branch `lap6-a` (worktree `C:\Users\nname\Desktop\worktrees\a-l6-wt`), from main `62d3921f`. One file, named path, one line, not pushed.

**The line, named for identity-diff: `consonance/src-tauri/brief/LIBRARIAN.md:104` in the source.** The packet said `:98`; that is the
generated consumer's numbering (the cold reader read the shipped file, `p-consumer-coldread3-LIB_2026-10-09.md:18`). The source line is 104,
and it is the only line changed:

    -> `journal/2026-08-11.md:47` — the working-tree finding.
    +> `journal/2026-08-11.md:355-365` — the working-tree finding.

Why `:355-365` and not the packet's `:355-362`: in `exo_memory/journal/2026-08-11.md`, line 47 is the heading "The reviewer's best move";
the finding starts at `:355` ("The pure `context_window()` and its six tests were in the working tree") and its closing sentence, "no other
instrument was watching", is `:365`; `:362` is where "The mechanism" paragraph begins, so `:355-362` would cut the finding mid-sentence.
(Check: `sed -n 355,365p exo_memory/journal/2026-08-11.md`.)

**Other line numbers in LIBRARIAN.md, checked:** the only other file:line cite is `journal/2026-08-11.md:90-93` (LIBRARIAN.md:214, the
45/45 CONFIRMED set): lines 90-93 hold "The `45/45 CONFIRMED` was the tell … ~18% wrong", so it resolves. `:284` is a date, not a line cite.
LIBRARIAN.md quotes no line number of itself.

**Left alone, same string, out of scope:** `exo_memory/astra/WELCOME.md:33` also gives `journal/2026-08-11.md:47` as its example of the
rule (a different file; not LIBRARIAN's); `lap-row.js:264` and `lap-row.test.js:97` use it as a path-normalisation fixture, where
the number is irrelevant.

**Tests** (under the lock, on the committed tree): consumer-relabel 24/0, librarian-cite 23/0, librarian-notes 7/0, open-items-build 6/0.
**portable-paths is RED on `62d3921f` itself, not from this change:** 3 unbaselined BENIGN-TEST drive constants
(`consonance/hooks/dirs.test.js:57,58`, `dev/shell/hooks/precompact-repo.test.js:31`), same result with my commit checked out and on
`62d3921f`. Someone's recent tests added them; it needs a `--update` after a read, which is not this packet's.

## Follow-up 2 (chair, librarian's ruling): carrier-drift GREEN again, devtruth line 68 registered

Commit `19ee4163` on branch `carrier2-a` (worktree `a-c2-wt`), from main `93e160b2`; one file, `consonance/tools/carrier-drift.registry.json`,
one `mention` row for this hand-back's own line 68 (the line describing the line-12 registration). The hand-back is not reworded.
Checked on that tree: `node consonance/tools/carrier-drift.js` prints **GREEN**; `node consonance/tools/carrier-drift.test.js` 57 pass, 0 fail (under the lock).
**`node consonance/tools/portable-paths.js` is RED on main `93e160b2` itself, not GREEN as the packet expected**, and with this commit stashed it prints the same:
3 unbaselined BENIGN-TEST drive constants, `consonance/hooks/dirs.test.js:57,58` and `dev/shell/hooks/precompact-repo.test.js:31` (the same three as in Lap 6 above).
This commit does not change that count. I did not run `--update`: it would bless another seat's constants unread.
Note: the main checkout holds an uncommitted edit to this file (the Lap 6 section); the line numbers above line 68 are unchanged by it.
