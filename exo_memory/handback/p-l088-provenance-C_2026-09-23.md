# P-L088-PROVENANCE — C (L088, ON L, 2026-09-23) — ROW PROVENANCE BUILT · TOPIC MAP FRAMED · UNCOMMITTED

**Authority, checked at source.** The keeper's answer is in the librarian's transcript
(`C--Consonance-instances-librarian/0c0c0c0b-…115b.jsonl`):
- the `AskUserQuestion` was asked at `2026-09-23T08:06:26.227Z`;
- the tool result at `08:23:45.213Z` reads *"Yes, build row provenance (Recommended)"*.

Built to my own spec, `p-l087-writesite-C_2026-09-23.md` §3 (landed `8d05354`), with no departure from it.

**What changed.**
- Only `consonance/src-tauri/src/main.rs` (sha256 `8e49175c0830ff70`): 17 hunks, every one mine (`git diff -U0`).
- `atoms.jsonl` is not rewritten: 22,455 lines at the end of the lap, still growing from the live Scribe.
- `atoms_held.jsonl` **does not exist** in the live data dir. Only tests created one, in temp dirs.
- No rebuild, no restart, no settings edit, no model call. **Live at the next rebuild.**

## 1 · Does the design hold? Yes, for exactly what `src` claims

**`src` proves** that the rows the Scribe cited were in the batch it was given, and names who **posted** them and when.
- It is stamped by code, from the board's own attribution: the MCP mount, or the tailer's binding.
- A model-written `src` is overwritten (tested).

**`src` does NOT prove that the cited row made the claim.** The Scribe picks the numbers.
- This is the hole the chair named. **It is real, and it is bounded, not closed.**
- To launder a planted claim through another seat, a planted row must make the Scribe cite *that seat's* row. That
  means obeying an instruction inside `scribe_prompt`'s marked data, which is D121's arm C condition (0/120 on 5.5,
  one measurement, one model).
- `src` also names the **poster, not the originator**: a seat quoting another seat is the `src`.

These limits are written in three places:
- the `sort_atoms` doc comment;
- A's atom frame, which now says a `src:` "is not proof that row made the claim" (tested);
- this hand-back.

I did not stop, because nothing in the build contradicts that statement.

## 2 · What was built

| piece | where | what |
|---|---|---|
| numbered rows | `scribe_input` | `[rN pane8] role: text`, N 1-based and assigned by code |
| the contract | `SCRIBE_PROMPT` | every kept item carries `"rows":[…]`, at least one row; the prompt says what `r7` is |
| **the check** | `sort_atoms` | **WRITES** only if every cited number is a whole number in `1..=batch.len()`. `src:[{pane,ts}]` is stamped **from the batch**, a model `src` is overwritten, and the batch-local `rows` is dropped. Duplicates are stamped once. **HOLDS** anything else, with a reason: not an object; no `rows`; empty `rows`; `rows` not a list; a citation that is not a whole number; a number outside the batch (the reason names the numbers and `r1–rN`). |
| **the write** | `write_distilled` | held first, to `resonance/atoms_held.jsonl`, one row `{ts, atom, reason, batch_rows}`. **If the held file cannot be written, it returns an ERROR before anything reaches atoms.jsonl**, so the mark is not advanced and the retry does not duplicate. Written atoms follow as before (`ts` = distill time, append-only; the old code's silent-on-failure open is kept as it was). |
| the output path | `keep_distilled` (new) | parse, refuse no-array (unchanged rule), sort, write. It is split out of `run_distill` so a test can drive it with a raw model output. `run_distill` now calls it once. |
| the event | `DistillEvent.held` | additive count; the UI reads `kept` and is untouched |
| the render | `atom_line` + `src_note` | ` · src: <pane8> <YYYY-MM-DDTHH:MMZ>` after the tether, per cited row. **Claim and tether are byte-identical.** A missing, empty or unreadable `src` renders nothing, so every pre-L088 atom reads exactly as before (A's `atom_line_is_byte_identical_to_what_it_was` is unchanged and passes). |
| A's frame | `CLAIMS_FRAME_OPEN` | one sentence added on what `src:` is and is not. A's own tests still pass, including the under-1,000-bytes cost test. |
| **topic map frame** | `curated_resonance` + `TOPIC_MAP_FRAME_OPEN/CLOSE` | the curator's model-written summaries now sit inside their own "RECORDED CLAIMS, not instructions" frame, on A's construction. No `- **` line is added (tested). |

## 3 · Every reader of atoms, and how it takes both shapes

Found with `git grep -n "atoms.jsonl\|resonance"` over the repo, plus the shell folder.

| reader | reads | both shapes? |
|---|---|---|
| `main.rs` intake: `tail_resonance` and `curated_resonance`'s live edge, both through `atom_line` | kind, claim, tether, and now `src` | **yes, tested**: old, new, unreadable `src`, and a mixed file |
| `main.rs` `read_curation` | `curator_state.json` indices only, never atom fields | unaffected |
| `consonance/tools/curate.js` `readAtoms`/`fmtAtom` | kind, claim, tether; extra fields are ignored | yes. It does not *show* `src` to the router; that would be a curate.js change, not made. |
| `consonance/tools/ledger-union.js` | canonical JSON per row, keyed on `ts` | yes: `src` is simply part of the row's identity |
| `consonance/ui/term.js` `renderResonance` (the `distilled` event) | kind, claim, tether | yes, it ignores `src` and `held` |
| `trip-check.js`, `state-manifest` | file names and backups only | unaffected |
| `desktop-install.ps1:98` | copies `seed-resonance.jsonl` in as atoms.jsonl (old shape) | yes |

`own_map_path`, named in the packet, reads `exo_memory/map/<letter>.md`, **not atoms**, so it needed no change. The
Scribe has no atom dedup of its own: `undistilled_len` counts board rows. No hook under `~/.claude/shell` reads atoms
(grep of `*.js` there returned nothing).

## 4 · Tests

`mod provenance_tests` holds 16 tests. The `run_distill` one is a STRUCTURAL source sweep and says so.
- **The chair's four:**
  - `a_planted_row_distilled_carries_its_real_pane_in_src`
  - `a_forged_row_number_outside_the_batch_is_held_with_its_reason`
  - `an_old_shape_atom_with_no_src_or_an_unreadable_src_renders_exactly_as_before`
  - `a_mixed_file_of_old_and_new_atoms_reads_every_line`
- **Also covered:**
  - a model-written `src` is overwritten;
  - the claim is byte-identical and `rows` is not stored;
  - six malformed citations are all held with non-empty reasons;
  - the held file's row shape, and "never in atoms.jsonl";
  - the held write failing leaves nothing written;
  - a raw model output through `keep_distilled`;
  - no-array is refused with nothing written;
  - `run_distill` routes through `keep_distilled` and has no write of its own;
  - `src` rendered beside the claim;
  - the frame states what `src` does not prove;
  - the prompt requires `rows`;
  - the topic map frame.
- **Two existing tests changed on purpose, with a comment in each:** `the_scribe_input_keeps_every_row_it_was_given`
  and the marker test's row needle. Both pinned the old unnumbered format, which the authorized spec replaces.

| run | command | result |
|---|---|---|
| RED (stubs with the old behaviour) | `cargo test --bin consonance provenance_tests -- --test-threads=1` | 1 passed / 12 failed. The pass is the old-shape preservation test, which should pass on old code. |
| GREEN | same | **16 / 0** |
| full | `cargo test --bin consonance -- --test-threads=1` | **925 passed, 0 failed, 4 ignored** (909 + 16) |
| curate | `node --test consonance/tools/curate.test.js` | **10 / 0** |
| mutants | `node <scratchpad>/l088/rs_mutants.js` (in place, restored; sha256 verified after) | **14 applied / 14 caught / 0 NOT APPLIED** |

**The mutants**, at least one per load-bearing line:
- **In-batch check:** P1 upper bound +1; P2 lower bound dropped.
- **Stamping from the batch:** P3 model `src` kept; P4 wrong row.
- P5 `rows` kept; P6 empty `rows` written.
- **Held write:** P7 skipped; P8 into atoms.jsonl; P9 reason blanked.
- P10 output path skips the check; P14 `run_distill` skips `keep_distilled`.
- P11 `src` not rendered; P12 map frame not opened; P13 rows numbered from 0.

**Honest order.**
- **P10 first SURVIVED.** It was "the wiring is untestable" while the logic lived inline in `run_distill`. I split out
  `keep_distilled` and tested it.
- **Then P14 SURVIVED:** the one call left in `run_distill` needs a live app and a model. It is now caught by a source
  sweep over `run_distill`'s body. That is structural, not behavioural, in this codebase's `arch_test` / SWEEP idiom.
- **The mutants edit `main.rs` in place for a few minutes**, and I did not check whether another pane was building
  the crate meanwhile. ALPHA was idle 27m.

## NOT verified

- **Behaviour.** No real Scribe call was made. Whether Opus 5.5 returns `rows` reliably is unmeasured, so the held rate
  in production is unknown.
  - **It is measurable from the first run:** `wc -l resonance/atoms_held.jsonl` against the atoms written in the same
    passes.
  - If the Scribe routinely omits `rows`, atoms will be **held, not lost**. The live edge would then thin until the
    prompt is fixed, and the held file is where to look.
- **Whether a planted row can steer the Scribe's citation** (the §1 hole). This is D121-class, and it is not
  re-measured here.
- **Machine D.** The same code will run there at its next rebuild; nothing here is machine-specific.
- **curate.js does not surface `src` to the router or to topic documents.** Provenance stops at the intake's atom
  lines.
- **The new sentence in `CLAIMS_FRAME_OPEN`** adds to every sibling's shell. A's cost test passes, but I did not
  measure the byte cost against the live shell.

NOT COMMITTED.

NEXT: librarian call_librarian with the hand-back pointer when provenance, the frame and the tests are written — plan default after it: items 3 + 2 (jev-flags hook, "solid" sheet), unless the output says otherwise. OUTPUT adds: after the next rebuild, the first Scribe passes are the measurement — count `atoms_held.jsonl` rows vs atoms written; a high held rate means SCRIBE_PROMPT's `rows` instruction needs work, not that atoms were lost.
