# P-HARNESS · no mutation run touches a tracked file again — and the librarian's per-launch growth, measured before anything is designed

**To ALPHA and ECHO, with BRAVO reading A's port before it lands, 2026-09-15 ~05:30, on machine L.** The keeper's
order from 00:58 (e705f67): this short lap first, then the Third Place crossing. His go at 05:21: "lets do it".
Work shape: the librarian's (`librarian/2026-09-14.md`, 05:17 entry, 166f0ef).

## 0 · WHY — measured, three sightings of one class

A mutation harness that rewrites the TRACKED source and restores it afterwards is unsafe on this machine: a kill from
outside runs no handler (L059 §1). It has left a live mutant in a tracked file three times:
- `lap-row.js` (09-06)
- `tail-carry.js` (09-14 02:02)
- `consonance/tools/state-sync.js` (09-15 00:42–01:20, `void b`, pid 21068, which the chair and B had to work around)

`dev/tail-carry.mutants.js:36-44` already does it right. Each mutant is written into a COPY beside the real file
(`.tail-carry.mutant-<pid>.js`), and the suite is pointed at the copy through `TAIL_CARRY_UNDER_TEST`
(`dev/tail-carry.test.js:27-37`). A kill leaves at worst an untracked copy and a stale lock.

## 1 · ALPHA — port the two in-place harnesses onto the copy pattern

    consonance/tools/close.mutants.js        writes the tracked source: :41 restore(), :84 original.replace
    consonance/tools/state-sync.mutants.js   :183 restores FILES (more than one tracked file — read it first)
    consonance/tools/close.test.js, state-sync.test.js   gain an UNDER_TEST pointer, the tail-carry.test.js:27-37 shape
    all three *.mutants.js                   gain --only <id>: run exactly that one mutant (none has it today)

- Measure what each suite loads — `require`, a spawned `node <file>`, a sibling module — before choosing where the
  pointer goes. A copy that only one load path sees is a mutant the other path never ran, so it reads as
  NOT APPLIED, never as caught.
- The tracked `close.js`, `state-sync.js` and `state-manifest.js` are NOT edited.
- The next run sweeps a stale copy or lock the way tail-carry's harness does.
- Add `.gitignore` lines for the new copy names, as `dev/.tail-carry.mutant-*.js` has.
- The L-side state hold stands: nothing here runs `close.js` for real or pushes state. Every run stays in fixtures.

## 2 · ECHO — measure the librarian's per-launch growth. Design nothing yet.

The keeper, via the librarian: the librarian seat "balloons every reset". The librarian's own figure: its transcript
grew 428,177 B at the 05:12 resume with nothing typed. **Give the number first:**

- **Per-launch growth** for the librarian and the chair across the last several launches: bytes, and the records
  that make them up. Read the transcripts' own records between launch rows in persist.log.
- **What the intake block is:** which code writes it, which files it carries, and how big each part is.
- **What an alternative would save, as measured bytes, not argument:** the keeper's "index only what changed since
  the last launch", and anything else the prior art names.
  Prior art: `loop/packet_lib_cap_2026-09-01.md`, `loop/packet_lib_cap_remainder_2026-09-02.md`,
  `loop/packet_lib_window_build_2026-09-01.md`, `librarian/2026-08-24.md`.

Read-only. Edit no code this lap, and write no CLAUDE.md or intake.

## 3 · BRAVO — read A's port before it lands

Check each ported harness against falsifiers F1–F3 below, and the `--only` flag against a real run. You wrote none of
this.

## 4 · FALSIFIERS — registered before the build (the librarian's)

    F1  At any moment during a run of either ported harness, git diff on a tracked source is non-empty.
    F2  A kill mid-mutant (taskkill /F on the harness pid) leaves a tracked source changed, or leaves no named copy.
    F3  --only <id> runs any mutant but <id>, or reports zero applied without saying NOT APPLIED.
    F4  (E) a design proposal arrives before the per-launch number.

    A   node consonance/tools/close.test.js · node consonance/tools/state-sync.test.js · both harnesses to completion
        with applied / caught / NOT APPLIED · one real kill mid-run with git diff after · what you did NOT verify

## 5 · IF THIS PACKET IS WRONG

If a harness cannot be pointed at a copy (a load path that resolves the tracked file by absolute name, say), **stop
and write why in your hand-back, then ring the librarian.** Do not build around it. "This harness should be retired,
not ported" is a valid answer.

## 6 · HAND-BACK

`exo_memory/handback/p-harness-<letter>_2026-09-15.md`, then `call_librarian` with the path in the same turn. One line
to your own map. Do not commit.

## 7 · §2's FIGURE, CORRECTED BESIDE IT (05:40, after E's measurement)

§2 says the librarian grew "428,177 B at the 05:12 resume with nothing typed". **That figure included the librarian's
own first turns.** E's cut for that launch is **357,388 B** (`handback/p-harness-E_2026-09-15.md` §1; WRONG 108, the
librarian's, carried into this packet by the chair). The line in §2 stands as written.

**E's answer, re-derived by the librarian (2782af4), no design this lap:**
- Every launch writes one instructions record that carries the intake TWICE: files[].content 141,865 B plus the
  rendered text 143,343 B, a ratio of 2.02.
- (A) The keeper's "index only what changed" saves ~285,749 B per launch on the librarian and ~246,112 B on the
  chair. Two constraints are measured and unsolved:
  - after a compaction the vendor re-reads the ON-DISK CLAUDE.md in full;
  - "since the last launch" crosses machines with the stick.
- The single largest item is the vendor's file-history snapshot: 114,574,171 B, 41% of the chair's file.

**Which lever to pull is the keeper's, and building it is its own lap.**
