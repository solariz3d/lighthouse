# p-remeasure-E · D277 measure (b): the 10-03 re-measure, steps 1–5 · pane E, on D, 2026-10-10 · STEPS 1–5 DONE (verify hashes filed; step 6 is B and C)

Runbook: `exo_memory/loop/remeasure_runbook_2026-10-10.md` lines 17–30, followed as written. Tools: `exo_memory/loop/claimrec/` at `dbfa931e` (draw.js's last commit).
R = `C:\Consonance\retrieval\remeasure1003`, created EMPTY at 2026-10-10T12:04Z (0 entries), outside the repo. E does not verify (step 6 is B and C).
Gate switch: `"gates_mode"` absent from `~/.consonance.json` at 12:04Z (`grep -c` → 0). Nothing written there.
Every node step runs under the heavy-run lock from the lighthouse root.

## Step 1 · counts · 12:04Z · 3 s
`node exo_memory/loop/claimrec/draw.js frame --window remeasure`
```
window remeasure [2026-10-03T11:55:00Z, 2026-10-10T11:55:00Z): frame 3676, excluded 0, eligible 3676
  librarian frame 771 excluded 0 | chair frame 380 excluded 0 | A frame 827 excluded 0 | B frame 613 excluded 0 | C frame 420 excluded 0 | E frame 665 excluded 0
```

## Step 2 · draw · 12:05Z · 4 s
`node exo_memory/loop/claimrec/draw.js draw --window remeasure --out C:/Consonance/retrieval/remeasure1003`
```
drawn 100: {"C":15,"A":18,"E":17,"B":20,"librarian":20,"chair":10}; drawn_ids.txt sha256 8f8b17dfd208d7a1d169180897536ccda74c4ec94ab08c27fcd464991998bbf4
```
`R/key/` holds drawn.json, drawn_ids.txt and frame.json; `R/replies/` holds 100 files. Independent check: `sha256sum R/key/drawn_ids.txt` →
`8f8b17dfd208d7a1d169180897536ccda74c4ec94ab08c27fcd464991998bbf4`, the same. **Filed with the librarian before step 3.**

## Step 3 · readers · 12:05:12Z → 12:31:13Z · 1,560 s (lock held throughout)
`CLAIMREC_MODEL=claude-opus-5-5 node exo_memory/loop/claimrec/claimrec.js readers --in R/replies --out R/readers`. The pin is honoured: `claimrec.js:33`
reads `process.env.CLAIMREC_MODEL`.
```
ask: default (arm 1, registration c8c18d4 §2) · ask sha256 07e7f85552b4762014e7e7ec4633e0a33d98f33a2f99019e4221a6b18a99d3c1
reader msg_011Cfswno2JSXNajF6KSd3QE: exit 0 · success · 14.2 s · model claude-opus-5-5 · out 1036 · cwd leftover 0      (the last of 100)
claude --version before "2.1.292 (Claude Code)" after "2.1.292 (Claude Code)" · transcripts added under ~/.claude/projects: 0
```
**100 of 100** `exit 0 · success` (`grep -c "^reader "` → 100; failures 0); **100 of 100 on `claude-opus-5-5`**; no batch failed or was re-issued.
Cost: the readers' `total_cost_usd` summed over the 100 json = **$5.69** (the runbook's estimate was ~$5.91 and 28 min). `R/readers` holds 200 reader
files plus `run-readers.json`.

## Step 4 · packets · ran in 0 s; waited 4,267 s on the heavy-run lock (the chair's land-startline full suite)
`node exo_memory/loop/claimrec/claimrec.js packets --in R/replies --readers R/readers --out R/packets`
```
packet msg_011Cfswno2JSXNajF6KSd3QE: 4 units · 15 statements · mechanically mapped 13      (the last of 100)
```
**100 packets**; totals over the log: 1,243 units, 2,111 statements, 1,618 mapped mechanically.
*Correction to myself:* my first total read the task's 10-line tail and the wrong awk field; this is from the full log (`step4.txt`).

## Step 5 · assign · 13:43:15Z → 13:48:27Z · 312 s (almost all of it waiting on the lock, A's D285 suites)
`node exo_memory/loop/claimrec/draw.js assign --window remeasure --packets R/packets --out R`
```
claims 298 from 100 messages; B 168, C 186, overlap 56
```
**Hashes, taken before either verifier opens its file** (I did not open them; `sha256sum` only):
- `R/verify/B/claims.json` sha256 **`f5d1689404b044b0bb8865a536a4ee55e25b457d1532ea56a0f8f58e393eb56d`**
- `R/verify/C/claims.json` sha256 **`c37a8498f04e0c97d61ae6be2bb48196480bb2e3870ac8533999d25aa4ff25ef`**
- `R/key/claims_all.json` sha256 `fbee9dce1c0e8ef86ba26e30e8403703357c0af3f4dceb7e47ea63c445446189` (the key; not for the verifiers)

## State at the end of step 5
- `gates_mode` is still absent (re-checked below the ring). E did not verify, and did not read the replies, readers, packets or claims beyond counts and
  hashes. Step 6 is B's and C's, blind, each from its own folder.
- Not established: that `assign`'s files satisfy B's and C's lookups end to end (the runbook's own open item, line 51).
- Evidence (my scratchpad, `remeasure/`): `step1.txt` … `step5.txt`, the full output of each locked run.
