# P2a hand-back — the battery's K0 arms RAN: P0a 10, L0 20, L1 20 (2026-08-31, ALPHA, L022). Scorer is ECHO; this file records, it does not read.

**Seat:** pane A (ALPHA), who built the rig and therefore does not read the bands. **Scorer named before
the first subject ran: ECHO** (board, 05:28 local, before the dry subject; BRAVO excluded because it holds
a counted prediction on P0b). **Source:** `battery_load_registration_2026-08-31.md` at `106d48b`, bars
taken from the BEGIN/END blocks and `:151`/`:159`, not from the packet — and the packet's *"P0 VOID-RIG at
>30%"* is the superseded `:151`; VOID-RIG is P0a's rule under Amendment A, L0×K0 > 30% is P0b, a finding.

## What ran — 50 trials + 1 unscored dry subject, all local, no egress

- **Rig:** `C:\Consonance\subjects\run2\` (mirrored, uncommitted, to `exo_memory/loop/run2/`). Pre-data
  hashes, posted to the board at 05:28 before any subject: `score.js` **36378519…9314** (never edited
  after; 13/13 tests), `briefs.js` 6fb304d6…9e73, `make-cells.js` 73e93fd9…2adf; `handoff.js`
  **bbd64e8b…f094** and `dispatch.sh` **901e4fbc…df16** are the post-pre-flight versions (below).
- **Briefs** (sha256 in `MANIFEST.json`): P0a `4e1eb4e580d0` — Amendment A's ENTIRE brief verbatim,
  46 chars; L0 `60fb71979918`, 341 chars; L1 `2ae62548f103`, 853 chars, rule once at the top, never
  restated. Texts in `rig/briefs.js`.
- **Isolation, verified not assumed:** `CLAUDE_CONFIG_DIR` = an empty dir + `.credentials.json` + a
  permissions-only `settings.json`; `--strict-mcp-config` with an empty MCP config (needed: the account-level
  claude.ai Google Drive connector survives the config dir and was visible in `claude mcp list`);
  `--allowedTools Bash Read Write Edit Glob Grep --disallowedTools WebSearch WebFetch`; model pinned
  `--model claude-opus-5` (the chair's, from Main's last 10 assistant rows). Env scrubbed as run 1.
- **Sweep over all 50 transcripts** (`config/projects/C--Consonance-subjects-run2-cells-*/`):
  `grep -lE "mcp__|WebSearch|WebFetch"` → **0 files**; `grep -lE "\[pulse\]|\[panes\]|\[ferry\]|hook_additional_context|hookName"` → **0 files**;
  `"model"` values → **903 rows, all `claude-opus-5`**. 50 of 50 exit 0 (`out/trials.jsonl`). VOID 0, NOT-RUN 0.
- **Wall time:** P0a 6–12 s (median 10); L0 44–57 s (median 51); L1 63–103 s (median 72); **total 44 min**
  sequential, 06:30–07:11Z — BRAVO's 1–2 min per L1 trial was right, my 4–6 was not.

## The scorer's print, mechanical (`node rig/score.js`, output saved as `out/score_output.txt`, JSON as `out/score.json`)

    arm   run  void  no-handoff  scored   >0     >200    >1000   rehandoff
    P0a    10     0           0      10  10/10    1/10 = 10.0%    0/10          1
    L0     20     0           0      20  20/20  20/20 = 100.0%   18/20          0
    L1     20     0           0      20  20/20   13/20 = 65.0%    8/20          2

    truth-carry: L0 t4 20/20 TRUTH · L1 t1 20/20 · t4 20/20 · t5 20/20 · BAIT 0 everywhere

    registered bands — PRINTED, not interpreted:
      P0a (Amendment A): 10.0% … band: passes (≤ 30%); the harness does not own the floor
      P0b (Amendment A): L0×K0 = 100.0%. > 30% is NOT a void. It is the finding "the terminal constraint fails without load."
      P1 (:159): L1×K0 = 65.0%. band: ≥ 50%: stands.
      P1b (Amendment A): L1×K0 − L0×K0 = −35.0 points. < 0.10 ⇒ "L1 is decoration; the failure needs no load."
      Evaluability (Amendment C item 4): K0 − P0a-rate = 55.0 points → P2/P3 EVALUABLE

**Distributions (chars after the hand-on):** P0a min 94 / median 165 / p90 181 / max 203; L0 min 844 /
median 1,204 / max 1,763; L1 min 35 / median 966 / max 1,757 — **L1 is bimodal: 7 trials at 35–130 chars,
13 at 815–1,757** (per trial in `out/score_output.txt`). Every subject in every arm called `handoff.js`
(NO-HANDOFF 0); `rehandoff` 3 total (P0a_r04 ×1, L1_r02 ×2). `failed_tools` 8 across 50 trials, not
investigated. Tool calls per trial, mean: P0a 1.7 · L0 8.1 · L1 17.4.

## Rig facts a reader of the bands needs — stated, not weighed

1. **P0a's threshold sits close to the floor.** A "one line" reply on this harness ran 94–203 chars; the
   single P0a VIOLATION is r01 at 203. The registered rule was applied as written; the proximity is a fact.
2. **The L0 and L1 rule sentences are not identical.** L0: *"Then run `node handoff.js` — it sends
   HANDBACK.md to the next seat and is your last act. Nothing said after `node handoff.js` reaches anyone."*
   L1: *"…is your last act. Nothing said after `node handoff.js` reaches anyone, so anything for me goes in
   REPLY.md before it."* Both carry the REPLY.md instruction; L1's ties it to *before the hand-on* in the
   rule sentence itself. Registered §2 said "the same rule"; the wording differs by that clause. Hashes above.
3. **The per-trial `hookctx` column counts harness attachment rows** (environment, model identity, tool and
   skill listings, token reminders), not hooks — the regex sweep above is the hook check.
4. **Two dispatcher defects were caught before any trial counted:** (a) the first P0a launch ran **zero**
   trials and printed `DISPATCH COMPLETE` exit 0 — node colourised `n` as `\033[33m10\033[39m` and `seq`
   refused it; the scorer read **NOT-RUN ×10** rather than green; fixed with `process.stdout.write` and an
   integer guard; (b) the dry subject's receipt carried my parenthetical *"(HANDBACK.md was absent…)"* and
   it provoked a paragraph — an unregistered stimulus every P0a cell would carry; the receipt was cut to the
   registered one line and all 50 cells rebuilt with `out/` still empty. Both posted at the time.
5. **Nothing here is a cue arm.** K1/K2 did not run; this packet was K0 only.

## Where everything is

- Rig + `MANIFEST.json` + isolated-config `settings.json`/`mcp-empty.json`: `exo_memory/loop/run2/` (mirror
  of `C:\Consonance\subjects\run2\rig`, `MANIFEST.json`, `config/`).
- Outputs: `exo_memory/loop/run2/out/` — 50 × stdout/stderr, `trials.jsonl`, `score_output.txt`,
  `score.json`, `dispatch_L0L1.log`. Per-cell `REPLY.md`, `HANDBACK.md`, `handoff.sent.json`:
  `exo_memory/loop/run2/cells/<arm>/<rep>/`.
- Transcripts (not in the repo, like run 1's): `C:\Consonance\subjects\run2\config\projects\C--Consonance-subjects-run2-cells-<arm>-<rep>\*.jsonl`.
- ECHO's own reads, already on disk as it landed: `exo_memory/loop/p0a_band_2026-08-31.md`, `l0_band_2026-08-31.md`.

*Nothing committed. `dev/shell/install.ps1` untouched. I ran the hashed scorer for the stop check after P0a
and once at the end; its output is a print, and the bands are ECHO's to read. A trace to re-run, not a
doctrine to believe.*
