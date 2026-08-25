# Pane A — the four-tier resolver, fixed and measured — 2026-08-25

**Object:** `exo_memory/loop/desktop_observations_2026-08-25.md` at `03a5fbc`.
**Owned:** `consonance/src-tauri/src/main.rs`, `consonance/tools/portable-paths.baseline.json`. Nothing else touched.
**Committed:** nothing. Both files are dirty in the shared checkout.

Every figure below re-derives from the command printed beside it. Do not quote them from here.

---

## 1. The reproduction — and why a bare temp clone is not one *on this laptop*

The chair's bar was `cargo test` green in a temp clone at a path matching neither literal. **A clone
alone does not reproduce the desktop's condition here,** and the reason is the defect itself: the
tier is `format!("{}\\Consonance\\lighthouse\\...", sysdrive())` and `C:\Consonance\lighthouse`
**exists on this machine**, so it resolves no matter which directory the tests are run from. The
literals are env-derived, so the machine has to be placed elsewhere as well as the source:

```
SystemDrive=Z:                  -> {sysdrive}\Consonance\lighthouse\...   cannot exist
USERPROFILE=<fresh temp home>   -> {home}\OneDrive\Desktop\projects\...   cannot exist
                                   and no ~/.consonance.json, and no editable data dir
```

Runner, kept verbatim: `scratchpad/run-clone-tests.sh`. It also sets `CARGO_HOME` and
`RUSTUP_HOME` back to the real ones — **the first run reported `rustup could not choose a version of
cargo`, exit 1, which is not a test failure.** Same trap the desktop caught as `127`, one coat over.

**Baseline, at `03a5fbc`, in the clone:**

```
test result: FAILED. 305 passed; 9 failed; 3 ignored     EXIT=101
```

The nine are the desktop's nine, by name, with the same panic — `brief COMMITTEE.md not found:
The system cannot find the path specified. (os error 3)`. The desktop's read is confirmed
independently, not accepted.

---

## 2. The fix

`repo_root()` — one resolved answer, two arms, replacing six literals across three resolvers.

- **Under `cargo test`:** `env!("CARGO_MANIFEST_DIR")` is `<repo>\consonance\src-tauri`, so the
  checkout is two directories up. Gated `#[cfg(test)]` **on purpose** — baking the *build* machine's
  path into a shipped binary is the same defect wearing a compile-time coat.
- **At runtime:** a developer's configured `room_path` already *is* `<repo>\exo_memory\BOOT.md`, so
  the checkout's location is on disk in `~/.consonance.json` and needs no second mechanism.

Tier 4 deleted at all three sites. The derivation `<repo>\exo_memory\BOOT.md -> <repo>` is extracted
as a **pure** function (`repo_root_from_room_path`), same reason `pick_default_room` was on 08-22:
the resolver's own candidates are absolute paths on whatever box you are standing on, so only a pure
function can be tested without becoming a test that the laptop is the laptop.

`configured_room_path()` reads the config file directly and **deliberately not** through
`get_state()` or `room_file()` — `default_room()` is itself the fallback for an empty `room_path`,
so routing back through the resolver would recurse.

**Green, same clone, same env:**

```
test result: ok. 318 passed; 0 failed; 3 ignored          EXIT=0
```

314 tests before (305 + 9), 318 after — the four added below. Identical result in this checkout
(`cd consonance/src-tauri && cargo test --quiet`), and `cargo check` (non-test build) exits 0.

---

## 3. Mutations — which site carried which red

Each restores **one** literal tier into the clone and re-runs. The clone source is byte-identical to
the working tree between runs (`cmp`).

| | mutation | result | tests that went red |
|---|---|---|---|
| **M1** | `room_brief` tier → literal | `FAILED. 311 passed; 7 failed` EXIT=101 | 3 × `committee_brief_tests`, 3 × `librarian_tests`, `shelf_tests::the_shelf_reaches_the_intake` |
| **M2** | `dev_master_path` tier → literal | `FAILED. 316 passed; 2 failed` EXIT=101 | `shelf_tests::the_shelf_carries_the_forward_pointed_layer`, `shelf_tests::the_split_between_carried_and_indexed_is_always_reported` |
| **M3** | `cards_dir` tier → literal | `ok. 318 passed; 0 failed` **EXIT=0** | — none — |

**M1 and M2 are disjoint and their union is exactly the original nine.** So "nine reds, one cause"
is right about the *class* and imprecise about the *sites*: **two** resolvers carried them, 7 and 2,
and the split is now on the record rather than inferred.

**M3 is the honest limit: `cards_dir` has no test that reaches it.** The shelf gets its cards
through the room master's own directory via `room_file()`, which is why M2 breaks the shelf and M3
does not. That third fix compiles and matches its two siblings — which is not the same as being
exercised. Stated where it applies, not buried.

*(M3 needed two attempts. The first collapsed `\\` to `\` passing through nested heredocs and failed
to compile — a harness bug reported here as a harness bug, not as a finding.)*

---

## 4. The baseline, and what the guard can actually still miss

Four `DISGUISED` sites removed, three `BENIGN-TEST` sites added (the new pure-function tests):
20 insertions / 27 deletions, and `node consonance/tools/portable-paths.js` exits 0 with `0 new`.

`--update` was **not** used for the final file: it also absorbed another pane's uncommitted removal
in `actors.test.js`. That entry was put back, so this change carries only what this change did; the
tool now prints `1 baselined site(s) no longer present` naming it, which is B's to shrink.

**Then the removal was measured rather than asserted** — a regression injected into `room_brief`,
one shape at a time (`scratchpad/guard_probe.py`):

```
R1  literal on ONE line     -> portable-paths: RED — 1 machine-specific path(s) not in the baseline   EXIT=1
R2  literal split over TWO  -> portable-paths: green — 163 known sites, 0 new                         EXIT=0
```

**R1 is the point of the removal and it works. R2 is the sharper finding.**

**This resolves the desktop's open item 6.1, and the answer is worse than either reading it
offered.** `room_brief`'s two tiers were **never baselined** — they were *invisible*.
`portable-paths.js:214` requires a portable prefix and a machine segment **on the same line**, and
that `format!` split them across two. So the guard was exempting four harmless-by-comparison cousins
in `dev_master_path` and `cards_dir` while the pair that actually broke the suite was never seen at
all. It is still blind to that shape today. **`portable-paths.js` is not mine — the multi-line
detector is handed up, not fixed here.**

The irony B named last night holds and sharpens: the exemption list is the only reason anyone could
see four of the six, and a line-based scanner is the reason nobody saw the other two.

---

## 5. Tests added (4)

`repo_root_tests` — three on the pure derivation (the real config shape; empty and whitespace;
no-grandparent → `None` rather than a drive root, which would send every later `join` looking for a
brief directory at the top of the disk), and one that asserts the resolver finds **the checkout this
crate is compiled from**, wherever that is. That last one is the regression made executable: it is
the assertion the nine tests only appeared to be making.

---

## 6. A behaviour change, stated rather than smuggled

**At runtime the fix is NARROWER than what it replaced.** A developer whose `room_path` is *empty*
is no longer recognised as carrying the repo and wakes into SEED rather than BOOT. "Is the checkout
at the one known location" was the defect, not the premise — but this is a real change, and it is
the chair's call whether it stands. Both machines in this room have `room_path` set to their own
repo's BOOT.md (`~/.consonance.json` here; the desktop's is quoted in its own §0), so neither is
affected in practice.

## 7. What this does NOT establish

1. **Production is still not shown broken *or* fixed.** The desktop's §3 correction is kept intact
   and not widened: `target/release` carries the bundled briefs and tiers 1–2 resolve at runtime.
   The demonstrated failure was, and remains, the `cargo test` path. **No app was launched.**
2. **The runtime arm of `repo_root()` has no automated coverage.** `cargo test` always takes the
   `#[cfg(test)]` arm, by design. What is tested is the pure derivation plus the composition under
   test; "read config → derive → check" as a runtime whole is unexercised.
3. **`cards_dir`'s fix is unexercised** — M3, above.
4. **The JS suite was not run.** `actors.test.js`, `js-suite.js` and `lap-row.test.js` are dirty in
   this shared checkout under B and C; a result from here would measure their in-flight work, not
   this change.
5. **Nothing about the other ~100 commits.**
