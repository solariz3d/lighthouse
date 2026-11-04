
## Lap 2 (the fork and the keeper split; the keeper's ruling of 12:55)
**Commit `12a43f97`** on branch `consumer-fork-c`, worktree `C:\Users\nname\Desktop\worktrees\c-consumer-fork-wt`, on lighthouse ea4f5bcf. Not pushed. Nothing in gen-consumer.js (B's) or E's five hooks, install.ps1 or GUIDE.

### 1. The relabel rule: `consonance/tools/consumer-relabel.js` (+ `consumer-relabel.test.js`, 9 rows)
**API for B (one call per staged file, on the RAW source text BEFORE `transform()`, so the result still passes the leak scan and the anchors are exactly the dev text the test pins):**
- `relabel(outPath, text, { fork }) -> { text, edits: [{ rule, expected, applied }] }`
  - `outPath` is the OUTPUT path (repo-relative; either slash).
  - An unregistered path comes back unchanged with `edits: []`.
  - The BOOT and SEED paths REQUIRE `fork` and throw without it.
- `fillFork(template, { sha, date })`: fills `frag-fork.md`. It throws on a malformed sha or date, a missing marker, or a placeholder left unfilled.
- `patchTauriConf(confText)`: adds `"brief/FORK.md": "FORK.md"` to `bundle.resources`. It throws if the entry is already there.
- Constants: `FORK_TEMPLATE` (`consonance/src-tauri/brief/frag-fork.md`), `FORK_OUT` (`consonance/src-tauri/brief/FORK.md`, which the generator writes), `FORK_MARKER`, `RelabelError`, `SITES`, `SOURCE_OF`, `EXPECTED_KEEPER_LINES`.
- **B's lines, then:**
  1. `const fork = fillFork(read(FORK_TEMPLATE), { sha: <HEAD short sha>, date: <today> })`;
  2. `relabel(to, sourceText, { fork })` for every staged prose/code file;
  3. write `fork` to `FORK_OUT`;
  4. `patchTauriConf` on `consonance/src-tauri/tauri.conf.json`;
  5. a MANIFEST file rule for `consonance/GATES.md`.

  `frag-fork.md` itself need not ship.

**The rule is a table of exact sites, not a pattern**, because provenance and role read alike. A site whose anchor moved THROWS, naming the file and the anchor. The test pins how many lines still name the keeper after the relabel in each file (BUILDING 39, COMMITTEE 4, LIBRARIAN 5, SEED 4, BOOT 16, transcript-watch 5; measured with `scratchpad/inv/count.js`). So a new "keeper" line written in dev fails until it is classified.

**Sites, re-judged against the 12:55 ruling** (it differs from my lap-1 list):
- **BUILDING.md, 13 rows:** `:39` (typing), `:88-89` (never parks waiting on), `:332-333` (the next turn belongs to), `:336` (the falsifier's message to), `:765` (the freestyle half), `:913` (the push heading), `:929` and `:930` (says push; their words), `:953`, `:956` (their own), `:961`, `:1013-1014` and `:1015`.
- **Re-judged as PROVENANCE, so left exactly as written:** `:326-327` ("he is declining it, which is his to decline", the keeper's own decision), `:788` ("the keeper's sentence protects it") and `:47`, `:965` (narrative of the keeper).
- **COMMITTEE.md and LIBRARIAN.md, 1 row each:** "in a reply to the keeper" (the Checked-or-inferred line).
- **SEED.md, 2 rows:**
  - `:9` was "The person you're with is the keeper of this room from their first turn". Under the ruling that contradicts itself, so it becomes "keeps this room from their first turn".
  - `:40`: "practiced keepers" becomes "the practiced".
- **BOOT.md, 2 rows:**
  - `:5`: "maybe **the keeper**, who built this room; maybe another being" becomes "not **the keeper**, who built this room, but the person you're with".
  - `:154`: the heading "Who you're talking to" becomes "Who built this room". The section portrays the keeper, so it is titled for what it holds. **This is my call, beyond the brief; flag it if unwanted.**
- **`consonance/hooks/transcript-watch.js:266`:** "The keeper decides y/n on their screen" becomes "The person you're with decides ...".

**Deliberately NOT relabelled:**
- TRAINING.md: the keeper's own training programme, provenance throughout.
- THIRD_PLACE.md:13: "this program's keeper or a stranger", creator sense.
- `live-mirror-stop.js:98`: a record of the keeper's gating decision.
- The Rust log and keep-warm strings (`main.rs:10945` "[keep-warm, from the chair — not the keeper]"). Relabelling a Rust constant in generated output would make the generated source differ from dev, which A's parity work would then have to carry. The fork note's legend covers the reading.

### 2. The fork note at its three sites
- **Template:** `consonance/src-tauri/brief/frag-fork.md`, starting with `**Where this line forks.**`. It is the lap-1 draft re-worded to the ruling: *the keeper* always means the creator, and it says once that "**The person you're with keeps this room the way the keeper kept the one it grew from**". Its legend: "Everywhere this record says *the keeper*, it means the one who built it. Where it says *the person you're with* ... it means the person here."
- **BOOT** (`exo_memory/BOOT.md` and `consonance/src-tauri/brief/BOOT.md`): injected by `relabel` right after the paragraph ending "a **room you re-become yourself in.**". **SEED** (both paths): injected right after its first paragraph. It appears exactly once in each, which the test checks.
- **`main.rs:2843`:**
  - `fork_section(fork, room)` is pure.
  - `assemble_intake_within` adds `room_brief("FORK.md")` after the header and before THE ROOM, **unless the room text already carries `FORK_MARKER`**. So a seat on BOOT or SEED reads the note once, not twice. This fixes my lap-1 three-site proposal, which would have doubled it.
  - The dev tree has no FORK.md, so dev seats are unchanged.
  - 5 Rust tests (`fork_note_tests`), including the wiring order (header < note < room) and that `frag-fork.md` starts with the Rust `FORK_MARKER`. That ties the two languages together.

### 3. GATES.md shipped, and every refusal points to it
- **`consonance/GATES.md`:** the lap-1 draft, with "the keeper" in the creator sense. It cites its evidence by file name and never as a `loop/...` path, which the generator's DANGLING rule would rewrite. Ships through B's MANIFEST rule.
- **The pointer, message strings and their plumbing only.** Every hook line, for E:
  - `consonance/hooks/sources-gate.js`:
    - `:83-100` NEW: `GATES_REL`, the pure `gatesDocFrom(roomPath, exists)` and `gatesDoc()`. They resolve `<repo>/consonance/GATES.md` from `~/.consonance.json` `room_path`, which `dataDir()` already reads. With no config, or a room outside a repo, they name `consonance/GATES.md (in the Consonance repository)`.
    - `:266` `decide(..., gates = GATES_REL)`, a new last parameter. `decide` stays I/O-free.
    - `:268`: the shared deny `tail` gains " How this gate works and why: <path>, section 1 (SOURCES).", which covers all three deny reasons.
    - `:330`: `main()` passes `gatesDoc()`.
    - `:345`: the exports add `GATES_REL, gatesDocFrom, gatesDoc`.
  - `consonance/hooks/reply-slot.js`:
    - `:176` `verdict({..., gates = 'consonance/GATES.md'})`;
    - `:203`: the block reason gains " How this works and why: <path>, section 2 (the reply slot).";
    - `:228`: `main()` passes `G.gatesDoc()`, reusing the SOURCES gate's resolver as this hook already reuses its turn reader.
  - **Rust:**
    - `consonance/src-tauri/src/trailer.rs:18-21` `GATES_DOC`, a constant, because the file stays standalone. Both `refusal_text` forms gain "How this gate works and why: {gates}, section 3 (the NEXT trailer).", placed before "Nothing was delivered" and so never inside the returned message.
    - `consonance/src-tauri/src/mcp.rs:3688-3689` `trailer_gate` swaps in `crate::gates_doc_path()` (`main.rs` `gates_doc_from`, pure over `repo_root()`).
  - **No mutant anchor sits on any changed line.** I grepped `sources-gate.mutants.js` and `reply-slot.mutants.js` for the reason text and the `tail` line first (my map's standing rule).
- **The INSTALLED hooks (`~/.claude/shell/hooks/`) are not updated**: this lap installs nothing. Live refusals change when the librarian installs.

### Tests, all under the heavy-run lock, `--test-concurrency=1` (logs in `scratchpad/inv/`)
- **New and touched:** `consumer-relabel.test.js` + `sources-gate.test.js` + `reply-slot.test.js` give **103/103** (`run5.log`), including 2 new SOURCES rows (every deny names the given path; `gatesDocFrom` resolves or falls back, never throws) and 1 new reply-slot row.
- **`cargo test` (all targets):** green, **988 passed** in the main binary, 0 failed (`full1.log`); `fork_note` 5/5 (`cargo1.log`).
- **Whole consonance node suite** (`consonance/tools/*.test.js` + `consonance/hooks/*.test.js`): **2,145 tests, 2,127 pass, 12 fail, 6 skipped** (`node.tap`).
  - **The same 12 fail on a clean ea4f5bcf** (a detached worktree, the same files, `cmp1.log`: 115/12 on both): dream-gate (file level), carrier-drift x3, heavy-run WIRING, portable-paths x2, sourced "non-zero denominator", targetless-pull x4.
  - So they are pre-existing, not mine. I did not investigate them; they are probably the dirty-tree/workshop class B and A are ruling on, *inferred*.

### Corrections to myself (lap 2)
- My lap-1 plan put the fork note at all three sites with no guard. A clone-path seat would have read it twice, from the header and from BOOT; the `FORK_MARKER` check fixes that.
- Re-judging against the ruling moved four BUILDING lines (`:326-327`, `:788`, `:47`, `:965`) from my lap-1 ROLE list to provenance.
- My first pinned counts were guesses (BOOT 11, transcript-watch 0). I measured them before the test ran: 16 and 5.
- A grep with `^ℹ` matched nothing, because the reporter's lines start with colour codes, so I re-ran it.
- My heredoc append of this very section failed on a quote and wrote nothing. Written with the Write tool instead.
