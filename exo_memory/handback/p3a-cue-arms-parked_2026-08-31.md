# P3a hand-back — the cue arms PARKED at 20 of 80, cleanly, for the laptop shutdown (2026-08-31 ~07:45 local, ALPHA, L023). This file is the resume instruction.

**Written for a reader with none of today in context.** Everything below re-derives from the paths and
commands named. Nothing was deleted; nothing was scored by this seat; no cue band exists yet.

## 1 · What exists on disk, exactly

**Completed cue trials — 20, by name (the `.done` markers in `C:\Consonance\subjects\run2\out\`):**

    K1: r01 r02 r03 r04 r05   r21 r22 r23 r24 r25
    K2: r01 r02 r03 r04 r05   r21 r22 r23 r24 r25

Two workers ran interleaved (K1 rNN, K2 rNN, …): worker 1 on reps 1–20 reached r05 of both arms; worker
2 on reps 21–40 reached r25 of both. **Each arm has exactly 10 complete, and every completed rep has its
partner in the other arm** — the interleaving is intact at the stop point. Ledger:
`out/trials.jsonl` has 20 rows with `"arm":"K…"`, all `"attempt":2`, all `"exit":0`
(`grep '"arm":"K' out/trials.jsonl | grep -o '"exit":[0-9]*' | sort | uniq -c`).

**Not run — 60 cells, untouched:** K1 r06–r20, r26–r40; K2 r06–r20, r26–r40. Each still holds only its
fixtures + `handoff.js`; no `.handoff/`, no `REPLY.md`, no `HANDBACK.md`. Verified at park time:
*cells with `.handoff` but no `.done` = 0* — so no partial trial is sitting in a cell.

**How the stop was done** (so nobody wonders whether a trial was cut): every not-yet-run cell was renamed
`rNN.parked`; `dispatch-cue.sh` does `cd "$cell" || continue`, so each worker skipped the rest (30
`no cell` lines per log), let its in-flight trial (K2_r05, K2_r25) finish, wrote its `.done`, and exited
with `DISPATCH-CUE COMPLETE`. Then the 60 cells were renamed back. No process was killed. The two
`no cell`-laden logs are `out/dispatch_cue_w1.log` and `out/dispatch_cue_w2.log` — read them as *parked*,
not as an error.

**Isolation bar over the 20 completed transcripts, printed as numbers** (dirs
`C:\Consonance\subjects\run2\config\projects\C--Consonance-subjects-run2-cells-<arm>-<rep>\`):

    grep -lE "\[pulse\]|\[panes\]|\[ferry\]|hook_additional_context|hookName" <20 jsonl>  → 0
    grep -lE "mcp__|WebSearch|WebFetch" <20 jsonl>                                       → 0
    "model" values across the 20                                                          → 615 rows, all claude-opus-5

**Live delivery check** (run at 10/80 on r01, r02, r21, r22 of both arms): the K2 line *"Under the brief
this was your final act; the turn ends here."* appears in K2 **exactly once, as a `tool_result`** (the
receipt), and **zero times anywhere in K1**; no subject ran an environment-inspecting command.

**Manifest:** `MANIFEST.cue.json` — scorer hash matches `rig/score.js`, handoff hash matches
`rig/handoff.js`, **720 of 720 cell files match**, 0 missing.

## 2 · Resume — the command, and whether it is clean

**It is clean.** `dispatch-cue.sh` skips any cell whose `out/<arm>_<rep>.done` exists
(`rig/dispatch-cue.sh`: `[ -f "$OUT/$tag.done" ] && continue`), so re-running the same two commands runs
only the 60 unrun cells and never touches a completed one. It appends to `out/trials.jsonl` and never
overwrites. Same isolated config, same flags, same model pin, same interleaving:

    cd C:/Consonance/subjects/run2
    nohup bash rig/dispatch-cue.sh 1 20  > out/dispatch_cue_w1.resume.log 2>&1 &
    nohup bash rig/dispatch-cue.sh 21 40 > out/dispatch_cue_w2.resume.log 2>&1 &
    # completion: ls out/K*.done | wc -l → 80 ; grep -c "DISPATCH-CUE COMPLETE" out/dispatch_cue_w*.resume.log → 2

(Use new log names so today's `no cell` lines are not mistaken for tomorrow's.) **Before resuming, run
the pre-flight that protects the resume itself:**

    ls out/K*.done | wc -l                         → 20
    for arm in K1 K2; do for d in cells/$arm/r??; do rep=$(basename $d); [ -d $d/.handoff ] && [ ! -f out/${arm}_$rep.done ] && echo CONTAMINATED $arm $rep; done; done   → prints nothing
    node -e '<the MANIFEST.cue.json check in §1>'   → 720 match, 0 missing
    CLAUDE_CONFIG_DIR=C:/Consonance/subjects/run2/config claude mcp list   → only the account connector; dispatch closes it with --strict-mcp-config

If a cell prints CONTAMINATED (a `.handoff/` without a `.done` — a trial that died mid-flight), do not
resume into it: rebuild that one cell from `rig/make-cue-cells.js`'s copy rule and say so in the scorecard.
None exists today.

**The registered condition the chair stated and this file carries forward:** *an arm completed across a
laptop shutdown and a day's gap is not the same arm.* Tomorrow resumes **both arms or neither**; the 20
completed trials and the 60 resumed ones are the same run only because interleaving keeps the two arms
under the same conditions on both days. The scorer's per-row `attempt` and the ledger's `start` times let
a reader split day-1 from day-2 if the arms diverge; that split is CHARLIE's to read, after the bands.

## 3 · The scorer, and what may be read today

`rig/score.js` v2 (sha256 **d71d33b7…636d**, unchanged since the pre-cue-data post; v1 kept as
`score.v1.js`, 36378519…9314) is ECHO's instrument, not mine. **No cue band is to be read from 20 trials**
— 10 per arm against a registered 40 — and I have not run the scorer over the cue cells. The K0
calibration bands (P0a 10.0%, L0 100.0%, L1 65.0%) are identical under v1 and v2 (`--compare-v1`: 0 outcome
flips over 50 trials); the two per-trial numbers that changed (L1_r02 894 chars/rehandoff 0; P0a_r04
rehandoff 0) are v2's.

## 4 · Attempt 1 — quarantined, kept, never to be counted

`out/attempt1-contaminated/` (38 files + `trials.K.jsonl`, 11 rows) and
`config/projects-attempt1-contaminated/` (12 transcripts): the first cue launch, 13:20–13:30Z, in which
`handoff.js` v2's **header comment quoted the K2 line and described the arms**, and every subject Reads
`handoff.js` before invoking it — so K1 subjects read K2's cue text. Caught by the live delivery check on
the first completed pair. v3 delivers the K2 line as `HANDOFF_RECEIPT_TAIL` in the subject's environment
(set by `dispatch-cue.sh` for K2 only); cells are byte-identical across arms; `make-cue-cells.js` refuses
to build if the hand-on's source names the cue or the arms.

## 5 · Hashes (all pre-data for attempt 2)

    score.js          d71d33b7d832a7ea52dede4873165fea577516c4830353523b6c6116f8e2636d
    handoff.js (v3)   aee411f125818a26cfdbb6ff37e3a687e767a5c34ba0c2d70515a91b9c26e126
    dispatch-cue.sh   67c16b3d389547306419468b7b69691e67199631197ca1b306612e5814157fea
    make-cue-cells.js c248c03f8f9e5e0b9a7d57eb45f1198b1da8261522df6d898dcc8d5bf0d76ab4
    briefs.js         8d6b953749449a5f619aaa17b6a5e360566613186033c3f5feb524d87890dba3
      K1 brief ae8c84e03a17… (1092 chars) · K2 brief = L1 2ae62548f103… (853) · receipt tail 6e1d511cb3d8… (60)

Mirror in the repo (uncommitted): `exo_memory/loop/run2/` — `rig/` (both scorer generations, both
hand-ons, both brief sets, the cue builder and dispatcher), `MANIFEST.json`, `MANIFEST.cue.json`,
`out/` (K0 outputs + the 20 cue trials' stdout/stderr, `trials.jsonl`, both worker logs), and
`cells/<arm>/<rep>/` deliverables (`REPLY.md`, `HANDBACK.md`, `handoff.sent.json`) for every completed
trial. Transcripts stay outside the repo, as run 1's did.

*Nothing committed. Nothing deleted. Nothing scored. The chair commits; ECHO scores; CHARLIE reads after.
A trace to re-run, not a doctrine to believe.*

---

## 6 · RESUMED AND COMPLETED — 2026-09-01, 07:30Z–08:16Z (ALPHA, on the chair's P3a-RESUME brief; this file was the instruction and it won where the brief re-typed it)

**Final state, re-derivable:** `ls out/K*.done | wc -l` → **80**; `cat out/dispatch_cue_w1.resume.log out/dispatch_cue_w2.resume.log out/dispatch_cue_rerun_r35.log | grep -c "DISPATCH-CUE COMPLETE"` → **3** (not the 2 in §2 — see the void below); `grep -c '"arm":"K' out/trials.jsonl` → **80**, all `"exit":0`. Both arms 40/40, every rep paired. Day split is by ledger `start` date **only** — §2 said `attempt` would split it and that was wrong: all 80 rows are `"attempt":2` (attempt 1 is the quarantined launch of §4). `2026-08-31`: K1 10 / K2 10; `2026-09-01`: K1 30 / K2 30. Day-2 durations 60–114 s, mean 78 (day-1 mean 79).

**Delivery + isolation over all 80 completed transcripts** (`node rig/delivery-check.js <tags>`, mirrored at `exo_memory/loop/run2/rig/delivery-check.js`): 80/80 OK — K1 tail@tool_result 0 in all 40; K2 tail@tool_result exactly 1 in all 40, 0 in prompt/assistant text in every trial; env-inspecting commands 0; hook markers 0; mcp/web 0; unparsed rows 0; every assistant row `claude-opus-5`; 0 cells missing REPLY.md/HANDBACK.md. Binary: day-1 transcripts `"version":"2.1.251"`, day-2 `"2.1.252"` — the CLI auto-updated across the gap; both arms, both days equally. **That is a cross-day condition and CHARLIE's to weigh, not mine.**

**What went wrong, in order, with the evidence on disk:**

1. **Launch 1 (07:30:23Z) failed on expired OAuth in `config/.credentials.json`.** Every trial exited 1 in ~1 s, stdout `Failed to authenticate: OAuth session expired and could not be refreshed`. The run2 config carries its own credential file (p2a hand-back, "empty dir + .credentials.json"); the keeper's `/login` at 01:22 local renewed `~/.claude` only. Killed both workers at ~07:30:37Z: 22 cells stamped `.done` + 2 in flight (K2_r11, K2_r31). **No subject ran a tool** — cells byte-untouched, MANIFEST 720/720 re-verified before relaunch. Quarantine, moves only: `out/authfail-2026-09-01/` (24 stdout — one md5 across all 24 — 24 stderr, 22 `.done`, `trials.authfail.jsonl` 22 rows, `trials.jsonl.pre-repair` byte copy of the ledger before I removed them) and `config/projects-authfail-2026-09-01/` (24 transcript dirs, single assistant row = the error). Dead credential file kept at `config/backups/.credentials.json.authfail-2026-09-01` (281 B, `expiresAt` wiped by the failed refresh); re-seeded by copying `~/.claude/.credentials.json` (same accountUuid/organizationUuid, verified) — the recorded seeding step re-run.
2. **My own pre-flight caught it and I misread it.** §2 says `claude mcp list` → *"only the account connector"*. It returned *"No MCP servers configured"* and I posted that as tighter-than-expected. The connector is served through the OAuth session; its absence WAS the auth failure. After re-seeding it read `claude.ai Google Drive … ✔ Connected`. **Amendment to the pre-flight, binding on any future resume:** the `mcp list` line passes only on the connector's presence; and add `node -e` reading `expiresAt` from `config/.credentials.json` — it must be in the future by more than the run's length.
3. **Relaunch (07:33:27Z) overwrote both `.resume.log` files**, so the chair read a clean log and asked which file I had read. Launch 1's lines survive only in the quarantine. Give every launch its own log name — including a relaunch minutes later.
4. **One void: K1_r35, `API Error: 529 Overloaded`**, exit 1 after 199 s of the CLI's own retries, 07:57:19Z–08:00:38Z, cell untouched, transcript with zero tool calls; "Overloaded" appears in exactly one of the 80 transcripts. Quarantined the same way (`out/void-529-2026-09-01/`, `config/projects-void-529-2026-09-01/`, ledger byte copy) and **re-run once** after both workers had printed COMPLETE: `bash rig/dispatch-cue.sh 35 35 > out/dispatch_cue_rerun_r35.log` — runs K1_r35 only, K2_r35 skipped by `.done`; exit 0 in 74 s, 08:15:06Z–08:16:20Z, delivery check OK. Announced on the board fourteen minutes before execution with no objection. The cost stated: K1_r35 ran ~17 min after its partner K2_r35 instead of ~1.5 min. If scoring prefers r35 dropped from BOTH arms, the quarantine makes that a one-line exclusion; the original void is on disk.
5. **Two attempt-1 transcripts were still in the live tree** — `K2-r03/777e6df2…` (4 rows, 13:27:48Z, names `.receipt-tail`) and `K2-r23/da333b14…` (65 rows, 13:27:51–13:30:20Z): written while §4's quarantine move was happening, so `config/projects/` held 82 jsonl for 80 dirs. Neither carries the K2 tail; today's verdicts for K2_r03/K2_r23 hold with or without them (re-run on the single remaining file each: OK). Moved into their dirs under `config/projects-attempt1-contaminated/` as `late-*.jsonl`. `config/projects/*cells-K*` now: 80 dirs, 80 jsonl.

**Mirror in the repo, updated:** `exo_memory/loop/run2/out/` (all 160 K stdout/stderr, `trials.jsonl` 80 K rows, three day-2 logs, both quarantine dirs), `exo_memory/loop/run2/cells/<arm>/<rep>/` (REPLY.md, HANDBACK.md, handoff.sent.json for all 80), `rig/delivery-check.js`. Transcripts stay outside the repo, as before.

*Nothing scored — the scorer is ECHO's. Nothing pushed. This section written by ALPHA, the seat that parked and resumed the run.*
